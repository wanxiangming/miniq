

minclude("DaylogManager");
minclude("AttentionTableInfoManager");
minclude("CreateTransactionModal");
minclude("ChangeTransactionModal");

var createTransactionModal=null;
var changeTransactionModal=null;

function host(){
	var mainTable=$("#mainTable");
	createTransactionModal=CreateTransactionModal.creatNew();
	changeTransactionModal=ChangeTransactionModal.creatNew();

	var changeModal=TransactionModal.creatNew();
	var changeTransactionModalHourUpBtn=$("#change_log_modal_hour_up_btn");
	var changeTransactionModalHourDownBtn=$("#change_log_modal_hour_down_btn");
	var changeTransactionModalMinuteUpBtn=$("#change_log_modal_minute_up_btn");
	var changeTransactionModalMinuteDownBtn=$("#change_log_modal_minute_down_btn");
	var changeTransactionModalHour=$("#change_log_modal_hour");
	var changeTransactionModalMinute=$("#change_log_modal_minute");
	changeModal.hourBind(changeTransactionModalHour,changeTransactionModalHourDownBtn,changeTransactionModalHourUpBtn);
	changeModal.minuteBind(changeTransactionModalMinute,changeTransactionModalMinuteDownBtn,changeTransactionModalMinuteUpBtn);


	var createModal=TransactionModal.creatNew();
	var createTransactionModalTableSelect=$("#create_log_modal_tableSelect");
	var createTransactionModalHourUpBtn=$("#create_log_modal_hour_up_btn");
	var createTransactionModalHourDownBtn=$("#create_log_modal_hour_down_btn");
	var createTransactionModalMinuteUpBtn=$("#create_log_modal_minute_up_btn");
	var createTransactionModalMinuteDownBtn=$("#create_log_modal_minute_down_btn");
	var createTransactionModalHour=$("#create_log_modal_hour");
	var createTransactionModalMinute=$("#create_log_modal_minute");
	createModal.hourBind(createTransactionModalHour,createTransactionModalHourDownBtn,createTransactionModalHourUpBtn);
	createModal.minuteBind(createTransactionModalMinute,createTransactionModalMinuteDownBtn,createTransactionModalMinuteUpBtn);

	var attentionTableInfoManager=AttentionTableInfoManager.creatNew();
	attentionTableInfoManager.onSuccess(function(){
		var attentionTableAry=attentionTableInfoManager.getAttentionTableAry();
		$.each(attentionTableAry,function(index,value){
			if(value.isManager()){
				createTransactionModalTableSelect.append("<option value="+value.getTableId()+">"+value.getTableName()+"</option>");
			}
		});

		var daylogManager=DaylogManager.creatNew(mainTable);
		daylogManager.whatINeed(function(TIME_ARY){
			var def=$.Deferred();
			var allTableIdAry=attentionTableInfoManager.getAllTableIdAry();
			var getTransaction=GetTransaction.creatNew(allTableIdAry,TIME_ARY);
			getTransaction.onSuccessLisenter(function(DATA){
				var transactionDataStructureAry=[];
				$.each(DATA,function(index, el) {
					var transaction=Transaction.creatNew();
					transaction.setTransactionId(el.id);
					transaction.setTableId(el.tableId);
					transaction.setContent(el.content);
					transaction.setTime(el.time);
					transactionDataStructureAry.push(TransactionDataStructure.creatNew(attentionTableAry,transaction));

				});
				def.resolve(transactionDataStructureAry);
			});
			getTransaction.launch();
			return def;
		});
		daylogManager.onCreate(function(TABLE_ID,CONTENT,TIME){
			var def=$.Deferred();
			var createLogTransaction=CreateLogTransaction.creatNew(TABLE_ID,TIME,CONTENT);
			createLogTransaction.onSuccessLisenter(function(data){
				var transaction=Transaction.creatNew();
				transaction.setTransactionId(data);
				transaction.setTableId(TABLE_ID);
				transaction.setContent(CONTENT);
				transaction.setTime(TIME);
				def.resolve(TransactionDataStructure.creatNew(attentionTableAry,transaction));
			});
			createLogTransaction.onErrorLisenter(function(){
				def.reject();
			});
			createLogTransaction.launch();
			return def;
		});
		daylogManager.onChange(function(TRANSACTION_ID,CONTENT,TIME){
			var def=$.Deferred();
			var changeLogTransaction=ChangeLogTransaction.creatNew(TRANSACTION_ID,TIME,CONTENT);
			changeLogTransaction.onSuccessLisenter(function(data){
				if(data == 0){
					def.resolve();
				}
			});
			changeLogTransaction.onErrorLisenter(function(){
				def.reject();
			});
			changeLogTransaction.launch();
			return def;
		});
		daylogManager.onDelete(function(TRANSACTION_ID){
			var def=$.Deferred();
			var deleteLogTransaction=DeleteLogTransaction.creatNew(TRANSACTION_ID);
			deleteLogTransaction.onSuccessLisenter(function(data){
				if(data == 0){
					def.resolve();
				}
			});
			deleteLogTransaction.onErrorLisenter(function(){
				def.reject();
			});
			deleteLogTransaction.launch();
			return def;
		});
	});
	attentionTableInfoManager.launch();

}


