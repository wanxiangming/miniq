document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/MDate.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/TextTranslator.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');


function host(){
	var timePicker=$("#mainTimePicker");
	var mainTable=$("#mainTable");
	var timePickerInput=$("#timePickerInput");
	var logTableAry=[];
	var logScopeList=[];
	var aDay=Number(86400000);
	var dayNum=6;
	var theDataNeedToRequest=[];
	var theDataIsHas=[];
	var isGetTransactionActivityComplete=true;
	var selectData=new Date();
	var getLogTableList=GetLogTableList.creatNew(openId);
	var createTransactionModal=CreateTransactionModal.creatNew();
	var changeTransactionModal=ChangeTransactionModal.creatNew();
	var logScope=LogScope.creatNew(mainTable);
	var dayLogAry=DayLogAry.creatNew();
	var test;

	logScope.initByTime(selectData);

	timePicker.datetimepicker({
		language:'zh-CN',
		weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		initialDate:new Date()
    }).on('changeDate',function(ev){
    	selectData=ev.date;
    	pushDataAryToTheDataNeedToRequest(everyDayBeginTimeAry(selectData,dayNum));
    	flashLogScope(ev.date);
    });
    timePicker.datetimepicker('update',selectData);
    pushDataAryToTheDataNeedToRequest(everyDayBeginTimeAry(selectData,dayNum));

	function everyDayBeginTimeAry(SELECT_DATA,DAY_NUM){
		var time=MDate.creatNew(SELECT_DATA).getTheDayBeginingTime().getTime();
		var timeAry=[];
		for(var i=0; i<DAY_NUM; i++){
			timeAry.push(time);
			time+=aDay;
		}
		return timeAry;
	}

	timePickerInput.bind('mousewheel',function(event,delta){
		var dl=delta > 0 ? false:true;
		if(dl){
			pushDataToTheDataNeedToRequest(MDate.creatNew(selectData).getTheDayBeginingTime().getTime()+dayNum*aDay);
			selectData.setDate(Number(selectData.getDate())+1);
		}
		else{
			pushDataToTheDataNeedToRequest(MDate.creatNew(selectData).getTheDayBeginingTime().getTime()-aDay);
			selectData.setDate(Number(selectData.getDate())-1);
		}
		timePicker.datetimepicker('update',selectData);
		flashLogScope(selectData);
	});

	function pushDataAryToTheDataNeedToRequest(ARY){
		$.each(ARY,function(index,value){
    		pushDataToTheDataNeedToRequest(value);
    	});
	}

	function pushDataToTheDataNeedToRequest(DATA){
		theDataNeedToRequest.push(DATA);
	}

	setInterval(function(){
		getTransactionFromInternet();
	},200);

	function getTransactionFromInternet(){
		var theNewDataNeedToRequest=getTheDataNeedToRequestAry();
		if(isGetTransactionActivityComplete && theNewDataNeedToRequest.length!=0){
			isGetTransactionActivityComplete=false;
			var getTransactionByTimeAry=GetTransactionByTimeAry.creatNew(openId,theNewDataNeedToRequest);
			getTransactionByTimeAry.onSuccessLisenter(function(data){
				$.each(data,function(index,value){
					$.each(value.transactionInfo,function(transactionInfoIndex,transactionInfoValue){
						$.each(transactionInfoValue,function(transactionInfoIndex,transactionValue){
							var logTransaction=LogTransactionItem.creatNew();
							logTransaction.setLogTableUserId(value.userId);
							logTransaction.setLogTableId(value.tableId);
							logTransaction.setLogTableAnotherName(value.anotherName);
							logTransaction.setLogTableCreatorId(value.creatorId);
							logTransaction.setLogTableState(value.tableState);
							logTransaction.setLogTransactionId(transactionValue.id);
							logTransaction.setLogTransactionContent(transactionValue['content']);
							logTransaction.setLogTransactionTime(transactionValue['time']);	//time就是flag，用flag找到dayLog，add进去
							var dayLog=dayLogAry.getDayLog(MDate.creatNew(Number(transactionValue['time'])).getDayFlag());
							initTransactionItem(logTransaction,dayLog);
							dayLog.addTransaction(logTransaction);
						});
					});
				});
				eachDaylogAry(function(DAYLOG){
					DAYLOG.loadComplete();
				});
				pushDataToTheDataIsHas(theNewDataNeedToRequest);
				isGetTransactionActivityComplete=true;
				flashLogScope(selectData);
			});
			getTransactionByTimeAry.launch();
			eachDaylogAry(function(DAYLOG){
				DAYLOG.loading();
			});
		}

		function eachDaylogAry(CALL_BACK){
			$.each(theNewDataNeedToRequest,function(index,value){
				CALL_BACK(dayLogAry.getDayLog(MDate.creatNew(value).getDayFlag()));
			});
		}

	}

	function initTransactionItem(LOG_TRANSACTION,DAYLOG){
		LOG_TRANSACTION.onClickListener(function(){
			changeTransactionModal.initChangeTransactionModalBeforeShow(LOG_TRANSACTION,function(data,content,time){
				if(data == 0){
					DAYLOG.changeTransactionById(LOG_TRANSACTION.getLogTransactionId(),content,time);
				}
			},function(data){
				if(data == 0){
					DAYLOG.deleteTransactionById(LOG_TRANSACTION.getLogTransactionId());
				}
			});
		});
	}

	//返回一个数组，仅包含最新需要请求的transaction的日期，且不重复
	function getTheDataNeedToRequestAry(){
		var theNewDataNeedToRequest=[];
		theDataNeedToRequest=eliminatingDuplicateForAry(theDataNeedToRequest);
		$.each(theDataNeedToRequest,function(index,value){
			if($.inArray(value,theDataIsHas) == -1){
				theNewDataNeedToRequest.push(value);
			}
		});
		return theNewDataNeedToRequest;
	}

	function pushDataToTheDataIsHas(NEWDATA){
		theDataIsHas=theDataIsHas.concat(NEWDATA);
		theDataIsHas=eliminatingDuplicateForAry(theDataIsHas);
	}

	function  eliminatingDuplicateForAry(ARY){
		var newAry=[];
		$.each(ARY,function(index,value){
			if($.inArray(value,newAry) == -1){
				newAry.push(value);
			}
		});
		return newAry;
	}

	var getLogTableAryByInternet=GetLogTableAryByInternet.creatNew(openId);
	getLogTableAryByInternet.launch(function(ARY){
		logTableAry=ARY;
		if(!createTransactionModal.hasTableSelectData()){
			$.each(ARY,function(index,value){
				if(value.isMaster()){
					createTransactionModal.appendOptionToTableSelect(value.getLogTableId(),value.getLogTableAnotherName());
				}
			});
		}
		flashLogScope(selectData);
	},function(){

	});

	function flashLogScope(DATE){
		logScope.each(function(index,value,flag){
			if(dayLogAry.isDayLogExist(flag)){
				dayLogAry.getDayLog(flag).hide();
			}
		});
		logScope.flashByTime(DATE);
		logScope.each(function(index,value,flag){
			if(!dayLogAry.isDayLogExist(flag)){
				var dayLog=DayLog.creatNew(flag);
				dayLog.setDateBtnOnClickLstener(function(time){
					createTransactionModal.initCreateTransactionModal(time,function(tableId,content,transactionTime,transactionId){
						var logTable=getLogTableObjByTableId(tableId);
						var logTransaction=LogTransactionItem.creatNew();
						logTransaction.setLogTableId(logTable.getLogTableId());
						logTransaction.setLogTableState(logTable.getLogTableState());
						logTransaction.setLogTableCreatorId(logTable.getLogTableCreatorId());
						logTransaction.setLogTableAnotherName(logTable.getLogTableAnotherName());
						logTransaction.setLogTableUserId(logTable.getLogTableUserId());
						logTransaction.setLogTransactionContent(content);
						logTransaction.setLogTransactionTime(transactionTime);
						logTransaction.setLogTransactionId(transactionId);
						initTransactionItem(logTransaction,dayLog);
						dayLog.addTransaction(logTransaction);
					});
				});
				dayLog.show().appendTo(value.ui);
				dayLogAry.addDayLog(dayLog);
			}
			else{
				dayLogAry.getDayLog(flag).show().appendTo(value.ui);
			}
		});
	}

	function getLogTableObjByTableId(TABLEID){
		var logTable;
		$.each(logTableAry,function(index,value){
			if(value.getLogTableId() == TABLEID){
				logTable=value;
			}
		});
		return logTable;
	}

	function getDateByTimePickerInput(){
		var time=timePickerInput.val();
		var timeAry=time.split("-");
		var date=new Date();
		date.setFullYear(timeAry.shift());
		date.setMonth(Number(timeAry.shift())-1);
		date.setDate(timeAry.shift());
		return date;
	}
}




















