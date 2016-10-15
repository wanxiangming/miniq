document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/backlog/modal/BacklogEditModal.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/TextTranslator.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
/**
 * 它能显示待办事项内容
 * 当鼠标移到它上时，它能用弹出框显示待办事项的具体内容
 * 当鼠标点击它时，它能弹出模态框，用以显示它的一些操作，如修改内容，删除等
 * 
 * BacklogItem(Backlog)
 * 		show()	要想待办事项显示，你就得调用这个接口，它会给你该部件的元素节点
 * 		hide()	使得待办事项可以变为不可见状态
 * 		getId()	外界获取待办事项ID的接口
 * 		isMainLine()
 * 		isRecent()
 * 		onChange(CALL_BACK(ID,CONTENT,IS_MAIN_LINE,IS_RECENT))	当待办事项被改变时，你可以进行一些操作，当且仅当你的
 * 			操作返回true时，修改才发生
 * 		onDelete(CALL_BACK(ID))	当代办事项要被删除时，你可以进行一些操作，当且仅当你的操作返回true时，删除才发生
 * 		onComplete(CALL_BACK(ID))	当待办事项被完成时，你可以进行一些操作，当且仅当你的操作返回true时，完成才发生
 */
var BacklogItem={
	creatNew:function(BACKLOG){
		var BacklogItem={};

		var backlogEditModal=BacklogEditModal.creatNew();
		var textTranslator=TextTranslator.creatNew();
		var btn=PopoverButton.creatNew("hover",BACKLOG.getContent(),"",textTranslator.encodeText(BACKLOG.getContent()));
		var e_change=function(ID,CONTENT,IS_MAIN_LINE,IS_RECENT){return $.Deferred();};
		var e_delete=function(ID){return $.Deferred();};
		var e_complete=function(ID){return $.Deferred();};
		(function(){
			backlogEditModal.bindModal(btn.ui);
			backlogEditModal.onSave(function(CONTENT,IS_MAIN_LINE,IS_RECENT){
				var def=e_change(BACKLOG.getId(),CONTENT,IS_MAIN_LINE,IS_RECENT);
				def.done(function(){
					backlogEditModal.hide();
					BACKLOG.setContent(CONTENT);
					BACKLOG.setIsMainLine(IS_MAIN_LINE);
					BACKLOG.setIsRecent(IS_RECENT);
					btn.changeHtml(CONTENT);
					btn.changeContent(textTranslator.encodeText(CONTENT));
				});
				return def;
			});
			backlogEditModal.onDelete(function(){
				var def=e_delete(BACKLOG.getId());
				def.done(function(){
					backlogEditModal.hide();
				});
				return def;
			});
			backlogEditModal.onComplete(function(){
				var def=e_complete(BACKLOG.getId());
				def.done(function(){
					backlogEditModal.hide();
				});
				return def;
			});

			btn.onClickListener(function(THIS,EVENT){
				backlogEditModal.initBeforShow(BACKLOG.getContent(),BACKLOG.isMainLine(),BACKLOG.isRecent());
				EVENT.stopPropagation();	//阻止事件冒泡，否则点击待办事项时整个盒子会翻转
				backlogEditModal.show();
			});
			btn.ui.css("background","beige");
		})();

		BacklogItem.onChange=function(CALL_BACK){
			e_change=CALL_BACK;
		}

		BacklogItem.onDelete=function(CALL_BACK){
			e_delete=CALL_BACK;
		}

		BacklogItem.onComplete=function(CALL_BACK){
			e_complete=CALL_BACK;
		}
		
		BacklogItem.getId=function(){
			return BACKLOG.getId();
		}

		BacklogItem.show=function(){
			btn.removeClass('hide');
			return btn.ui;
		}

		BacklogItem.hide=function(){
			hideItem();
		}

		function hideItem(){
			btn.addClass('hide');
		}

		BacklogItem.isMainLine=function(){
			return BACKLOG.isMainLine();
		}

		BacklogItem.isRecent=function(){
			return BACKLOG.isRecent();
		}

		return BacklogItem;
	}
}