var TransactionModal={
	creatNew:function(){
		var TransactionModal={};

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




























minclude("Table");
minclude("AttentionTable");
minclude("Transaction");
minclude("TransactionDataStructure");
minclude("Daylog");
minclude("LoaderPiano");
/**
 * 它维护一个TransactionDataStructure池，当一个TransactionDataStructure被add到了一个Daylog中去，这个TransactionDataStructure就从池中移除，
 * 它从网络上获取到的这些TransactionDataStructure并不一定有Daylog可以去（因为适合这个TransactionDataStructure的Daylog可能还不存在），它们会
 * 暂时待在池中，直到被某个Daylog收走
 * 
 * 它会维护一个Daylog池，用户改变scopArea的时候，它会hide掉正在显示的，然后去池中找对应的Daylog，如果没有则创建新的Daylog，然后将对应的Daylog在相应的位置show出来
 * 定时器每执行一次，获取正在显示的Daylog的dayFlag，去已加载成功dayFlag数组中查询，如果没有，说明它还没有从网络上获取数据，这时将这个dayFlag添加到needRequestAry中
 * 所有正在显示的Daylog都查询完后，发起网络请求，获取到数据后将needRequestAry中的数据添加到已加载成功dayFlag数组中
 * 
 * 它持有页面上的scopArea，由它来组织Daylog的位置
 * 
 * 它会告诉外界它需要什么数据，让外界去网络上获取
 * 
 * 当外界告诉他根据tableId过滤信息的时候，它会去遍历自己的DaylogAry，对每一个都执行过滤
 *
 * 它会在进行网络请求的时候，进入loading状态，网络请求成功后回到loadingComplete状态。（包括获取数据和onCreate，onDelete，onChange，inSimplModal)
 *
 * outSimplModal的情况下：
 * 		当日志滑动出现有数据集时，它会阻止滚动，并发起网络请求，从网络上获取足够的数据，获取结束再开启滚动，并将数据组织好显示出来
 *   	Daylog获取到数据可以根据filt的情况给它或者它里面的transaction打上visible标记
 * 
 * DaylogManager(SCOPE)
 * 		whatINeed(CALL_BACK(timeAry))	//当它请求一些数据时，你可以做一些事，返回Deferred对象，以及TransacitonDataStructure对象数组
 * 		
 * 	    //nextMonth(CALL_BACK(time))
 * 	    //lastMonth(CALL_BACK(time))
 * 	    
 * 		onCreate(CALL_BACK(tableId,content,time))		//当transaction被创建的时候，你可以做一些事情，返回Deferred对象，以及TransacitonDataStructure对象
 * 		onDelete(CALL_BACK(transactionId))				//当transaction被删除的时候，你可以做一些事情，返回Deferred对象
 * 		onChange(CALL_BACK(transactionId,content,time))	//当transaction被修改的时候，你可以做一些事情，返回Deferred对象
 *
 * 		//精简模式先放一放，以后再做！！！
 * 		inSimplModal()	//进入精简模式，也就是不显示空白日的模式，精简模式会获取过去一年以及未来一年内的所有数据，并制作成精简显示版
 * 		outSimplModal()	//退出精简模式
 * 		
 * 		filtByDay(day)					//只显示某天的信息，如每个周的星期一（星期1）
 * 		filtByDate(date)				//只显示某日期的信息，如每月的3号（3日）
 * 		filtByContent(string)			//只显示内容包含某个特定字符串的transaction
 * 		filtByTableId(tableIdAry)		//只显示特定日程的transaction
 * 		filtByTableName(tableAnotherNameAry)	//只显示特定日程的transaction
 * 		clearFilt()						//移除filt限制
 */
var DaylogManager={
	creatNew:function(SCOPE){
		var DaylogManager={};

		var div=Div.creatNew();
		var daylogScopeList=[];
		var loadCompleteDayFlagAry=[];
		var daylogAry=[];
		var dayNum=6;
		var oneDayMS=Number(86400000);
		var timePicker=$("#mainTimePicker");
		var timePickerInput=$("#timePickerInput");
		var loaderScope=$("#loaderScope");
		var loaderPiano=LoaderPiano.creatNew();

		var e_internetQuest=function(dayFlagAry){return $.Deferred();};
		var e_change=function(transactionId,content,time){return $.Deferred();};
		var e_create=function(tableId,content,time){return $.Deferred();};
		var e_delete=function(transactionId){return $.Deferred();};
		(function(){
			loaderPiano.appendTo(loaderScope);
			setDaylogScope();
			onScopeChangeRefreshUI()
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
		    	refreshDayFlag(ev.date);
		    	onScopeChangeRefreshUI(ev.date);
		    });
		    timePicker.datetimepicker('update',new Date());

	    	SCOPE.bind('mousewheel',scrollMainTable);
			timePicker.bind('mousewheel',scrollMainTable);

			var isInternetQuestEnd=true;
			setInterval(function(){
				if(isInternetQuestEnd){
					var currentDayFlagAry=[];
					var questDayFlagAry=[];
					daylogScopeIterator(function(index,el){
						currentDayFlagAry.push(Number(el.getAttribute("dayFlag")));
					});
					$.each(currentDayFlagAry,function(index, el) {
						if($.inArray(el,loadCompleteDayFlagAry) < 0){
							questDayFlagAry.push(el);
						}
					});
					if(questDayFlagAry.length > 0){
						loaderPiano.show();
						var def=e_internetQuest(questDayFlagAry);
						isInternetQuestEnd=false;
						def.done(function(TRANSACTION_DATA_STRUCTURE_ARY){
							setTimeout(function(){
								loaderPiano.hide();
							},500);
							
							$.each(TRANSACTION_DATA_STRUCTURE_ARY,function(index, el) {
								$.each(daylogAry,function(index, daylogel) {
									if(daylogel.getDayFlag() <= el.getTime()  &&  el.getTime() <= (daylogel.getDayFlag()+oneDayMS)){
										daylogel.addTransaction(el);
									}
								});
							});
							loadCompleteDayFlagAry=loadCompleteDayFlagAry.concat(questDayFlagAry);
							isInternetQuestEnd=true;
						});
					} 
				}
			},800);
			// div.setAttribute("style","height:310px;");
			div.addClass('panel-body');
			div.appendTo(SCOPE);
		})();
		
		function scrollMainTable(event,delta){
			var dl=delta > 0 ? false:true;
			if(dl){
				nextDay();
			}
			else{
				lastDay();
			}
			timePicker.datetimepicker('update',new Date(Number(daylogScopeList[0].getAttribute("dayFlag"))));
			onScopeChangeRefreshUI();
			return false;
		}

		function nextDay(){
			daylogScopeIterator(function(index,el){
				mDate=MDate.creatNew(Number(el.getAttribute("dayFlag")));
				mDate.setDate(Number(mDate.getDate())+1);
				el.setAttribute("dayFlag",mDate.getDayFlag());
			});
		}

		function lastDay(){
			daylogScopeIterator(function(index,el){
				mDate=MDate.creatNew(Number(el.getAttribute("dayFlag")));
				mDate.setDate(Number(mDate.getDate())-1);
				el.setAttribute("dayFlag",mDate.getDayFlag());
			});
		}

		function onScopeChangeRefreshUI(){
			$.each(daylogAry,function(index,value) {
				value.hide();
			});

			daylogScopeIterator(function(ind,el){
				var dayFlag=Number(el.getAttribute("dayFlag"));
				var isExist=false;
				$.each(daylogAry,function(index, daylogel) {
					if(daylogel.getDayFlag() == dayFlag){
						daylogel.show().appendTo(el.ui);
						isExist=true;
					}
				});
				if(!isExist){
					var daylog=creatDaylog(dayFlag);
					daylog.show().appendTo(el.ui);
					daylogAry.push(daylog);
				}
			});
		}

		function creatDaylog(DAY_FLAG){
			var daylog=Daylog.creatNew(DAY_FLAG);
			daylog.onCreate(function(TABLE_ID,CONTENT,TIME){
				var def=e_create(TABLE_ID,CONTENT,TIME);
				def.done(function(TRANSACTION_DATA_STRUCTURE){
					// daylog.addTransaction(TRANSACTION_DATA_STRUCTURE);逻辑上不通，都已经是daylog告诉你它创建了一个新的transaction了
					// 你怎么还给它再添加一次？
				});
				return def;
			});
			daylog.onDelete(function(TRANSACTION_ID){
				var def=e_delete(TRANSACTION_ID);
				def.done(function(){

				});
				return def;
			});
			daylog.onChange(function(TRANSACTION_ID,CONTENT,TIME){
				var def=e_change(TRANSACTION_ID,CONTENT,TIME);
				def.done(function(){

				});
				return def;
			});
			return daylog;
		}

		function refreshDayFlag(TIME){
			var mDate=MDate.creatNew(TIME);
			daylogScopeIterator(function(ind,el){
				el.setAttribute("dayFlag",mDate.getDayFlag());
				mDate.setDate(Number(mDate.getDate())+1);
			});
		}

		function daylogScopeIterator(CALL_BACK){
			$.each(daylogScopeList,function(index, el) {
				CALL_BACK(index,el);
			});
		}

		function setDaylogScope(THE_BEGINING_DATE){
			var mDate=MDate.creatNew(new Date());
			for(i=0; i<dayNum; i++){
				var logScope=Div.creatNew();
				logScope.setAttribute("style","height:280px;overflow-y: auto;");
				logScope.setAttribute("dayFlag",mDate.getDayFlag());
				logScope.addClass("col-xs-2");
				logScope.appendTo(div.ui);
				daylogScopeList.push(logScope);
				mDate.setDate(Number(mDate.getDate())+1);
			}
		}

		DaylogManager.onCreate=function(CALL_BACK){
			e_create=CALL_BACK;
		}

		DaylogManager.onChange=function(CALL_BACK){
			e_change=CALL_BACK;
		}

		DaylogManager.onDelete=function(CALL_BACK){
			e_delete=CALL_BACK;
		}

		DaylogManager.whatINeed=function(CALL_BACK){
			e_internetQuest=CALL_BACK;
		}

		return DaylogManager;
	}
}


minclude("Table");
minclude("AttentionTable");
/**
 * AttentionTableInfoManager()
 * 		launch()
 * 		onSuccess()
 * 		onError()
 * 		getAllTableIdAry()		//返回的是你关注的表以及这些表的所有父表的tableId数组
 * 		getAttentionTableAry()	//返回的是AttetionTable对象的数组
 */