var DayLogAry={
	creatNew:function(){
		var DayLogAry={};

		var dayLogAry=[];

		DayLogAry.addDayLog=function(DAYLOG){
			dayLogAry.push(DAYLOG);
		}

		DayLogAry.getDayLog=function(FLAG){
			var daylog;
			$.each(dayLogAry,function(index,value){
				if(value.getFlag() == FLAG)
					daylog=value;
			});
			return daylog;
		}

		DayLogAry.isDayLogExist=function(FLAG){
			var isExist=false;
			$.each(dayLogAry,function(index,value){
				if(value.getFlag() == FLAG)
					isExist=true;
			});
			return isExist;
		}

		DayLogAry.iterator=function(CALL_BACK){
			$.each(dayLogAry,function(index,value){
				CALL_BACK(index,value);
			});
		}

		return DayLogAry;
	}
}

var DayLog={
	creatNew:function(TIME){
		var DayLog={};

		var theDayTime=MDate.creatNew(TIME);	
		var theDayFlag=theDayTime.getDayFlag();
		var logTransactionAry=LogTransactionAry.creatNew();
		var scope=Div.creatNew();
		var dateBtn=Button.creatNew();
		var loaderScope=Div.creatNew();
		var dateBtnOnClickListener;
		var loaderPiano=LoaderPiano.creatNew();

		init();

		function init(){
			initDateBtn();
			dateBtn.appendTo(scope.ui);
			initloadUi();
		}

		function initloadUi(){
			loaderPiano.appendTo(loaderScope.ui);
			hideLoad();
			loaderScope.setAttribute("style","position:absolute;top:15%;left:80%");
			loaderScope.appendTo(dateBtn.ui);
		}

		function initDateBtn(){
			dateBtn.html(theDayTime.getChineseDay()+"&nbsp;&nbsp;&nbsp;"+theDayTime.getDate());
			dateBtn.addClass("btn text-center col-xs-12");
			if(isToday()){
				dateBtn.addClass("btn-info");
			}
			else{
				dateBtn.addClass("btn-activity-main-dateBtn");
			}
		}

		function isToday(){
			var todayFlag=MDate.creatNew(new Date()).getDayFlag();
			return theDayFlag == todayFlag;
		}

		DayLog.show=function(){
			show();
			return scope;
		}

		function show(){
			scope.removeClass('hide');
		}

		DayLog.addTransaction=function(TRANSACTION){
			TRANSACTION.getTransactionButton().appendTo(scope.ui);
			logTransactionAry.push(TRANSACTION);
		}

		DayLog.deleteTransactionById=function(ID){
			logTransactionAry.each(function(index,value){
				if(value.getLogTransactionId() == ID){
					value.hide();
				}
			});
			logTransactionAry.deleteByTransactionId(ID);
		}

		DayLog.changeTransactionById=function(ID,CONTENT,TIME){
			transaction=logTransactionAry.findById(ID);
			transaction.changeTransactionContent(CONTENT,TIME);
		}

		DayLog.setDateBtnOnClickLstener=function(CALL_BACK){
			dateBtnOnClickListener=CALL_BACK;
			dateBtn.setAttribute("data-toggle","modal");
			dateBtn.setAttribute("data-target","#create_log_transaction_modal");
			dateBtn.ui.on("click",function(){
				dateBtnOnClickListener(theDayTime);
			});
		}

		DayLog.getFlag=function(){
			return  theDayFlag;
		}

		DayLog.hide=function(){
			scope.addClass('hide');
		}

		DayLog.loading=function(){
			showLoad();
		}

		function showLoad(){
			loaderPiano.show();
		}

		DayLog.loadComplete=function(){
			hideLoad();
		}

		function hideLoad(){
			loaderPiano.hide();
		}

		return DayLog;
	}
}


