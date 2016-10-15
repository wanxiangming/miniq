document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/MDate.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/TextTranslator.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/PopoverButton.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/InputController.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/backlog/BacklogBoxManager.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/backlog/Backlog.js"+'">' + '</script>');

document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/DaylogManager.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/internet/AttentionTableInfoManager.js"+'">' + '</script>');

function host(){
	var mainTable=$("#mainTable");

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


/**
 * 以下是待办事项模块////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 */


	// $("input").iCheck({
	// 	checkboxClass:"icheckbox_flat-red",
	// 	redioClass:"iradio_flat-red"
	// });

	// var area=$("#backlogBoxRow");
	// var mainLineId;
	// var mainLineContent="";
	// var backlogInfoManager=GetInfoInUseMainLineAndUncompletedBacklogManager.creatNew();
	// backlogInfoManager.onQuestSuccess(function(){
	// 	mainLineId=backlogInfoManager.getMainLineId();
	// 	mainLineContent=backlogInfoManager.getMainLineContent();
	// 	$(".mainQuestContent_span").html(mainLineContent);
	// 	var backlogBoxManager=BacklogBoxManager.creatNew(backlogInfoManager.getBacklogAry(),backlogInfoManager.isMainLineExist(),area);
	// 	backlogBoxManager.onRemoveItem(function(ID){
	// 		var def=$.Deferred();
	// 		var removeBacklog=RemoveBacklog.creatNew(ID);
	// 		removeBacklog.onSuccessLisenter(function(data){
	// 			if(data == 1){
	// 				def.resolve();
	// 			}
	// 			else if(data == 0){
	// 				def.reject();
	// 			}
	// 		});
	// 		removeBacklog.launch();
	// 		return def;
	// 	});
	// 	backlogBoxManager.onItemChange(function(ID,CONTENT,IS_MAIN_LINE,IS_RECENT){
	// 		var def=$.Deferred();
	// 		var changeBacklog=ChangeBacklog.creatNew(mainLineId,ID,CONTENT,IS_MAIN_LINE,IS_RECENT);
	// 		changeBacklog.onSuccessLisenter(function(data){
	// 			if(data == 1){
	// 				def.resolve();
	// 			}
	// 			else if(data == 0){
	// 				def.reject();
	// 			}
	// 		});
	// 		changeBacklog.launch();
	// 		return def;
	// 	});
	// 	backlogBoxManager.onItemComplete(function(ID){
	// 		var def=$.Deferred();
	// 		var completeBacklog=CompleteBacklog.creatNew(ID);
	// 		completeBacklog.onSuccessLisenter(function(data){
	// 			if(data == 1){
	// 				def.resolve();
	// 			}
	// 			else if(data == 0){
	// 				def.reject();
	// 			}
	// 		});
	// 		completeBacklog.launch();
	// 		return def;
	// 	});
	// 	backlogBoxManager.onAddItem(function(CONTENT,IS_MAIN_LINE,IS_RECENT){
	// 		var def=$.Deferred();
	// 		var addBacklog=AddBacklog.creatNew(mainLineId,CONTENT,IS_MAIN_LINE,IS_RECENT);
	// 		addBacklog.onSuccessLisenter(function(data){
	// 			var backlogId=Number(data);
	// 			if(backlogId != -1){
	// 				var backlog=Backlog.creatNew();
	// 				backlog.setId(backlogId);
	// 				backlog.setContent(CONTENT);
	// 				backlog.setIsMainLine(IS_MAIN_LINE);
	// 				backlog.setIsRecent(IS_RECENT);
	// 				def.resolve(backlog);
	// 			}
	// 		});
	// 		addBacklog.launch();
	// 		return def;
	// 	});
	// 	backlogBoxManager.onAddMainQuest(function(CONTENT){
	// 		var def=$.Deferred();
	// 		var addMainLine=AddMainLine.creatNew(CONTENT);
	// 		addMainLine.onSuccessLisenter(function(data){
	// 			var mId=Number(data);
	// 			if(mId != -1){
	// 				mainLineId=mId;
	// 				mainLineContent=CONTENT;
	// 				$(".mainQuestContent_span").html(CONTENT);
	// 				def.resolve();
	// 			}
	// 			else{
	// 				def.reject();
	// 			}
	// 		});
	// 		addMainLine.launch();
	// 		return def;
	// 	});
	// });
	// backlogInfoManager.onQuestError(function(){});
	// backlogInfoManager.launch();

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


/**
 * GetInfoInUseMainLineAndUncompletedBacklogManager()
 * 		launch()
 * 		isMainLineExist()
 * 		getMainLineId()
 * 		getMainLineContent()
 * 		getBacklogAry()
 * 		onQuestError(CALL_BACK())
 * 		onQuestSuccess(CALL_BACK())
 */
var GetInfoInUseMainLineAndUncompletedBacklogManager={
	creatNew:function(){
		var GetInfoInUseMainLineAndUncompletedBacklogManager={};

		var isMainLineExist=false;
		var mainLineId=0;	//当backlog不是任何主线的任务，那么它才会是0，但此时isMaingLine数据段也是0
		var mainLineContent="";
		var backlogAry=[];
		var e_questSuccess=function(){};
		var e_questError=function(){};

		GetInfoInUseMainLineAndUncompletedBacklogManager.launch=function(){
			var getInfoInUseMainLineAndUncompletedBacklog=GetInfoInUseMainLineAndUncompletedBacklog.creatNew();
			getInfoInUseMainLineAndUncompletedBacklog.onSuccessLisenter(function(data){
				var mId=data['mainLine'].id;	//如果服务器没有查询到相关数据，则返回的数组是空数组
				if(typeof(mId) != "undefined"){
					isMainLineExist=true;
					mainLineId=Number(mId);
					mainLineContent=data['mainLine'].content;
					$.each(data['backlogAry'],function(index, el) {
						var backlog=Backlog.creatNew();
						backlog.setId(el.id);
						backlog.setContent(el.content);
						backlog.setIsRecent(transformNumToBoolean(el.isRecent));
						if(transformNumToBoolean(el.isMainLine)){
							backlog.setIsMainLine((Number(el.mainLineId)==mainLineId ? true:false));
						}
						else{
							backlog.setIsMainLine(false);
						}
						backlogAry.push(backlog);
					});
				}
				e_questSuccess();
			});
			getInfoInUseMainLineAndUncompletedBacklog.onErrorLisenter(function(){
				e_questError();
			});
			getInfoInUseMainLineAndUncompletedBacklog.launch();
		}

		function transformNumToBoolean(NUM){
			return NUM==1 ? true:false;
		}

		GetInfoInUseMainLineAndUncompletedBacklogManager.onQuestSuccess=function(CALL_BACK){
			e_questSuccess=CALL_BACK;
		}

		GetInfoInUseMainLineAndUncompletedBacklogManager.onQuestError=function(CALL_BACK){
			e_questError=CALL_BACK;
		}

		GetInfoInUseMainLineAndUncompletedBacklogManager.getMainLineId=function(){
			return mainLineId;
		}

		GetInfoInUseMainLineAndUncompletedBacklogManager.getMainLineContent=function(){
			return mainLineContent;
		}

		GetInfoInUseMainLineAndUncompletedBacklogManager.isMainLineExist=function(){
			return isMainLineExist;
		}

		GetInfoInUseMainLineAndUncompletedBacklogManager.getBacklogAry=function(){
			return backlogAry;
		}


		return GetInfoInUseMainLineAndUncompletedBacklogManager;
	}
}


