var AttentionTableInfoManager={
	creatNew:function(){
		var AttentionTableInfoManager={};

		var e_success=function(){};
		var e_error=function(){};
		var attentionTableAry=[];
		var allTableIdAry=[];

		AttentionTableInfoManager.launch=function(){
			var getAttentionTableInfo=GetAttentionTableInfo.creatNew();
			getAttentionTableInfo.onSuccessLisenter(function(DATA){
				$.each(DATA,function(index, el) {
					var parentTableAry=[];
					$.each(el.parentTableInfoAry,function(index, value) {
						var table=Table.creatNew();
						table.setTableId(value.tableId);
						table.setTableName(value.tableName);
						parentTableAry.push(table);
						addTableId(value.tableId);
					});
					var attentionTable=AttentionTable.creatNew();
					attentionTable.setTableId(el.tableId);
					attentionTable.setTableName(el.tableName);
					attentionTable.setIsManager(el.isManager);
					attentionTable.setParentTableAry(parentTableAry);
					attentionTableAry.push(attentionTable);
					addTableId(el.tableId);
				});
				//消除allTableIdAry中的重复项
				e_success();
			});
			getAttentionTableInfo.onErrorLisenter(function(){
				e_error();
			});
			getAttentionTableInfo.launch();
		}

		function addTableId(TABLE_ID){
			if($.inArray(TABLE_ID,allTableIdAry) < 0){
				allTableIdAry.push(TABLE_ID);
			}
		}

		AttentionTableInfoManager.getAllTableIdAry=function(){
			return allTableIdAry;
		}

		AttentionTableInfoManager.getAttentionTableAry=function(){
			return attentionTableAry;
		}

		AttentionTableInfoManager.onSuccess=function(CALL_BACK){
			e_success=CALL_BACK;
		}

		AttentionTableInfoManager.onError=function(CALL_BACK){
			e_error=CALL_BACK;
		}


		return AttentionTableInfoManager;
	}
}


minclude("MDate");
minclude("InputController");
/**
 * 它的table选择列表在获取服务器数据的时候初始化
 * 
 * CreateTransactionModal()
 * 		bindModal(button)
 * 		initBeforeShow(beginTimeOfToday)
 * 		onModalhide()
 * 		onCreate(CALL_BACK(tableId,content,time))	//当transaction被创建时，你可以做一些事情，返回Deferred对象
 * 		show()
 * 		hide()
 */
var CreateTransactionModal={
	creatNew:function(){
		var CreateTransactionModal={};

		var createTransactionModal=$("#create_log_transaction_modal");
		var createTransactionModalTableSelect=$("#create_log_modal_tableSelect");
		var createTransactionModalHourUpBtn=$("#create_log_modal_hour_up_btn");
		var createTransactionModalHourDownBtn=$("#create_log_modal_hour_down_btn");
		var createTransactionModalMinuteUpBtn=$("#create_log_modal_minute_up_btn");
		var createTransactionModalMinuteDownBtn=$("#create_log_modal_minute_down_btn");
		var createTransactionModalHour=$("#create_log_modal_hour");
		var createTransactionModalMinute=$("#create_log_modal_minute");
		var createTransactionModalContentTextarea=$("#create_log_modal_content_input");
		var createTransactionModalContentLength=$("#transaction_create_input_length");
		var createTransactionModalCreateBtn=$("#create_log_modal_create_btn");
		var contentRow=$("#create_transaction_content_row");
		var inputController=InputController.creatNew(createTransactionModalContentTextarea,1000);

		var e_create=function(TABLE_ID,CONTENT,TIME){return $.Deferred();};
		var e_onModalHide=function(){};

		(function(){
			inputController.onChange(function(){
				setContentTextareaLengthHtml(inputController.getRemainLength());
				if(inputController.verify()){
					contentOk();
				}
				else{
					contentError();
				}
			});

			createTransactionModal.on("hidden.bs.modal",function(e){
				inputController.empty();
				e_onModalHide();
			});
		})();

		function contentOk(){
			contentRow.removeClass('has-error');
		}

		function contentError(){
			contentRow.addClass('has-error');
		}

		function setContentTextareaLengthHtml(REMAIN_LENGTH){
			createTransactionModalContentLength.html(REMAIN_LENGTH+"字");
		}


		CreateTransactionModal.initBeforeShow=function(BEGINNING_TIME_OF_TODAY){
			createTransactionModalCreateBtn.unbind().bind("click",function(){	//when the modal open,it will to alter action of create button
				var tableId=createTransactionModalTableSelect.val();
				var content=createTransactionModalContentTextarea.val();
				var hour=createTransactionModalHour.html();
				var minute=createTransactionModalMinute.html();
				var mDate=MDate.creatNew(BEGINNING_TIME_OF_TODAY);
				mDate.setHours(hour);
				mDate.setMinutes(minute);
				var transactionTime=mDate.getTime();

				if(inputController.verify()){
					var def=e_create(tableId,content,transactionTime);
					def.done(function(){
						closeModal();
					});
				}
				else{
					//do nothing if varification failed 
				}
			});
		}

		CreateTransactionModal.onModalhide=function(CALL_BACK){
			e_onModalHide=CALL_BACK;
		}

		CreateTransactionModal.hide=function(){
			closeModal();
		}

		function closeModal(){
			createTransactionModal.modal('hide');
		}

		CreateTransactionModal.show=function(){
			openModal();
		}

		function openModal(){
			createTransactionModal.modal('show');
		}

		CreateTransactionModal.onCreate=function(CALL_BACK){
			e_create=CALL_BACK;
		}

		CreateTransactionModal.bindModal=function(BUTTON){
			BUTTON.attr("data-toggle","modal");
			BUTTON.attr("data-target","#create_log_transaction_modal");
		}

		return CreateTransactionModal;
	}
}


minclude("MDate");
/**
 * ChangeTransactionModal()
 * 		bindModal(BUTTON)
 * 		initBeforeShow(time,content,tableName)
 * 		onChange(CALL_BACK(content,time))
 * 		onDelete(CALL_BACK())
 * 		show()
 *   	hide()
 */
var ChangeTransactionModal={
	creatNew:function(){
		var ChangeTransactionModal={};

		var changeTransactionModal=$("#change_log_transaction_modal");
		var changeTransactionModalTableName=$("#change_log_transaction_modal_tableName");
		var changeTransactionModalHour=$("#change_log_modal_hour");
		var changeTransactionModalMinute=$("#change_log_modal_minute");
		var changeTransactionModalContentTextarea=$("#change_log_modal_content_input");
		var changeTransactionModalChangeBtn=$("#change_log_modal_change_btn");
		var changeTransactionModalDeleteBtn=$("#change_log_modal_delete_btn");
		var changeTransactionModalDeleteCheckModalConfirmBtn=$("#checkAction_btn");
		var changeTransactionModalActionConfirmModal=$("#checkAction_Modal");
		var contentRow=$("#change_transaction_content_row");
		var changeTransactionModalContentLength=$("#transaction_change_input_length");
		var inputController=InputController.creatNew(changeTransactionModalContentTextarea,1000);
		var mDate;
		var content;

		var e_change=function(CONTENT,TIME){return $.Deferred();};
		var e_delete=function(){return $.Deferred();};
		(function(){
			inputController.onChange(function(){
				setContentTextareaLengthHtml(inputController.getRemainLength());
				if(inputController.verify()){
					contentOk();
				}
				else{
					contentError();
				}
			});

			changeTransactionModal.on("hidden.bs.modal",function(e){
				inputController.empty();
			});
		})();

		function contentOk(){
			contentRow.removeClass('has-error');
		}

		function contentError(){
			contentRow.addClass('has-error');
		}

		ChangeTransactionModal.initBeforeShow=function(TIME,CONTENT,TABLE_NAME){
			mDate=MDate.creatNew(TIME);
			content=CONTENT;
			changeTransactionModalHour.html(mDate.getHours());
			changeTransactionModalMinute.html(mDate.getMinutes());
			changeTransactionModalTableName.val(TABLE_NAME);
			inputController.setContent(content);
			setContentTextareaLengthHtml(inputController.getRemainLength());

			changeTransactionModalChangeBtn.unbind().bind('click',function(){
				mDate.setHours(changeTransactionModalHour.html());
				mDate.setMinutes(changeTransactionModalMinute.html());
				if(inputController.verify()){
					e_change(inputController.getContent(),mDate.getTime());
				}
				else{
					// do nothing if varification failed
				}
			});

			changeTransactionModalDeleteCheckModalConfirmBtn.unbind().bind('click',function(){
				var def=e_delete();
				def.done(function(){
					changeTransactionModalActionConfirmModal.modal("hide");
				});
			});
		}

		function setContentTextareaLengthHtml(REMAIN_LENGTH){
			changeTransactionModalContentLength.html(REMAIN_LENGTH+"字");
		}

		ChangeTransactionModal.bindModal=function(BUTTON){
			BUTTON.attr("data-toggle","modal");
			BUTTON.attr("data-target","#change_log_transaction_modal");
		}

		ChangeTransactionModal.onChange=function(CALL_BACK){
			e_change=CALL_BACK;
		}

		ChangeTransactionModal.onDelete=function(CALL_BACK){
			e_delete=CALL_BACK;
		}

		ChangeTransactionModal.show=function(){
			changeTransactionModal.modal("show");
		}

		ChangeTransactionModal.hide=function(){
			changeTransactionModal.modal("hide");
		}

		return ChangeTransactionModal;
	}
}