var LogScope={
	creatNew:function(PARENT_UI){
		var LogScope={};

		var logScopeList=[];
		var aDay=Number(86400000);
		var dayNum=6;
		var parentUI=PARENT_UI;
		PARENT_UI.attr("style","height:350px;border-bottom: 1px solid #DADADA; border-left: 1px solid #DADADA; border-right: 1px solid #DADADA;");

		LogScope.initByTime=function(FIRST_DAY_TIME){
			setLogScope(FIRST_DAY_TIME);
		}

		LogScope.flashByTime=function(FIRST_DAY_TIME){
			// emptyLogScope();
			setTimeForLogScope(FIRST_DAY_TIME);
		}

		LogScope.each=function(CALL_BACK){
			$.each(logScopeList,function(index,value){
				CALL_BACK(index,value,Number(value.getAttribute("todayTime")));
			});
		}

		function emptyLogScope(){
			$.each(logScopeList,function(index,value){
				value.html("");
			});
		}

		function setLogScope(THE_BEGINING_DATE){
			for(i=0; i<dayNum; i++){
				var logScope=Div.creatNew();
				logScope.addClass("col-xs-2");
				logScope.appendTo(parentUI);
				logScopeList.push(logScope);
			}
			setTimeForLogScope(THE_BEGINING_DATE);
		}

		function setTimeForLogScope(TIME){
			var time=MDate.creatNew(TIME).getTheDayBeginingTime().getTime();	//时间在这里才转换为了beginningTime
			$.each(logScopeList,function(index,value){
				value.setAttribute("todayTime",time);
				time+=aDay;
			});
		}

		return LogScope;
	}
}


