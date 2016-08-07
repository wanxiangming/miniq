document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/MDate.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/TextTranslator.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/PopoverButton.js"+'">' + '</script>');


/**
 * 待办事项测试用例
 */


function host(){
	var area=$("#backlogBoxRow");

	var backlog=Backlog.creatNew();
	backlog.setId(1);
	backlog.setContent("这是一个测试用例的内容部分");
	backlog.setIsMainQuest(true);
	backlog.setIsRecent(false);
	var backlogItem=BacklogItem.creatNew(backlog);
	backlogItem.show().appendTo(area);

	var backlogII=Backlog.creatNew();
	backlogII.setId(2);
	backlogII.setContent("这是一个测试用例的内容部分II");
	backlogII.setIsMainQuest(true);
	backlogII.setIsRecent(false);
	var backlogItemII=BacklogItem.creatNew(backlogII);
	backlogItemII.show().appendTo(area);

}


/**
 * 它知道待办事项盒子们应该出现在页面的什么位置
 * 它知道哪个待办事项盒子是模式一，哪个是模式二（表现在，它知道把待办事项送给哪一个待办事项盒子）。
 * 它知道主线ID，并能根据主线ID分配各个待办事项插入对应的待办事项盒子
 * 由它来创建待办事项盒子对象并将相应模式的对象放在对应的位置上。
 * 由它来翻转第一个待办事项盒子
 * 添加的按钮由它提供，根据用户的选择，它会自己判断把数据送给哪个待办事项盒子
 * 由它将待办事项与待办事项编辑模态框组合起来
 * 
 * 待办事项数据应该作为它的参数传递给它。把待办事项组装成数组
 * 待办事项盒子们的位置应该作为它的参数传递给它
 * 主线信息作为参数传递给它
 * 
 * BacklogBoxManager(backlogAry,mainQuestInfo,area)
 * 		onAddItem(CALL_BACK(content,isMainQuest,isRecent))	当待办事项管理员要添加一条待办事项时，你可以进行一些操作，
 * 			当且仅当你的操作返回true时，待办事项管理员才真正的添加这条待办事项
 * 		onRemoveItem(CALL_BACK(itemId))		当待办事项管理员要移除一条待办事项时，你可以进行一些操作，同样只有在
 * 			操作返回true时，移除才发生
 * 		onItemChange(CALL_BACK(id,content,isMainQuest,isRecent))	当待办事项管理员要修改一条待办事项时，你可以进行一
 * 			些操作，同样只有操作返回true时修改才发生
 */
var BacklogBoxManager={
	creatNew:function(BACKLOG_ARY,MAIN_QUEST_INFO,AREA){
		var BacklogBoxManager={};

		var onItemChange=function(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT){};
		var onRemoveItem=function(ID){};
		var backlogItemAry=[];
		(function(){
			$.each(BACKLOG_ARY,function(index, el) {
				var backlogItem=BacklogItem.creatNew(el);
				backlogItem.onChange(function(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT){
					onItemChange(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT);
				});
				backlogItem.onDelete(function(ID){
					onRemoveItem(ID);
				});
				backlogItemAry.push(backlogItem);
			});
		})();

		BacklogBoxManager.onItemChange=function(CALL_BACK){
			onItemChange=CALL_BACK;
		}

		BacklogBoxManager.onRemoveItem=function(CALL_BACK){
			onRemoveItem=CALL_BACK;
		}

		var onAddItem=function(CONTENT,IS_MAIN_QUEST,IS_RECENT){};
		BacklogBoxManager.onAddItem=function(CALL_BACK){
			onAddItem=CALL_BACK;
		}


		return BacklogBoxManager;
	}
}