/**
 *	table的创建者这种信息不应该告诉其他人，所以它的相关操作应该被隐藏在服务器中
 * 
 *	tableId
 *	tableName
 * 
 * Table()
 * 		setTableId(id)
 * 		getTableId()
 * 		setTableName(tableName)
 * 		getTableName()
 */
var Table={
	creatNew:function(){
		var Table={};

		var tableId;
		var tableName;

		Table.setTableId=function(TBALE_ID){
			tableId=Number(TBALE_ID);
		}

		Table.getTableId=function(){
			return tableId;
		}

		Table.setTableName=function(TABLE_NAME){
			tableName=TABLE_NAME;
		}

		Table.getTableName=function(){
			return tableName;
		}

		return Table;
	}
}



minclude("Table");
/**
 *	parentTableAry
 *	isManager 	//这个数据在服务器上判断，我们仅告诉服务器我们的openId，服务器去查询link表，然后用是否是管理员，是否是该表创建者来决定isManager字段
 *	tableAnotherName
 * 
 * AttentionTable()
 * 		setIsManager(boolean)
 * 		isManager()
 *
 * 		setParentTableAry(Table_Ary)
 * 		findParentTable(tableId)	//有则返回Table对象，没有返回null
 *
 * 		来自父：
 * 		setTableId(id)
 * 		getTableId()
 * 		setTableName(tableName)
 * 		getTableName()
 */
var AttentionTable={
	creatNew:function(){
		var AttentionTable=Table.creatNew();

		var parentTableAry=[];
		var isManager;

		AttentionTable.setIsManager=function(BOOLEAN){
			isManager=BOOLEAN;
		}

		AttentionTable.isManager=function(){
			return isManager;
		}

		AttentionTable.setParentTableAry=function(PARENT_TABLE_ARY){
			parentTableAry=PARENT_TABLE_ARY;
		}

		AttentionTable.findParentTable=function(TABLE_ID){
			var table=null;
			$.each(parentTableAry,function(index, el) {
				if(el.getTableId() == TABLE_ID){
					table=el;
				}
			});
			return table;
		}

		return AttentionTable;
	}
}

/**
 * Tranaction()
 * 		setTransactionId();
 * 		getTransactionId();
 *
 * 		setTableId();
 * 		getTableId();
 *
 * 		setContent();
 * 		getContent();
 * 		
 * 		setTime();
 * 		getTime();
 */
var Transaction={
	creatNew:function(){
		var Transaction={};

		var transactionId;
		var tableId;
		var content;
		var time;

		Transaction.setTransactionId=function(TRSANCTION_ID){
			transactionId=Number(TRSANCTION_ID);
		}

		Transaction.getTransactionId=function(){
			return transactionId;
		}

		Transaction.setTableId=function(TABLE_ID){
			tableId=Number(TABLE_ID);
		}

		Transaction.getTableId=function(){
			return tableId;
		}

		Transaction.setContent=function(CONTENT){
			content=CONTENT;
		}

		Transaction.getContent=function(){
			return content;
		}

		Transaction.setTime=function(TIME){
			time=Number(TIME);
		}

		Transaction.getTime=function(){
			return time;
		}

		return Transaction;
	}
}

/**
 * 它需要知道该用户关注的表，是否对表具有管理员权限（这将决定该用户是否能对某个transaction进行修改），以及这些表各自的父表池（这将决定该transaction的头名）
 * 
 *	是否来自直接关注？
 *		是：是否具有管理员权限？（这个问题的回答，要考虑是否是该表的创建者这种情况）
 *		否：哪个子表获取了这条信息？
 *
 * 	内容是什么？
 * 	时间？
 * 	ID？
 * 
 * TransactionDataStructure(attentionTableAry,transaction)
 * 		isDirectAttention()
 * 		isManager()
 * 		getChildTableName()
 * 		getChildTableId()
 * 		getParentTableName()
 * 		getParentTableId()
 *
 * 		来自父：
 * 		setTransactionId();
 * 		getTransactionId();
 *
 * 		setTableId();
 * 		getTableId();	//这个tableId是transaction所指向的table
 *
 * 		setContent();
 * 		getContent();
 * 		
 * 		setTime();
 * 		getTime();
 */
var TransactionDataStructure={
	creatNew:function(ATTENTION_TABLE_ARY,TRANSACTION){
		var TransactionDataStructure=TRANSACTION;

		var attentionTableAry=ATTENTION_TABLE_ARY;
		var isDirectAttention=false;
		var isManager=false;
		var childTableName;
		var childTableId;
		var parentTableName;
		var parentTableId;

		(function(){
			$.each(attentionTableAry,function(index, el) {
				if(el.getTableId() == TransactionDataStructure.getTableId()){
					isDirectAttention=true;
					isManager=el.isManager();
					childTableName=el.getTableName();
					childTableId=el.getTableId();
				}
			});
			if(!isDirectAttention){
				$.each(attentionTableAry,function(index, el) {
					var result=el.findParentTable(TransactionDataStructure.getTableId());
					if(result != null){
						parentTableName=result.getTableName();
						parentTableId=result.getTableId();
						childTableName=el.getTableName();
						childTableId=el.getTableId();
					}
				});
			}
		})();

		TransactionDataStructure.isDirectAttention=function(){
			return isDirectAttention;
		}

		TransactionDataStructure.isManager=function(){
			return isManager;
		}

		TransactionDataStructure.getChildTableId=function(){
			return childTableId;
		}

		TransactionDataStructure.getChildTableName=function(){
			return childTableName;
		}

		TransactionDataStructure.getParentTableId=function(){
			return parentTableId;
		}

		TransactionDataStructure.getParentTableName=function(){
			return parentTableName;
		}

		return TransactionDataStructure;
	}
}


minclude("DateItem");
minclude("TransactionItem");
minclude("TransactionItemContainer");
minclude("Div");
/**
 * 每一个Daylog都有一个DayFlag，是它的唯一标识
 * 
 * 它维护两个池，一个是TransactionItem池，一个是TransacctionItemContainer池，
 * TransactionItem触发onChange的时候，它把TransactionItem从原 TransacctionItemContainer中移除，然后根据其time，看是否已存在time一样
 * 的TransacctionItemContainer，存在则add给它，不存在则创建一个新的TransacctionItemContainer，并add给它
 * 
 * 它持有当天的所有TransactionItem，并相应他们的on……事件
 * 
 * Daylog(DayFlag)
 * 		show()	//show和hide并不会影响它的可见性，如果它是不可见的，那么你调用show方法它也不会出现
 * 		hide()
 *
 * 		addTransaction(TransactionDataStructure)	//
 * 		getDayFlag()	//获取它的唯一标识
 * 		
 * 		setVisible(boolean)	//设置其可见性
 * 		isVisible()			//你可以通过这个函数获取到它的可见性
 * 		isUiEmpty()			//用来判断目前该daylog的transaction列表“看起来”是否是空的，也就是说进过filt后它没有东西可以显示，那么也会判定为是empty
 * 		
 * 		filtByContent(string)			//你可以告诉它只显示content包含某个字符串的transaction
 * 		filtByTableId(tableId)			//只显示指定日程的transaction
 * 		filtByTableAnotherName(tableAnotherName)	//只显示指定日程的transaction
 * 		clearFilt()						//移除filt限制
 * 		
 * 		onCreate(CALL_BACK(tableId,content,time))		//当用户创建transaction的时候，你可以做一些事情，返回Deferred对象，包含TransacitonDataStructure对象
 * 		onDelete(CALL_BACK(transactionId))				//当用户删除transaction的时候，你可以做一些事情，返回Deferred对象
 * 		onChange(CALL_BACK(transactionId,content,time))	//当用户修改transaction的时候，你可以做一些事情，返回Deferred对象
 */