var LogTransactionAry={
	creatNew:function(){
		var LogTransactionAry={};

		var logTransactionAry=[];

		LogTransactionAry.push=function(LOGTRANSACTION){
			logTransactionAry.push(LOGTRANSACTION);
		}

		LogTransactionAry.each=function(CALL_BACK){
			$.each(logTransactionAry,function(index,value){
				CALL_BACK(index,value);
			});
		}

		LogTransactionAry.sort=function(){
			logTransactionAry.sort(function(valueA,valueB){
				if(valueA.getLogTransactionTime() == valueB.getLogTransactionTime()){
					return valueA.getLogTransactionId() > valueB.getLogTransactionId() ? 1:-1;
				}
				else{
					return valueA.getLogTransactionTime() > valueB.getLogTransactionTime() ? 1:-1;
				}
			});
		}

		LogTransactionAry.deleteByTransactionId=function(TRANSACTION_ID){
			logTransactionAry=$.grep(logTransactionAry,function(value,index){
				if(value.getLogTransactionId() == TRANSACTION_ID)
					return false;
				else
					return true;
			});
		}

		LogTransactionAry.findById=function(TRANSACTION_ID){
			var transaction;
			LogTransactionAry.each(function(index,value){
				if(value.getLogTransactionId() == TRANSACTION_ID){
					transaction=value;
				}
			});
			return transaction;
		}

		return LogTransactionAry;
	}
}


var LogTransactionItem={
	creatNew:function(){
		var LogTransactionItem=LogTransaction.creatNew();

		var textTranslator=TextTranslator.creatNew();
		var div=Div.creatNew();
		var btn=Button.creatNew();
		var onClickListener;

		btn.addClass("btn btn-default text-center col-xs-12 ");
		btn.setAttribute("style","text-overflow:ellipsis;overflow:hidden");
		btn.setAttribute("data-toggle","popover");
		btn.setAttribute("data-container","body");
		btn.setAttribute("data-trigger","hover");
		btn.setAttribute("data-html","true");
		btn.appendTo(div.ui);

		LogTransactionItem.onClickListener=function(ONCLICKLISTENER){
			onClickListener=ONCLICKLISTENER;
		}

		LogTransactionItem.getTransactionButton=function(){
			initTransactionItemUI();

			if(isMineTransaction()){
				btn.setAttribute("data-toggle","modal");
				btn.setAttribute("data-target","#change_log_transaction_modal");
				btn.onClickListener(onClickListener);
			}
			else{
				btn.onClickListener(function(){
					btn.addClass("wobble animated");
				});
				btn.ui.on("animationend",function(){
					btn.removeClass("wobble animated");
				});
			}

			return div;
		}

		function initTransactionItemUI(){
			var time=new Date(LogTransactionItem.getLogTransactionTime());
			btn.html("<span>"+textTranslator.encodeEnterToSpacing(LogTransactionItem.getLogTransactionContent())+"</span>");
			setPopover(LogTransactionItem.getLogTableAnotherName(),"<strong>"+time.getHours()+":"+time.getMinutes()+"</strong>"+"<br/>"+LogTransactionItem.getLogTransactionContent());
		}

		LogTransactionItem.changeTransactionContent=function(CONTENT,TIME){
			LogTransactionItem.setLogTransactionContent(CONTENT);
			LogTransactionItem.setLogTransactionTime(TIME);
			initTransactionItemUI();
		}

		LogTransactionItem.hide=function(){
			div.addClass("hide");
		}

		function setPopover(TITLE,CONTENT){
			btn.setAttribute("title",TITLE);
			btn.setAttribute("data-content",CONTENT);
			btn.ui.popover();
		}

		function isMineTransaction(){
			return LogTransactionItem.getLogTableUserId() == LogTransactionItem.getLogTableCreatorId() ? true:false;
		}

		return LogTransactionItem;
	}
}

