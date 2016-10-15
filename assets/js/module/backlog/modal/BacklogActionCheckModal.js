
/**
 * BacklogActionCheckModal()
 * 		initBeforShow(confirmContent)
 * 		bindModal(button)
 * 		onConfirm(CALL_BACK)
 * 		show()
 * 		hide()
 */
var BacklogActionCheckModal={
	creatNew:function(){
		var BacklogActionCheckModal={};

		var confirmBtn=$("#backlog_check_action_modal_confirm_btn");
		var confirmContent=$("#backlog_check_action_modal_content");
		var modal=$("#backlog_check_action_modal");
		var e_confirm=function(){};

		BacklogActionCheckModal.initBeforShow=function(CONFIRM_CONTENT){
			setConfirmContent(CONFIRM_CONTENT);
			confirmBtn.unbind().bind("click",function(){
				e_confirm();
			});
		}

		function setConfirmContent(CONFIRM_CONTENT){
			confirmContent.html(CONFIRM_CONTENT);
		}

		BacklogActionCheckModal.onConfirm=function(CALL_BACK){
			e_confirm=CALL_BACK;
		}

		BacklogActionCheckModal.bindModal=function(BUTTON){
			BUTTON.attr("data-toggle","modal");
			BUTTON.attr("data-target","#backlog_check_action_modal");
		}

		BacklogActionCheckModal.show=function(){
			open();
		}

		function open(){
			modal.modal('show');
		}

		BacklogActionCheckModal.hide=function(){
			close();
		}

		function close(){
			modal.modal('hide');
		}

		return BacklogActionCheckModal;
	}
}