var Daylog={
	creatNew:function(DAY_FLAG){
		var Daylog={};
		
		var div=Div.creatNew();
		var dateScope=Div.creatNew();
		var transactionScope=Div.creatNew();
		var isVisible=true;
		var dayFlag=Number(DAY_FLAG);
		var dateItem=DateItem.creatNew(dayFlag);
		var transactionItemContainerAry=[];
		var transactionItemAry=[];
		var e_createTransaction=function(tableId,content,time){return $.Deferred();};	
		var e_deleteTransaction=function(transactionId){return $.Deferred();};
		var e_changeTransaction=function(transactionId,content,time){return $.Deferred();};
		(function(){
			dateScope.appendTo(div.ui);
			transactionScope.appendTo(div.ui);
			dateItem.onCreate(function(TABLE_ID,CONTENT,TIME){
				var def=e_createTransaction(TABLE_ID,CONTENT,TIME);
				def.done(function(TRANSACTION_DATA_STRUCTURE){
					addTransaction(TRANSACTION_DATA_STRUCTURE);
				});
				return def;
			});
			dateItem.show().appendTo(dateScope.ui);
		})();

		Daylog.setVisible=function(BOOLEAN){
			isVisible=BOOLEAN;
			if(!isVisible){
				hide();
			}
		}

		Daylog.isVisible=function(){
			return isVisible;
		}

		Daylog.isUiEmpty=function(){
			var isUiEmpty=true;
			$.each(transactionItemAry,function(index, el) {
				if(el.isVisible()){
					isUiEmpty=false;
				}
			});
			return isUiEmpty;
		}

		Daylog.show=function(){
			if(isVisible){
				show();
			}
			return div.ui;
		}

		function show(){
			div.removeClass('hide');
		}

		Daylog.hide=function(){
			hide();
		}	

		function hide(){
			div.addClass('hide');
		}

		Daylog.getDayFlag=function(){
			return dayFlag;
		}

		Daylog.addTransaction=function(TRANSACTION_DATA_STRUCTURE){
			addTransaction(TRANSACTION_DATA_STRUCTURE);
		}

		function addTransaction(TRANSACTION_DATA_STRUCTURE){
			var transactionItem=TransactionItem.creatNew(TRANSACTION_DATA_STRUCTURE);
			transactionItem.onChange(function(CONTENT,TIME){
				var def=e_changeTransaction(transactionItem.getTransactionId(),CONTENT,TIME);
				def.done(function(){
					if(TIME != transactionItem.getTransactionTime()){
						transactionItem.hide();
						removeItemFromContainer(transactionItem.getTransactionId());
						addItemToContainer(transactionItem,TIME);
					}
					else{
						setTimeout(function(){
							refreshContainerUI();
						},200);
					}
				});
				return def;
			});
			transactionItem.onDelete(function(){
				var def=e_deleteTransaction(transactionItem.getTransactionId());
				def.done(function(){
					transactionItem.setVisible(false);
					removeItemFromContainer(transactionItem.getTransactionId());
					removeItemFromTransactionAry(transactionItem.getTransactionId());
				});
				return def;
			});
			transactionItemAry.push(transactionItem);
			addItemToContainer(transactionItem,transactionItem.getTransactionTime());
		}

		function removeItemFromTransactionAry(ID){
			transactionItemAry=$.grep(transactionItemAry,function(value,index){
				if(value.getTransactionId()==ID){
					return false;
				}
				else{
					return true;
				}
			});
		}

		function removeItemFromContainer(TRANSACTION_ID){
			$.each(transactionItemContainerAry,function(index, el) {
				el.removeTransactionItem(TRANSACTION_ID);
			});
		}

		function refreshContainerUI(){
			$.each(transactionItemContainerAry,function(index, el) {
				el.refreshUI();
			});
		}

		//这个函数有待优化
		function addItemToContainer(TRANSACTION_ITEM,TIME){
			var isExist=false;
			$.each(transactionItemContainerAry,function(index, el) {
				if(el.getTime() == TIME){
					el.addTransactionItem(TRANSACTION_ITEM);
					isExist=true;
				}
			});
			if(!isExist){
				var transactionItemContainer=TransactionItemContainer.creatNew(TIME);
				transactionItemContainer.addTransactionItem(TRANSACTION_ITEM);
				transactionItemContainerAry.push(transactionItemContainer);
				sortContainer();
				$.each(transactionItemContainerAry,function(index, el) {
					el.show().appendTo(transactionScope.ui);
				});
			}
		}

		function sortContainer(){
			transactionItemContainerAry.sort(function(valueA,valueB){
				if(valueA.getTime() <= valueB.getTime()){
					return -1;
				}
				else{
					return 1;
				}
			});
		}

		function isTransactionItemContainerExist(TIME){
			var isExist=false;
			$.each(transactionItemContainerAry,function(index, el) {
				if(el.getTime() == TIME){
					isExist=true;
				}
			});
			return isExist;
		}

		Daylog.onCreate=function(CALL_BACK){
			e_createTransaction=CALL_BACK;
		}

		Daylog.onDelete=function(CALL_BACK){
			e_deleteTransaction=CALL_BACK;
		}

		Daylog.onChange=function(CALL_BACK){
			e_changeTransaction=CALL_BACK;
		}

		Daylog.filtByContent=function(CONTENT){
			$.each(transactionItemAry,function(index, el) {
				if(el.getTransactionContent().indexOf(CONTENT) > 0){
					el.setVisible(true);
					el.show();
				}
			});
		}

		Daylog.filtByTableId=function(TABLE_ID_ARY){

		}

		Daylog.filtByTableName=function(){

		}

		Daylog.clearFilt=function(){

		}


		return Daylog;
	}
}



minclude("Div");

var LoaderPiano={
	creatNew:function(){
		var LoaderPiano=Div.creatNew();

		var div1=Div.creatNew();
		var div2=Div.creatNew();
		var div3=Div.creatNew();

		LoaderPiano.addClass("cssload-piano hide");
		div1.addClass("cssload-rect1");
		div2.addClass("cssload-rect2");
		div3.addClass("cssload-rect3");
		div1.appendTo(LoaderPiano.ui);
		div2.appendTo(LoaderPiano.ui);
		div3.appendTo(LoaderPiano.ui);

		LoaderPiano.hide=function(){
			LoaderPiano.addClass('hide');
		}

		LoaderPiano.show=function(){
			LoaderPiano.removeClass('hide');
		}

		return LoaderPiano;
	}
}

minclude("MDate");
minclude("Div");
minclude("Button");
// minclude("CreateTransactionModal");
/**
 * 有两种显示模式，一种是显示年月日，一种是星期和日期
 * 它会根据日期自动调整自己的样式（也就是显示“今天”）
 * 
 * DateItem(dayFlag)
 * 		show()
 * 		hide()
 * 		onCreate(CALL_BACK(tableId,content,time))	//当transaction被创建的时候，你可以做一些事情，返回Deferred对象
 * 		changeUiToYMD()
 * 		changeUiToDD()
 */
var DateItem={
	creatNew:function(DAY_FLAG){
		var DateItem={};

		var dayFlag=DAY_FLAG;
		var theMDate=MDate.creatNew(DAY_FLAG);
		var scope=Div.creatNew();
		var dateBtn=Button.creatNew();
		var e_create=function(TABLE_ID,CONTENT,TIME){return $.Deferred();};
		var e_modalClose=function(){};
		(function(){
			initDateBtn();
			createTransactionModal.bindModal(dateBtn.ui);
			dateBtn.onClickListener(function(){
				createTransactionModal.onCreate(function(TABLE_ID,CONTENT,TIME){
					var def=e_create(TABLE_ID,CONTENT,TIME);
					def.done(function(){
						createTransactionModal.hide();
					});
					return def;
				});
				createTransactionModal.initBeforeShow(dayFlag);
			});
		})();

		function initDateBtn(){
			dateBtn.addClass("btn text-center col-xs-12");
			dateBtn.appendTo(scope.ui);
			if(isToday()){
				dateBtn.addClass("btn-primary");
			}
			else{
				dateBtn.addClass("btn-activity-main-dateBtn");
			}
			changeUiToDD();
		}

		function isToday(){
			var todayFlag=MDate.creatNew(new Date()).getDayFlag();
			return dayFlag == todayFlag;
		}

		DateItem.onCreate=function(CALL_BACK){
			e_create=CALL_BACK;
		}

		DateItem.changeUiToDD=function(){
			changeUiToDD();
		}

		function changeUiToDD(){
			dateBtn.html(theMDate.getChineseDay()+"&nbsp;&nbsp;&nbsp;"+theMDate.getDate());
		}

		DateItem.changeUiToYMD=function(){
			changeUiToYMD();
		}

		function changeUiToYMD(){
			dateBtn.html(theMDate.getFullYear()+"年"+theMDate.getDate()+"月"+theMDate.getDay()+"日");
		}

		DateItem.show=function(){
			show();
			return scope.ui;
		}

		function show(){
			scope.removeClass('hide');
		}

		DateItem.hide=function(){
			hide();
		}

		function hide(){
			scope.addClass('hide');
		}

		DateItem.onModalClose=function(CALL_BACK){
			e_modalClose=CALL_BACK;
		}
		

		return DateItem;
	}
}