var TransactionModal={
	creatNew:function(){
		var TransactionModal={};

		var textTranslator=TextTranslator.creatNew();

		TransactionModal.hourBind=function(HOUR,HOUR_UP,HOUR_DOWN){
			HOUR_UP.bind("click",function(){
				HOUR.html(hourUp(HOUR.html()));
			});
			HOUR_DOWN.bind("click",function(){
				HOUR.html(hourDown(HOUR.html()));
			});
		}

		TransactionModal.minuteBind=function(MINUTE,MINUTE_UP,MINUTE_DOWN){
			MINUTE_UP.bind("click",function(){
				MINUTE.html(minuteUp(MINUTE.html()));
			});
			MINUTE_DOWN.bind("click",function(){
				MINUTE.html(minuteDown(MINUTE.html()));
			});
		}

		TransactionModal.encodeText=function(TEXT){
			return textTranslator.encodeText(TEXT);
		}

		TransactionModal.decodeText=function(TEXT){
			return textTranslator.decodeText(TEXT);
		}

		function hourUp(HOUR){
			HOUR=Number(HOUR);
			if(HOUR < 23)
				return HOUR+1;
			else
				return HOUR;
		}

		function hourDown(HOUR){
			HOUR=Number(HOUR);
			if(HOUR > 0)
				return HOUR-1;
			else 
				return HOUR;
		}

		function minuteUp(MINUTE){
			var MINUTE=Number(MINUTE);
			if(MINUTE < 50)
				return MINUTE+10;
			else
				return MINUTE;
		}

		function minuteDown(MINUTE){
			var MINUTE=Number(MINUTE);
			if(MINUTE > 0)
				return MINUTE-10;
			else
				return MINUTE;
		}
		
		return TransactionModal;
	}
}

var CreateTransactionModal={
	creatNew:function(){
		var CreateTransactionModal=TransactionModal.creatNew();

		var createTransactionModal=$("#create_log_transaction_modal");
		var createTransactionModalTableSelect=$("#create_log_modal_tableSelect");
		var createTransactionModalHourUpBtn=$("#create_log_modal_hour_up_btn");
		var createTransactionModalHourDownBtn=$("#create_log_modal_hour_down_btn");
		var createTransactionModalMinuteUpBtn=$("#create_log_modal_minute_up_btn");
		var createTransactionModalMinuteDownBtn=$("#create_log_modal_minute_down_btn");
		var createTransactionModalHour=$("#create_log_modal_hour");
		var createTransactionModalMinute=$("#create_log_modal_minute");
		var createTransactionModalContentTextarea=$("#create_log_modal_content_input");
		var createTransactionModalCreateBtn=$("#create_log_modal_create_btn");

		CreateTransactionModal.hourBind(createTransactionModalHour,createTransactionModalHourDownBtn,createTransactionModalHourUpBtn);
		CreateTransactionModal.minuteBind(createTransactionModalMinute,createTransactionModalMinuteDownBtn,createTransactionModalMinuteUpBtn);
		createTransactionModal.on("hidden.bs.modal",function(e){
			createTransactionModalContentTextarea.val("");
		});

		CreateTransactionModal.initCreateTransactionModal=function(BEGINNING_TIME_OF_TODAY,SECCESS_CALL_BACK){
			var mDate=MDate.creatNew(BEGINNING_TIME_OF_TODAY);
			createTransactionModalCreateBtn.unbind().bind("click",function(){
				var tableId=createTransactionModalTableSelect.val();
				var content=CreateTransactionModal.encodeText(createTransactionModalContentTextarea.val());
				var hour=createTransactionModalHour.html();
				var minute=createTransactionModalMinute.html();
				var transactionTime;
				mDate.setHours(hour);
				mDate.setMinutes(minute);
				transactionTime=mDate.getTime();
				var createLogTransaction=CreateLogTransaction.creatNew(tableId,transactionTime,content);
				createLogTransaction.onSuccessLisenter(function(data){
					SECCESS_CALL_BACK(tableId,content,transactionTime,data);
					createTransactionModal.modal('hide');
				});
				createLogTransaction.launch();
			});
		}

		CreateTransactionModal.hasTableSelectData=function(){
			return $("#create_log_modal_tableSelect option").length==0 ? false:true;	//有数据返回true，没有返回false
		}

		CreateTransactionModal.appendOptionToTableSelect=function(TABLEID,ANOTHERNAME){
			createTransactionModalTableSelect.append("<option value="+TABLEID+">"+ANOTHERNAME+"</option>");
		}

		return CreateTransactionModal;
	}
}

