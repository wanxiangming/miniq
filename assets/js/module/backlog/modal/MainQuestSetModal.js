
document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/InputController.js"+'">' + '</script>');
/**
 * MainQuestSetModal()
 * 		bindModal(button)
 * 		unbindModal(button)
 * 		onSet(CALL_BACK(content))
 * 		show()
 * 		hide()
 */
var MainQuestSetModal={
	creatNew:function(){
		var MainQuestSetModal={};

		var modal=$("#set_mianQuest_modal");
		var saveBtn=$("#set_mianQuest_modal_save_btn");
		var input=$("#set_mianQuest_modal_input");
		var inputRow=$("#set_mianQuest_modal_content_row");
		var inputController=NameInputController.creatNew(input);
		var e_set=function(CONTENT){return $.Deferred();};
		(function(){
			saveBtn.unbind().bind("click",function(){
				if(inputController.verify()){
					e_set(inputController.getContent());
				}
				else{
					inputRow.addClass('has-error');
				}
			});
			modal.on('show.bs.modal',function(){
				inputController.empty();
				inputRow.removeClass('has-error');
			});
		})();

		MainQuestSetModal.bindModal=function(BUTTON){
			BUTTON.attr("data-toggle","modal");
			BUTTON.attr("data-target","#set_mianQuest_modal");
		}

		MainQuestSetModal.unbindModal=function(BUTTON){
			BUTTON.attr("data-toggle","");
			BUTTON.attr("data-target","");
		}

		MainQuestSetModal.onSet=function(CALL_BACK){
			e_set=CALL_BACK;
		}

		MainQuestSetModal.show=function(){
			open();
		}

		function open(){
			modal.modal("show");
		}

		MainQuestSetModal.hide=function(){
			close();
		}

		function close(){
			modal.modal("hide");
		}

		return MainQuestSetModal;
	}
}