minclude("PopoverButton");
minclude("TextTranslator");
minclude("Div");
minclude("Button");
/**
 *	对transaction的show操作并不会改变它的可见性，
 * 
 * TransactionItem(TransactionDataStructure)
 * 		show()
 * 		hide()
 *
 * 		getTransactionId()
 * 		getTransactionTime()
 * 		getTransactionContent()
 * 		getTransactionTableId()
 * 		
 * 		isDirectAttention()
 * 		getChildTableName()
 * 		getChildTableId()
 * 		getParentTableName()
 * 		getParentTableId()
 * 		
 * 		setVisible(boolean)	//告诉它，它是否应该可见
 * 		isVisible()			//你可以通过这个方法得知它的可见性
 * 		
 * 		onChange(CALL_BACK(Content,Time))	//当transaction变化时，你可以做一些事情，返回Deferred对象
 * 		onDelete(CALL_BACK())					//当transaction被删除时，你可以做一些事情，返回Deferred对象
 */		
 
var TransactionItem={
	creatNew:function(TRANSACTION_DATA_STRUCTURE){
		var TransactionItem={};

		var transaction=TRANSACTION_DATA_STRUCTURE;
		var isVisible=true;
		var textTranslator=TextTranslator.creatNew();
		var div=Div.creatNew();
		var btn=null;
		var e_change=function(content,time){return $.Deferred();};
		var e_delete=function(){return $.Deferred();};
		(function(){
			btn=PopoverButton.creatNew("hover",popverHtml(),popverTitle(),popverContent());
			btn.appendTo(div.ui);
			div.addClass('clear-fix');

			if(transaction.isManager()){
				changeTransactionModal.bindModal(btn.ui);
				btn.onClickListener(function(){
					changeTransactionModal.onChange(function(CONTENT,TIME){
						var def=e_change(CONTENT,TIME);
						def.done(function(){
							transaction.setContent(CONTENT);
							transaction.setTime(TIME);
							changeTransactionModal.hide();
							btn.changeHtml(popverHtml());
							btn.changeContent(popverContent());
						});
						return def;
					});
					changeTransactionModal.onDelete(function(){
						var def=e_delete();
						def.done(function(){
							changeTransactionModal.hide();
						});
						return def;
					});
					changeTransactionModal.initBeforeShow(transaction.getTime(),transaction.getContent(),transaction.getChildTableName());
				});
			}
			else{
				btn.onClickListener(function(){
					btn.addClass("wobble animated");
				});
				btn.ui.on("animationend",function(){
					btn.removeClass("wobble animated");
				});
			}
		})();

		function popverHtml(){
			var content="";
			var transactionContent=transaction.getContent();
			var reg=/(.)+/;
			var stringAry=transactionContent.match(reg);
			if(stringAry != null){
				content=stringAry[0];
			}
			return content;
		}

		function popverContent(){
			var time=new Date(transaction.getTime());
			var content="<strong>"+time.getHours()+":"+time.getMinutes()+"</strong>"+"<br/>"+textTranslator.encodeText(transaction.getContent());
			return content;
		}

		function popverTitle(){
			var title="";
			if(transaction.isDirectAttention()){
				title="<strong>"+transaction.getChildTableName()+"</strong>";
			}
			else{
				title="<strong>"+transaction.getChildTableName()+" << "+transaction.getParentTableName()+"</strong>";
			}
			return title;
		}

		TransactionItem.onChange=function(CALL_BACK){
			e_change=CALL_BACK;
		}

		TransactionItem.onDelete=function(CALL_BACK){
			e_delete=CALL_BACK;
		}

		TransactionItem.setVisible=function(BOOLEAN){
			isVisible=BOOLEAN;
			if(!isVisible){
				hideItem();
			}
		}

		TransactionItem.isVisible=function(){
			return isVisible;
		}

		TransactionItem.show=function(){
			if(isVisible){
				showItem();
			}
			return div.ui;
		}

		function showItem(){
			div.removeClass('hide');
		}

		TransactionItem.hide=function(){
			hideItem();
		}

		function hideItem(){
			div.addClass("hide");
		}

		TransactionItem.getTransactionId=function(){
			return transaction.getTransactionId();
		}

		TransactionItem.getTransactionTime=function(){
			return transaction.getTime();
		}

		TransactionItem.getTransactionContent=function(){
			return transaction.getContent();
		}

		TransactionItem.getTransactionTableId=function(){
			return transaction.getTableId();
		}

		TransactionItem.isDirectAttention=function(){
			return transaction.isDirectAttention();
		}

		TransactionItem.getChildTableId=function(){
			return transaction.getChildTableId();
		}

		TransactionItem.getChildTableName=function(){
			return transaction.getChildTableName();
		}

		TransactionItem.getParentTableId=function(){
			return transaction.getParentTableId();
		}

		TransactionItem.getParentTableName=function(){
			return transaction.getParentTableName();
		}

		return TransactionItem;
	}
}


minclude("Div");
minclude("TimeSameTransactionItem");
/**
 *	它会根据自己所持有的transactionItem的可见性来改变自己的样子（也就是在transactionItem和timeSameTransaction之间切换，甚至在所有Item不可见的情况下隐藏自己）
 * 
 * TransactionItemContainer(time)
 * 		show()	//它会变成可见的，并返回给你一个元素节点
 * 		hide()
 * 		getTime()
 * 		addTransactionItem(TransactionItem)
 * 		removeTransactionItem(transactionId)
 */
var TransactionItemContainer={
	creatNew:function(TIME){
		var TransactionItemContainer={};

		var div=Div.creatNew();
		var transactionItemAry=[];
		var time=TIME;
		var timeSameTransactionItem=TimeSameTransactionItem.creatNew(time);

		(function(){
			timeSameTransactionItem.show().appendTo(div.ui);
		})();

		TransactionItemContainer.show=function(){
			show();
			return div.ui;
		}

		function show(){
			div.removeClass('hide');
		}

		TransactionItemContainer.hide=function(){
			hide();
		}

		function hide(){
			div.addClass('hide');
		}

		TransactionItemContainer.getTime=function(){
			return time;
		}

		TransactionItemContainer.addTransactionItem=function(TRANSACTION_ITEM){
			timeSameTransactionItem.addItem(TRANSACTION_ITEM);
			transactionItemAry.push(TRANSACTION_ITEM);
			if(transactionItemAry.length == 1){
				transactionItemAry[0].show().appendTo(div.ui);
			}
			if(transactionItemAry.length > 1){
				transactionItemAry[0].hide();
			}
		}

		TransactionItemContainer.removeTransactionItem=function(TRANSACTION_ITEM_ID){
			timeSameTransactionItem.removeItem(TRANSACTION_ITEM_ID);
			transactionItemAry=$.grep(transactionItemAry,function(value,index){
				if(value.getTransactionId() == TRANSACTION_ITEM_ID){
					value.hide();
					return false;
				}
				else{
					return true;
				}
			});
			if(transactionItemAry.length == 1){
				transactionItemAry[0].show().appendTo(div.ui);
			}
		}

		TransactionItemContainer.refreshUI=function(){
			timeSameTransactionItem.refreshUI();
		}


		return TransactionItemContainer;
	}
}


minclude("Ui");

var Div={
	creatNew:function(){
		var Div=Ui.creatNew($("<div></div>"));

		return Div;
	}	
}

