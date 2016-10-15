document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/InputController.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/backlog/modal/BacklogActionCheckModal.js"+'">' + '</script>');
/**
 * 待办事项编辑模态框
 * 
 * BacklogEditModal
 * 		bindModal(BUTTON)
 * 		initBeforShow(Content,isMainLine,isRecent)
 * 		onSave(CALL_BACK(Content,isMainLine,isRecent))	以下三个on方法接收的都是deferred对象
 * 		onDelete(CALL_BACK())
 * 		onComplete(CALL_BACK())
 * 		show()
 * 		hide()
 */
var BacklogEditModal={
	creatNew:function(){
		var BacklogEditModal={};

		var contentRow=$("#backlog_edit_modal_content_row");
		var contentTextarea=$("#backlog_edit_modal_content_textarea");
		var contentTextareaLength=$("#backlog_edit_modal_content_length");
		var contentInputController=BacklogContentInputController.creatNew(contentTextarea);
		var saveBtn=$("#backlog_edit_modal_save_btn");
		var deleteBtn=$("#backlog_edit_modal_delete_btn");
		var completeBtn=$("#backlog_edit_modal_complete_btn");
		var isMainQuestCheckBox=$("#isMainQuestCheck_checkbox");
		var isRecentCheckBox=$("#isRecentCheck_checkbox");
		var backlogModal=$("#backlog_edit_modal");
		var backlogActionCheckModal=BacklogActionCheckModal.creatNew();
		var e_save=function(CONTENT,IS_MAIN_LINE,IS_RECENT){return $.Deferred();};
		var e_delete=function(){return $.Deferred();};
		var e_complete=function(){return $.Deferred();};
		(function(){
			contentInputController.onChange(function(CONTENT,REMAIN_LENGTH){
				setContentTextareaLengthHtml(REMAIN_LENGTH);
				if(contentInputController.verify()){
					contentOk();
				}
				else{
					contentError();
				}
			});
			backlogActionCheckModal.bindModal(deleteBtn);
			backlogActionCheckModal.bindModal(completeBtn);
		})();

		function setContentTextareaLengthHtml(REMAIN_LENGTH){
			contentTextareaLength.html(REMAIN_LENGTH+"字");
		}

		BacklogEditModal.initBeforShow=function(CONTENT,IS_MAIN_LINE,IS_RECENT){
			contentInputController.setContent(CONTENT);
			setContentTextareaLengthHtml(contentInputController.getRemainLength());
			contentOk();
			setMainQuestCheckbox(IS_MAIN_LINE);
			setRecentCheckBox(IS_RECENT);

			saveBtn.unbind().bind("click",function(){
				if(contentInputController.verify()){
					e_save(contentInputController.getContent(),getMainQuestCheckBoxState(),getRecentCheckBoxState());
				}
				else{
					contentError();
				}
			});
		
			deleteBtn.unbind().bind("click",function(){
				backlogActionCheckModal.onConfirm(function(){
					var def=e_delete();
					def.done(function(){
						backlogActionCheckModal.hide();
					});
				});
				backlogActionCheckModal.initBeforShow("您确定要 删除 该待办事项吗？");
			});

			completeBtn.unbind().bind("click",function(){
				backlogActionCheckModal.onConfirm(function(){
					var def=e_complete();
					def.done(function(){
						backlogActionCheckModal.hide();
					});
				});
				backlogActionCheckModal.initBeforShow("您确定 已完成 该待办事项？");
			});
		}

		function contentOk(){
			contentRow.removeClass('has-error');
		}

		function contentError(){
			contentRow.addClass('has-error');
		}

		function setMainQuestCheckbox(IS_MAIN_LINE){
			if(typeof(IS_MAIN_LINE)=="boolean"){
				if(IS_MAIN_LINE)
					isMainQuestCheckBox.iCheck("check");
				else
					isMainQuestCheckBox.iCheck("uncheck");
			}
			else{
				alert("data type error! from backlogEditModal->isMainQuestCheckBox");
			}
		}

		function getMainQuestCheckBoxState(){
			return isMainQuestCheckBox.is(":checked");
		}

		function setRecentCheckBox(IS_RECENT){
			if(typeof(IS_RECENT)=="boolean"){
				if(IS_RECENT)
					isRecentCheckBox.iCheck("check");
				else
					isRecentCheckBox.iCheck("uncheck");
			}
			else{
				alert("data type error! from backlogEditModal->isRecentCheckBox");
			}
		}

		function getRecentCheckBoxState(){
			return isRecentCheckBox.is(":checked");
		}

		BacklogEditModal.hide=function(){
			close();
		}

		function close(){
			backlogModal.modal('hide');
		}

		BacklogEditModal.show=function(){
			open();
		}

		function open(){
			backlogModal.modal('show');
		}

		BacklogEditModal.onSave=function(CALL_BACK){
			e_save=CALL_BACK;
		}

		BacklogEditModal.onDelete=function(CALL_BACK){
			e_delete=CALL_BACK;
		}

		BacklogEditModal.onComplete=function(CALL_BACK){
			e_complete=CALL_BACK;
		}

		BacklogEditModal.bindModal=function(BUTTON){
			BUTTON.attr("data-toggle","modal");
			BUTTON.attr("data-target","#backlog_edit_modal");
		}

		return BacklogEditModal;
	}
}
