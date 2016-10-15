document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/MDate.js"+'">' + '</script>');
/**
 * ChangeTransactionModal()
 * 		bindModal(BUTTON)
 * 		onModalShow(TIME,CONTENT,TABLE_NAME)
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
		var content;

		var e_change=function(CONTENT,TIME){return $.Deferred();};
		var e_delete=function(){return $.Deferred();};
		(function(){
			
		})();

		ChangeTransactionModal.onModalShow=function(TIME,CONTENT,TABLE_NAME){
			mDate=MDate.creatNew(TIME);
			content=CONTENT;
			changeTransactionModalHour.html(mDate.getHours());
			changeTransactionModalMinute.html(mDate.getMinutes());
			changeTransactionModalTableName.val(TABLE_NAME);
			changeTransactionModalContentTextarea.val(content);

			changeTransactionModalChangeBtn.unbind().bind('click',function(){
				mDate.setHours(changeTransactionModalHour.html());
				mDate.setMinutes(changeTransactionModalMinute.html());
				e_change(changeTransactionModalContentTextarea.val(),mDate.getTime());
			});

			changeTransactionModalDeleteCheckModalConfirmBtn.unbind().bind('click',function(){
				var def=e_delete();
				def.done(function(){
					changeTransactionModalActionConfirmModal.modal("hide");
				});
			});
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