var HorizontalSlipDiv={
	creatNew:function(){
		var HorizontalSlipDiv=Div.creatNew();

		HorizontalSlipDiv.addClass("animated bounceInRight hide");

		HorizontalSlipDiv.show=function(){
			HorizontalSlipDiv.removeClass('hide');
		}

		HorizontalSlipDiv.slipRemove=function(){
			HorizontalSlipDiv.addClass("bounceOutLeft");
			HorizontalSlipDiv.one('animationend',function(){
				HorizontalSlipDiv.remove();
			});
		}

		return HorizontalSlipDiv;
	}
}

var FlipYDiv={
	creatNew:function(){
		var FlipYDiv=Div.creatNew();

		FlipYDiv.addClass("animated flipInY hide");

		FlipYDiv.show=function(){
			FlipYDiv.removeClass('hide');
		}

		FlipYDiv.flipRemove=function(){
			FlipYDiv.addClass("flipOutY");
			FlipYDiv.one('animationend',function(){
				FlipYDiv.remove();
			});
		}

		return FlipYDiv;
	}
}

var FadeDiv={
	creatNew:function(){
		var FadeDiv=Div.creatNew();

		FadeDiv.addClass("fadeIn animated correction-animated-css hide");
		
		FadeDiv.show=function(){
			FadeDiv.removeClass('hide');
		}

		FadeDiv.fadeRemove=function(){
			FadeDiv.addClass("fadeOut");
			FadeDiv.one("animationend",function(){
				FadeDiv.remove();
			});
		}

		return FadeDiv;
	}
}














var MDate={
	creatNew:function(DATE){
		var MDate=new Date(DATE);

		MDate.getTimeSeconds=function(){
			return secondsTime(MDate);
		}

		//该函数已弃用
		MDate.getTheDayBeginingTimeSeconds=function(){
			return secondsTime(MDate.getTheDayBeginingTime());
		}

		MDate.getTheDayBeginingTime=function(){
			var newDate=new Date(MDate.getTime());
			newDate.setHours(0);
			newDate.setMinutes(0);
			newDate.setSeconds(0);
			newDate.setMilliseconds(0);
			return newDate;
		}

		MDate.getChineseDay=function(){
			return turnToChineseDay(MDate.getDay());
		}

		MDate.getDayFlag=function(){
			return MDate.getTheDayBeginingTime().getTime();
		}

		function secondsTime(D){
			return Math.floor(D.getTime()/1000);
		}

		function turnToChineseDay(DAY){
			switch(DAY){
				case 1:
					return "星期一";

				case 2:
					return "星期二";

				case 3:
					return "星期三";

				case 4:
					return "星期四";

				case 5:
					return "星期五";

				case 6:
					return "星期六";

				case 0:
					return "星期天";
			}
		}

		return MDate;
	}
}


minclude("Ui");

var Button={
	creatNew:function(){
		var Button=Ui.creatNew($("<button></button>"));

		Button.onClickListener=function(CALL_BACK){
			Button.ui.bind("click",function(ev){
				CALL_BACK($(this),ev);
			});
		}

		return Button;
	}
}













var Ui={
	creatNew:function(UI){
		var Ui={};

		Ui.ui=UI;

		Ui.addClass=function(PROP){
			Ui.ui.addClass(PROP);
		}

		Ui.removeClass=function(PROP){
			Ui.ui.removeClass(PROP);
		}

		Ui.html=function(HTML){
			Ui.ui.html(HTML);
		}
		
		Ui.addHtml=function(HTML){
			var html=Ui.ui.html();
			Ui.ui.html(html+HTML)
		}

		Ui.appendTo=function(SCOPE){
			Ui.ui.appendTo(SCOPE);
		}

		Ui.remove=function(){
			Ui.ui.remove();
		}

		Ui.setAttribute=function(NAME,VALUE){
			Ui.ui.attr(NAME,VALUE);
		}
		
		Ui.getAttribute=function(NAME){
			return Ui.ui.attr(NAME);
		}

		Ui.one=function(ACTION,CALL_BACK){
			Ui.ui.one(ACTION,CALL_BACK);
		}
		
		Ui.hide=function(){
			Ui.ui.hide();
		}

		return Ui;
	}	
}


minclude("Button");

/**
 * 这个按钮可以显示弹出框
 *
 * 它接收触发器选择，参数内容和bootstrap所要求的一致
 * 接收标题（title）
 * 接收内容（content）
 * 
 * PopoverButton(trigger,html,title,content)
 * 		changeTitle(title)
 * 		changeContent(content)
 * 		changeHtml(html)
 * 		changePosition(Position)	//指的是popver弹出的位置，上下左右
 * 		showPopover()
 * 		hidePopover()
 * 		destroyPopover()
 */

var PopoverButton={
	creatNew:function(TRIGGER,HTML,TITLE,CONTENT){
		var PopoverButton=Button.creatNew();

		(function(){
			PopoverButton.addClass("btn btn-default text-center col-xs-12 ");
			PopoverButton.setAttribute("style","text-overflow:ellipsis;overflow:hidden");
			PopoverButton.setAttribute("data-toggle","popover");
			PopoverButton.setAttribute("data-container","body");
			PopoverButton.html(HTML);
			PopoverButton.setAttribute("data-trigger",TRIGGER);
			PopoverButton.setAttribute("data-original-title",TITLE);
			PopoverButton.setAttribute("data-content",CONTENT);
			PopoverButton.setAttribute("data-html","true");
			PopoverButton.ui.popover();
		})();

		PopoverButton.changeHtml=function(Html){
			PopoverButton.html(Html);
		}

		PopoverButton.changeTitle=function(Title){
			PopoverButton.setAttribute("data-original-title",Title);
		}

		PopoverButton.changeContent=function(CONTENT){
			PopoverButton.setAttribute("data-content",CONTENT);
		}

		PopoverButton.changePosition=function(Position){
			PopoverButton.setAttribute("data-placement",Position);
		}

		PopoverButton.destroyPopover=function(){
			destroyPop();
		}

		function destroyPop(){
			PopoverButton.ui.popover('destroy');
		}

		PopoverButton.hidePopover=function(){
			hidePop();
		}

		function hidePop(){
			PopoverButton.ui.popover('hide');
		}

		PopoverButton.showPopover=function(){
			showPop();
		}

		function showPop(){
			PopoverButton.ui.popover('show');
		}

		return PopoverButton;
	}
}



