/**
 * 它知道自己的大小，它不知道自己的位置。
 * 当它初次被创建时，它是背面朝上的，被点击后翻转。当然它给出了翻转接口，使得它可以被手动翻转
 * 它把接收到的每一个待办事项都制作成一个按钮，显示的时候将按钮展示出来，不显示的时候隐藏按钮
 *
 * 它接收显示它的父元素（行）
 * 
 * BacklogBox(row)
 * 		addItem(BacklogItem)	向代办事项盒子里添加数据
 * 		removeItem(ID)		告诉待办事项盒子移除某条数据
 * 		onRemoveItem(CALL_BACK(ID))	当代办事项盒子要移除某条数据时，你可以进行某些操作，当且仅当你的操作
 * 			返回true时，待办事项盒子才去真正的移除数据
 * 		flip()	给外界的一个手动翻转它的接口,可以从正面翻到背面，从背面翻到正面。每次翻到正面的时候随机取三个待办事项
 */
var BacklogBox={
	creatNew:function(ROW){
		var BacklogBox={};

		var basisDiv=Div.creatNew();
		var contentDiv=Div.creatNew();
		(function init(){
			basisDiv.addClass('col-xs-3');
			basisDiv.setAttribute("style","background-color:aqua");
			basisDiv.appendTo(ROW);
			contentDiv.addClass('thumbnail');
			contentDiv.setAttribute("style","margin-top:20px;height:200px;background-color:antiquewhite");
			contentDiv.appendTo(basisDiv.ui);
		})();

		var backlogItemAry=[];
		BacklogBox.addItem=function(BACKLOG){
			backlogItemAry.push(BACKLOG);
		}

		BacklogBox.removeItem=function(BACKLOG_ID){
			backlogItemAry=$.grep(backlogItemAry,function(el,index) {
				if(el.getId() == BACKLOG_ID){
					el.hide();
					return false;
				}
				else{
					return true;
				}
			});
		}

		BacklogBox.flip=function(){
			$.each(backlogItemAry,function(index, el) {
				el.show().appendTo(contentDiv.ui);
			});
		}

		return BacklogBox;
	}
}


/**
 * 待办事项编辑模态框
 * 
 * BacklogEditModal
 * 		bindModal(BUTTON)
 * 		initBeforShow(Content,isMainQuest,isRecent)
 * 		onSave(CALL_BACK(Content,isMainQuest,isRecent))
 * 		onDelete(CALL_BACK())
 */
var BacklogEditModal={
	creatNew:function(){
		var BacklogEditModal={};

		var backlogModal=$("#backlog_edit_modal");
		var contentTextarea=$("#backlog_modal_content_textarea");
		var isMainQuest;
		var isRecent;
		var onSave=function(CONTENT,IS_MAIN_QUEST,IS_RECENT){return false};
		var onDelete=function(){return false};
		var saveBtn=$("#change_log_modal_change_btn");
		var deleteBtn=$("#change_log_modal_delete_btn");
		(function(){
			// saveBtn.addClass('btn btn-danger');
			// saveBtn.setAttribute("data-toggle","modal");
		})();

		BacklogEditModal.onSave=function(CALL_BACK){
			onSave=CALL_BACK;
		}

		BacklogEditModal.onDelete=function(CALL_BACK){
			onDelete=CALL_BACK;
		}

		BacklogEditModal.bindModal=function(BUTTON){
			BUTTON.setAttribute("data-toggle","modal");
			BUTTON.setAttribute("data-target","#backlog_edit_modal");
		}

		BacklogEditModal.initBeforShow=function(CONTENT,IS_MAIN_QUEST,IS_RECENT){
			//todo
			//在这里初始化moda界面
			contentTextarea.val(CONTENT);
			saveBtn.unbind().bind("click",function(){
				if(onSave(contentTextarea.val(),isMainQuest,isRecent)){
					close();
				}
			});
		
			deleteBtn.unbind().bind("click",function(){
				if(onDelete()){
					close();
				}
			});
		}

		function close(){
			backlogModal.modal('hide');
		}

		return BacklogEditModal;
	}
}


