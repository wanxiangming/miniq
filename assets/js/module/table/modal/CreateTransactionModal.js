document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/MDate.js"+'">' + '</script>');
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
		var createTransactionModalCreateBtn=$("#create_log_modal_create_btn");

		var e_create=function(TABLE_ID,CONTENT,TIME){return $.Deferred();};
		var e_onModalHide=function(){};

		CreateTransactionModal.initBeforeShow=function(BEGINNING_TIME_OF_TODAY){
			var mDate=MDate.creatNew(BEGINNING_TIME_OF_TODAY);
			createTransactionModalCreateBtn.unbind().bind("click",function(){
				var tableId=createTransactionModalTableSelect.val();
				var content=createTransactionModalContentTextarea.val();
				var hour=createTransactionModalHour.html();
				var minute=createTransactionModalMinute.html();
				mDate.setHours(hour);
				mDate.setMinutes(minute);
				var transactionTime=mDate.getTime();
				var def=e_create(tableId,content,transactionTime);
				def.done(function(){
					closeModal();
				});
			});
			createTransactionModal.on("hidden.bs.modal",function(e){
				createTransactionModalContentTextarea.val("");
				e_onModalHide();
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