var TextTranslator={
	creatNew:function(){
		var TextTranslator={};

		TextTranslator.encodeText=function(TEXT){
			TEXT=TextTranslator.encodeAmpersand(TEXT);
			TEXT=TextTranslator.encodeLessThan(TEXT);
			TEXT=TextTranslator.encodeGreaterThan(TEXT);
			TEXT=TextTranslator.encodeQuotation(TEXT);
			TEXT=TextTranslator.encodeSpacing(TEXT);
			TEXT=TextTranslator.encodeEnter(TEXT);
			return TEXT;
		}

		TextTranslator.decodeText=function(TEXT){
			TEXT=TextTranslator.decodeLessThan(TEXT);
			TEXT=TextTranslator.decodeGreaterThan(TEXT);
			TEXT=TextTranslator.decodeQuotation(TEXT);
			TEXT=TextTranslator.decodeQuotation(TEXT);
			TEXT=TextTranslator.decodeSpacing(TEXT);
			TEXT=TextTranslator.decodeEnter(TEXT);
			return TEXT;
		}

		/*
		回车转空格
		 */
		TextTranslator.encodeEnterToSpacing=function(TEXT){
			return TEXT.replace(/<br>/g,"&nbsp");
		}	

		/*
		小于号转译
		 */
		TextTranslator.encodeLessThan=function(TEXT){
			return TEXT.replace(/</g,"&lt;");
		} 

		TextTranslator.decodeLessThan=function(TEXT){
			return TEXT.replace(/&lt;/g,"<");
		}

		/*
		大于号转译
		 */
		TextTranslator.encodeGreaterThan=function(TEXT){
			return TEXT.replace(/>/g,"&gt;");
		}

		TextTranslator.decodeGreaterThan=function(TEXT){
			return TEXT.replace(/&gt;/g,">");
		}

		/*
		&转译
		注意，由于所有的转译后字符串都含有&，所以&转译要注意先后顺序
		 */
		TextTranslator.encodeAmpersand=function(TEXT){
			return TEXT.replace(/&/g,"&amp;");
		}

		TextTranslator.decodeAmpersand=function(TEXT){
			return TEXT.replace(/&amp;/g,"&");
		}

		/*
		双引号转译
		 */
		TextTranslator.encodeQuotation=function(TEXT){
			return TEXT.replace(/\"/g,"&quot;");
		}

		TextTranslator.decodeQuotation=function(TEXT){
			return TEXT.replace(/&quot;/g,"\"");
		}

		/*
		单引号转译
		 */
		TextTranslator.encodeApostrophe=function(TEXT){
			return TEXT.replace(/\'/g,"&apos;");
		}

		/*
		空格转译
		 */
		TextTranslator.encodeSpacing=function(TEXT){
			return TEXT.replace(/  /g," &nbsp");
		}

		TextTranslator.decodeSpacing=function(TEXT){
			return TEXT.replace(/&nbsp;/g," ");
		}

		/*
		回车转译
		 */
		TextTranslator.encodeEnter=function(TEXT){
			return TEXT.replace(/\n/g,"<br>");
		}

		TextTranslator.decodeEnter=function(TEXT){
			return TEXT.replace(/<br>/g,"\n");
		}

		return TextTranslator;
	}
}

minclude("MDate");
minclude("Div");
minclude("Button");
minclude("TimeSameTransactionModal");
minclude("PopoverButton");
minclude("TextTranslator");
/**
 * 
 * TimeSameTransactionItem(time)
 * 		show()	//它会变成可见的，并返回给你一个元素节点
 * 		hide()
 * 		addItem()
 * 		removeItem()
 * 		refreshUI()
 */
var TimeSameTransactionItem={
	creatNew:function(TIME,TRANSACTION_ITEM_ARY){
		var TimeSameTransactionItem={};

		var div=Div.creatNew();
		var mDate=MDate.creatNew(TIME);
		var btn=null;
		var modal=null;
		var transactionItemAry=[];

		(function(){
			btn=PopoverButton.creatNew("hover","","","");
			modal=TimeSameTransactionModal.creatNew();
			modal.bindModal(btn.ui);
			btn.appendTo(div.ui);
			btn.onClickListener(function(){
				modal.initBeforeShow(transactionItemAry);
			});
		})();

		TimeSameTransactionItem.addItem=function(TRANSACTION_ITEM){
			transactionItemAry.push(TRANSACTION_ITEM);
			refreshPopver();
		}

		TimeSameTransactionItem.removeItem=function(TRANSACTION_ITEM_ID){
			transactionItemAry=$.grep(transactionItemAry,function(val,index){
				if(val.getTransactionId() == TRANSACTION_ITEM_ID){
					return false;
				}
				else{
					return true;
				}
			});
			refreshPopver();
		}

		TimeSameTransactionItem.refreshUI=function(){
			refreshPopver();
		}

		function refreshPopver(){
			if(transactionItemAry.length < 2){
				modal.hide();
				hide();
			}
			else{
				btn.changeHtml(popverHtml(transactionItemAry));
				btn.changeContent(popverContent(transactionItemAry));
				show();
			}
		}

		function popverContent(TRANSACTION_ITEM_ARY){
			var textTranslator=TextTranslator.creatNew();
			var content="";
			$.each(TRANSACTION_ITEM_ARY,function(index, el) {
				content+="</br>";
				if(el.isDirectAttention()){
					content+="<strong>"+el.getChildTableName()+"</strong></br>";
				}
				else{
					content+="<strong>"+el.getChildTableName()+" << "+el.getParentTableName()+"</strong></br>";
				}
				if(el.getTransactionContent().length > 100){
					content+=textTranslator.encodeText(el.getTransactionContent()).substring(0,101)+"……";
				}
				else{
					content+=textTranslator.encodeText(el.getTransactionContent());
				}
				content+="</br>";
			});
			content+="</br>";
			return content;
		}

		function popverHtml(TRANSACTION_ITEM_ARY){
			return mDate.getHours()+":"+mDate.getMinutes()+"&nbsp&nbsp"+"<span class=badge>"+TRANSACTION_ITEM_ARY.length+"</span>";
		}

		TimeSameTransactionItem.show=function(){
			show();
			return div.ui;
		}

		function show(){
			div.removeClass('hide');
		}

		TimeSameTransactionItem.hide=function(){
			hide();
		}

		function hide(){
			div.addClass('hide');
		}

		return TimeSameTransactionItem;
	}
}


minclude("Div");
/**
 * TimeSameTransactionModal()
 * 		bindModal(Button)
 * 		initBeforeShow(TransactionItemAry)	//接收TransactionItem对象数组
 * 		show()
 * 		hide()
 */

var TimeSameTransactionModal={
	creatNew:function(){
		var TimeSameTransactionModal={};

		var modal=$("#time_same_transaction_modal");
		var scope=$("#time_same_transaction_scope");

		TimeSameTransactionModal.initBeforeShow=function(TRANSACTION_ITEM_ARY){
			var arae=Div.creatNew();
			arae.addClass('col-xs-offset-1 col-xs-10');
			arae.appendTo(scope);
			$.each(TRANSACTION_ITEM_ARY,function(index, el) {
				var div1=Div.creatNew();
				div1.setAttribute("style","height:10px");
				div1.appendTo(arae.ui);
				el.show().appendTo(arae.ui);
				var div2=Div.creatNew();
				div2.setAttribute("style","height:10px");
				div2.appendTo(arae.ui);
			});
			modal.on("hidden.bs.modal",function(){
				arae.addClass('hide');
			});
		}

		TimeSameTransactionModal.bindModal=function(BUTTON){
			BUTTON.attr("data-toggle","modal");
			BUTTON.attr("data-target","#time_same_transaction_modal");
		}

		TimeSameTransactionModal.show=function(){
			modal.modal('show');
		}

		TimeSameTransactionModal.hide=function(){
			// TODO 
			// 解决modal被意外关闭的问题
			// modal.modal('hide');
		}

		return TimeSameTransactionModal;
	}
}


/**
 * InputController(input,maxLength)
 * 		onChange(CALL_BACK())
 * 		verify()	验证输入框中的内容是否符合长度要求.......，符合返回true，不符合返回false
 * 		setContent()	设置输入框内容
 * 		getContent()	
 * 		getRemainLength()	获取输入框合法输入内容所剩长度
 * 		empty()		清空输入框内容
 */
var InputController={
	creatNew:function(INPUT,MAX_LENGTH){
		var InputController={};

		var input=INPUT;
		var CONTENT_LENGTH_MAX=MAX_LENGTH;
		var CONTENT_LENGTH_MIN=1;
		var e_change=function(CONTENT,REMAIN_LENGTH){};
		(function(){
			input.bind("input propertychange",function(){
				e_change(getContent(),getRemainLength());
			});
		})();

		InputController.getRemainLength=function(){
			return getRemainLength();
		}

		function getRemainLength(){
			return CONTENT_LENGTH_MAX-getLength();
		}

		InputController.verify=function(){
			return thisVerify();
		}

		function thisVerify(){
			if(CONTENT_LENGTH_MIN<=getLength() && getLength()<=CONTENT_LENGTH_MAX){
				return true;
			}
			else{
				return false;
			}
		}

		function getLength(){
			return Number(getContent().length);
		}

		InputController.getContent=function(){
			return getContent();
		}

		function getContent(){
			return input.val();
		}

		InputController.onChange=function(CALL_BACK){
			e_change=CALL_BACK;
		}

		InputController.setContent=function(CONTENT){
			input.val(CONTENT);
		}

		InputController.empty=function(){
			input.val("");
		}

		return InputController;
	}
}

var BacklogContentInputController={
	creatNew:function(INPUT){
		var BacklogContentInputController=InputController.creatNew(INPUT);
		return BacklogContentInputController;
	}
}


/**
 * NameInputController()
 */
var NameInputController={
	creatNew:function(INPUT){
		var NameInputController=InputController.creatNew(INPUT);

		var CONTENT_LENGTH_MAX=12;
		var CONTENT_LENGTH_MIN=1;

		NameInputController.verify=function(){
			return thisVerify();
		}

		function thisVerify(){
			if(CONTENT_LENGTH_MIN<=getLength() && getLength()<=CONTENT_LENGTH_MAX){
				return true;
			}
			else{
				return false;
			}
		}

		function getLength(){
			return Number(getContent().length);
		}

		function getContent(){
			return INPUT.val();
		}

		return NameInputController;
	}
}

