document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/InputController.js"+'">' + '</script>');
/**
 * 
 *
 * BacklogAddModal()
 * 		bindModal(button)
 * 		onSave(CALL_BACK(content,isMainLine,isRecent))
 * 		show()
 * 		hide()
 */
var BacklogAddModal={
	creatNew:function(){
		var BacklogAddModal={};

		var modal=$("#backlog_add_modal");
		var saveBtn=$("#backlog_add_modal_save_btn");
		var contentRow=$("#backlog_add_modal_content_row");
		var contentTextarea=$("#backlog_add_modal_content_textarea");
		var contentInputController=ContentInputController.creatNew(contentTextarea);
		var contentTextareaLength=$("#backlog_add_modal_content_length");
		var mainQuestCheckBox=$("#backlog_add_modal_isMainQuestCheck_checkbox");
		var recentCheckBox=$("#backlog_add_modal_isRecentCheck_checkbox");
		var e_save=function(CONTENT,IS_MAIN_LINE,IS_RECENT){return $.Deferred();};
		(function(){
			var content;
			saveBtn.unbind().bind("click",function(){
				if(contentInputController.verify()){
					e_save(content,getMainQuestState(),getRecentState());
				}
				else{
					contentError();
				}
			});
			contentInputController.onChange(function(CONTENT,REMAIN_LENGTH){
				content=CONTENT;
				contentTextareaLength.html(REMAIN_LENGTH+"字");
				if(contentInputController.verify()){
					contentOk();
				}
				else{
					contentError();
				}
			});
			modal.on('show.bs.modal',function(e){
				contentTextareaLength.html(150+"字");
				contentOk();
				contentInputController.empty();
				mainQuestCheckBox.iCheck("uncheck");
				recentCheckBox.iCheck("uncheck");
			});
		})();

		function contentOk(){
			contentRow.removeClass('has-error');
		}

		function contentError(){
			contentRow.addClass('has-error');
		}

		function getMainQuestState(){
			return mainQuestCheckBox.is(":checked");
		}

		function getRecentState(){
			return recentCheckBox.is(":checked");
		}

		BacklogAddModal.onSave=function(CALL_BACK){
			e_save=CALL_BACK;
		}

		BacklogAddModal.bindModal=function(BUTTON){
			BUTTON.attr("data-toggle","modal");
			BUTTON.attr("data-target","#backlog_add_modal");
		}

		BacklogAddModal.show=function(){
			open();
		}

		BacklogAddModal.hide=function(){
			close();
		}

		function close(){
			modal.modal('hide');
		}

		function open(){
			modal.modal('show');
		}

		return BacklogAddModal;
	}
}