var ChangeTransactionModal={
	creatNew:function(){
		var ChangeTransactionModal=TransactionModal.creatNew();

		var changeTransactionModal=$("#change_log_transaction_modal");
		var changeTransactionModalTableName=$("#change_log_transaction_modal_tableName");
		var changeTransactionModalHourUpBtn=$("#change_log_modal_hour_up_btn");
		var changeTransactionModalHourDownBtn=$("#change_log_modal_hour_down_btn");
		var changeTransactionModalMinuteUpBtn=$("#change_log_modal_minute_up_btn");
		var changeTransactionModalMinuteDownBtn=$("#change_log_modal_minute_down_btn");
		var changeTransactionModalHour=$("#change_log_modal_hour");
		var changeTransactionModalMinute=$("#change_log_modal_minute");
		var changeTransactionModalContentTextarea=$("#change_log_modal_content_input");
		var changeTransactionModalChangeBtn=$("#change_log_modal_change_btn");
		var changeTransactionModalDeleteBtn=$("#change_log_modal_delete_btn");
		var changeTransactionModalDeleteCheckModalConfirmBtn=$("#checkAction_btn");
		var changeTransactionModalActionConfirmModal=$("#checkAction_Modal");
		var mDate;
		var logTransaction;
		var content;

		ChangeTransactionModal.hourBind(changeTransactionModalHour,changeTransactionModalHourDownBtn,changeTransactionModalHourUpBtn);
		ChangeTransactionModal.minuteBind(changeTransactionModalMinute,changeTransactionModalMinuteDownBtn,changeTransactionModalMinuteUpBtn);

		ChangeTransactionModal.initChangeTransactionModal=function(LOG_TRANSACTION,CHANGE_SECCESS_CALL_BACK,DELETE_SECCESS_CALL_BACK){
			logTransaction=LOG_TRANSACTION;
			mDate=MDate.creatNew(logTransaction.getLogTransactionTime());
			content=logTransaction.getLogTransactionContent();
			changeTransactionModalHour.html(mDate.getHours());
			changeTransactionModalMinute.html(mDate.getMinutes());
			changeTransactionModalTableName.val(logTransaction.getLogTableAnotherName());
			changeTransactionModalContentTextarea.val(ChangeTransactionModal.decodeText(content));
			initChangeTransactionModalChangeBtn(CHANGE_SECCESS_CALL_BACK);
			initChangeTransactionModalDeleteBtn(DELETE_SECCESS_CALL_BACK);
		}

		function initChangeTransactionModalChangeBtn(CHANGE_SECCESS_CALL_BACK){
			changeTransactionModalChangeBtn.unbind().bind("click",function(){
				content=ChangeTransactionModal.encodeText(changeTransactionModalContentTextarea.val());
				mDate.setHours(changeTransactionModalHour.html());
				mDate.setMinutes(changeTransactionModalMinute.html());
				var changeLogTransaction=ChangeLogTransaction.creatNew(logTransaction.getLogTransactionId(),mDate.getTime(),content);
				changeLogTransaction.onSuccessLisenter(function(data){
					if(data == 0){
						changeTransactionModal.modal('hide');
					}
					CHANGE_SECCESS_CALL_BACK(data,content,mDate.getTime());
				});
				changeLogTransaction.launch();
			});
		}

		function initChangeTransactionModalDeleteBtn(DELETE_SECCESS_CALL_BACK){
			changeTransactionModalDeleteCheckModalConfirmBtn.unbind().bind("click",function(){
				var deleteLogTransaction=DeleteLogTransaction.creatNew(logTransaction.getLogTransactionId());
				deleteLogTransaction.onSuccessLisenter(function(data){
					if(data == 0){
						changeTransactionModalActionConfirmModal.modal('hide');
						changeTransactionModal.modal('hide');
					}
					DELETE_SECCESS_CALL_BACK(data);
				});
				deleteLogTransaction.launch();
			});
		}

		return ChangeTransactionModal;
	}
}