/**
 * 它能显示待办事项内容
 * 当鼠标移到它上时，它能用弹出框显示待办事项的具体内容
 * 当鼠标点击它时，它能弹出模态框，用以显示它的一些操作，如修改内容，删除等
 * 
 * BacklogItem(Backlog)
 * 		show()	要想待办事项显示，你就得调用这个接口，它会给你该部件的元素节点
 * 		hide()	使得待办事项可以变为不可见状态
 * 		getId()	外界获取待办事项ID的接口
 * 		//onClickListener(CALL_BACK())	通过这个接口，告知外界该待办事项被点击了
 * 		onChange(CALL_BACK(ID,CONTENT,ISMAINQUEST,ISRECENT))	当待办事项被改变时，你可以进行一些操作，当且仅当你的
 * 			操作返回true时，修改才发生
 * 		onDelete(CALL_BACK(ID))	当代办事项要被删除时，你可以进行一些操作，当且仅当你的操作返回true时，删除才发生
 */
var BacklogItem={
	creatNew:function(BACKLOG){
		var BacklogItem={};

		var backlogEditModal=BacklogEditModal.creatNew();
		var btn=PopoverButton.creatNew("hover",BACKLOG.getContent(),"",BACKLOG.getContent());
		var onChange=function(ID,CONTENT,ISMAINQUEST,ISRECENT){};
		var onDelete=function(ID){};
		(function(){
			backlogEditModal.bindModal(btn);
			backlogEditModal.onSave(function(CONTENT,ISMAINQUEST,ISRECENT){
				alert(CONTENT);
				onChange(BACKLOG.getId(),CONTENT,ISMAINQUEST,ISRECENT);
				return true;
			});
			backlogEditModal.onDelete(function(){
				alert(BACKLOG.getId());
				onDelete(BACKLOG.getId());
				return false;
			});
			btn.onClickListener(function(){
				backlogEditModal.initBeforShow(BACKLOG.getContent(),BACKLOG.isMainQuest(),BACKLOG.isRecent());
			});
			
		})();

		BacklogItem.onChange=function(CALL_BACK){
			onChange=CALL_BACK;
		}

		BacklogItem.onDelete=function(CALL_BACK){
			onDelete=CALL_BACK;
		}
		
		BacklogItem.getId=function(){
			return BACKLOG.getId();
		}

		BacklogItem.show=function(){
			btn.removeClass('hide');
			return btn;
		}

		BacklogItem.hide=function(){
			btn.addClass('hide');
		}

		return BacklogItem;
	}
}


/**
 * Backlog
 * 		setId(ID)
 * 		getId()
 * 
 * 		setContent(CONTENT)
 * 		getContent()
 *
 * 		setIsMainQuest(isMainQuest)
 * 		isMainQuest()
 *
 * 		setIsRecent(isRecent)
 * 		isRecent()
 */
var Backlog={
	creatNew:function(){
		var Backlog={};

		var id;
		var content;
		var isMainQuest;
		var isRecent;

		Backlog.setId=function(ID){
			id=Number(ID);
		}

		Backlog.getId=function(){
			return id;
		}

		Backlog.setContent=function(CONTENT){
			content=CONTENT;
		}

		Backlog.getContent=function(){
			return content;
		}

		Backlog.setIsMainQuest=function(IS_MAINQUEST){
			isMainQuest=verifyBoolean(IS_MAINQUEST);
		}

		function verifyBoolean(DATA){
			if(typeof(DATA) == "number"){
				if(DATA==0 || DATA<0){
					return false;
				}
				else{
					return true;
				}
			}
			else if(typeof(DATA) == "boolean"){
				return DATA;
			}
			else{
				alert("Backlog接收数据类型错误");
				return false;
			}
		}

		Backlog.isMainQuest=function(){
			return isMainQuest;
		}

		Backlog.setIsRecent=function(IS_RECENT){
			isRecent=verifyBoolean(IS_RECENT);
		}

		Backlog.isRecent=function(){
			return isRecent;
		}

		return Backlog;
	}
}




