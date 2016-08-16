document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/MDate.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/TextTranslator.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/PopoverButton.js"+'">' + '</script>');


/**
 * 待办事项测试用例
 */


function host(){

	(function initModal(){
		//todo
		//初始化modal界面
		//设置主线checkbox
		$("input").iCheck({
			checkboxClass:"icheckbox_flat-red",
			redioClass:"iradio_flat-red"
		})
	})();

	var backlogAry=[];
	for(var i=0; i<10; i++){
		var backlog=Backlog.creatNew();
		backlog.setId(i);
		backlog.setContent(i);
		backlog.setIsMainQuest(rollBoolean());
		backlog.setIsRecent(rollBoolean());
		// var backlogItem=BacklogItem.creatNew(backlog);
		// backlogItem.onChange(function(){
		// 	return true;
		// });
		// backlogItem.onDelete(function(ID){
		// 	backlogBox.removeItem(ID);
		// 	return true;
		// });
		backlogAry.push(backlog);
	}
	var area=$("#backlogBoxRow");
	var backlogBoxManager=BacklogBoxManager.creatNew(backlogAry,"",area);
	backlogBoxManager.onRemoveItem(function(ID){
		return true;
	});
	backlogBoxManager.onItemChange(function(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT){
		return true;
	});

	// var backlogBox=BacklogBox.creatNew(area,backlogAry);
	// backlogBox.flip();

	function rollBoolean(){
		return (0.5-Math.random())>0;
	}
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

		var e_itemChange=function(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT){return false;};
		var e_removeItem=function(ID){return false;};
		var backlogItemAry=[];
		var backlogBoxAry=[];
		var classifyAryOfBacklogItemAry=[];
		(function(){
			$.each(BACKLOG_ARY,function(index, el) {
				var backlogItem=BacklogItem.creatNew(el);
				backlogItem.onChange(function(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT){
					if(e_itemChange(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT)){
						if(backlogItem.isMainQuest()==IS_MAIN_QUEST && backlogItem.isRecent()==IS_RECENT){

						}
						else{
							removeItemFromBacklogBoxById(ID);
							backlogBoxAry[classify(IS_MAIN_QUEST,IS_RECENT)].addItem(backlogItem);
						}
						return true;
					}
					else{
						return false;
					}
				});
				backlogItem.onDelete(function(ID){
					if(e_removeItem(ID)){
						removeItemFromBacklogBoxById(ID);
						return true;
					}
					else{
						return false;
					}
				});
				backlogItemAry.push(backlogItem);
			});

			for (var i = 0; i < 4; i++) {
				var ary=[];
				classifyAryOfBacklogItemAry.push(ary);
			}
			$.each(backlogItemAry,function(index,value){
				var index=classify(value.isMainQuest(),value.isRecent());
				classifyAryOfBacklogItemAry[index].push(value);
			});
			$.each(classifyAryOfBacklogItemAry,function(index,value){
				var backlogBox=BacklogBox.creatNew(AREA,value);
				backlogBoxAry.push(backlogBox);
			});
			backlogBoxAry[0].flip();
		})();

		function removeItemFromBacklogBoxById(ID){
			$.each(backlogBoxAry,function(index,value){
				value.removeItem(ID);
			});
		}

		//根据isMainQuest和isRecent来标记，这个标记也就是数组下标
		function classify(IS_MAIN_QUEST,IS_RECENT){
			if(IS_MAIN_QUEST){
				if(IS_RECENT){
					return 0;
				}
				else{
					return 1;
				}
			}
			else{
				if(IS_RECENT){
					return 2;
				}
				else{
					return 3;
				}
			}
		}

		function chooseBacklogBox(IS_MAIN_QUEST,IS_RECENT){

		}

		BacklogBoxManager.onItemChange=function(CALL_BACK){
			e_itemChange=CALL_BACK;
		}

		BacklogBoxManager.onRemoveItem=function(CALL_BACK){
			e_removeItem=CALL_BACK;
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
 * BacklogBox(row,backlogItemAry)
 * 		addItem(BacklogItem)	向代办事项盒子里添加数据
 * 		removeItem(ID)		告诉待办事项盒子移除某条数据
 * 		flip()	给外界的一个手动翻转它的接口,可以从正面翻到背面，从背面翻到正面。每次翻到正面的时候随机取三个待办事项
 */
var BacklogBox={
	creatNew:function(ROW,BACKLOG_ARY){
		var BacklogBox={};

		var MAX_BACKLOG_SHOW_ITEM=4;
		var ROLL_TIMES_OF_OUTSIDE_BACKLOG_ITEM_ARY=5;

		var basisDiv=Div.creatNew();
		var contentDiv=Div.creatNew();
		var flipperDiv=Div.creatNew();
		var frontDiv=Div.creatNew();
		var backDiv=Div.creatNew();
		var itemOutsideBackDivAry=[];
		var itemInsideBackDivAry=[];
		var itemAreaAry=[];
		var isTransitionEnd=true;
		(function init(){
			itemOutsideBackDivAry=BACKLOG_ARY;
			basisDiv.addClass('col-xs-3');
			basisDiv.appendTo(ROW);
			basisDiv.ui.bind("click",function(){ 
				// if(isTransitionEnd){
				// 	isTransitionEnd=false;
				// 	if(isBackHide()){
				// 		refreshBacklogDiv();
				// 	}
					flipContentDiv();
				// }
			});

			contentDiv.addClass('thumbnail flip-container');
			contentDiv.setAttribute("style","margin-top:20px;height:200px;");
			contentDiv.appendTo(basisDiv.ui);

			flipperDiv.appendTo(contentDiv.ui);
			flipperDiv.addClass('flipper');
			flipperDiv.ui.bind("transitionend",function(){
				isTransitionEnd=true;
				// if(isBackHide()){
				// 	refreshBacklogDiv();
				// }
			});

			frontDiv.addClass('front');
			frontDiv.setAttribute("style","background-color:antiquewhite");
			frontDiv.appendTo(flipperDiv.ui);

			backDiv.addClass('back');
			backDiv.appendTo(flipperDiv.ui);

			var headAreaDiv=Div.creatNew();
			headAreaDiv.addClass('col-xs-12');
			headAreaDiv.setAttribute("style","margin-top:10px;height:33px");
			itemAreaAry.push(headAreaDiv);
			headAreaDiv.appendTo(backDiv.ui);

			for(var i=0; i<=2; i++){
				var nullDiv=getNullDiv();
				nullDiv.appendTo(backDiv.ui);
				var areaDiv=getAreaDiv();
				areaDiv.appendTo(backDiv.ui);
				itemAreaAry.push(areaDiv);
			}
			// refreshBacklogDiv();
		})();

		function isBackHide(){
			return contentDiv.ui.hasClass("flip") == false;
		}

		function getAreaDiv(){
			var div=Div.creatNew();
			div.addClass('col-xs-12');
			div.setAttribute("style","height:33px");
			return div;
		}

		function getNullDiv(){
			var div=Div.creatNew();
			div.addClass('col-xs-12');
			div.setAttribute("style","height:13px");
			return div;
		}

		function refreshBacklogDiv(){
			hideAllShowingBacklogItemInInside();
			moveItemFromInsideToOutside();
			rollOutsideBacklogItemAry(ROLL_TIMES_OF_OUTSIDE_BACKLOG_ITEM_ARY);
			moveItemFromOutsideToInside();
			showAllhidingBacklogItemInInside();
		}

		function moveItemFromOutsideToInside(){
			itemOutsideBackDivAry=$.grep(itemOutsideBackDivAry,function(value,index){
				if(index < MAX_BACKLOG_SHOW_ITEM){
					itemInsideBackDivAry.push(value);
					return false;
				}
				else{
					return true;
				}
			});
		}

		function rollOutsideBacklogItemAry(ROLL_TIMES){
			for(var rollTimes=0; rollTimes<ROLL_TIMES; rollTimes++){
				itemOutsideBackDivAry.sort(function(){
					return 0.5 - Math.random();
				})
			}
		}

		function moveItemFromInsideToOutside(){
			itemInsideBackDivAry=$.grep(itemInsideBackDivAry,function(value,index){
				itemOutsideBackDivAry.push(value);
				return false;
			});
		}

		function hideAllShowingBacklogItemInInside(){
			$.each(itemInsideBackDivAry,function(index,value){
				value.hide();
			});
		}

		function showAllhidingBacklogItemInInside(){
			$.each(itemInsideBackDivAry,function(index,value){
				value.show().appendTo(itemAreaAry[index].ui);
			});
		}

		BacklogBox.addItem=function(BACKLOGITEM){
			itemOutsideBackDivAry.push(BACKLOGITEM);
		}

		BacklogBox.removeItem=function(BACKLOG_ID){
			removeItemOutsideBackDiv(BACKLOG_ID);
			removeItemInsideBackDiv(BACKLOG_ID);
		}

		function removeItemOutsideBackDiv(BACKLOG_ID){
			itemOutsideBackDivAry=$.grep(itemOutsideBackDivAry,function(el,index) {
				if(el.getId() == BACKLOG_ID){
					el.hide();
					return false;
				}
				else{
					return true;
				}
			});
		}

		function removeItemInsideBackDiv(BACKLOG_ID){
			itemInsideBackDivAry=$.grep(itemInsideBackDivAry,function(el,index) {
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
			setTimeout(function() {
				flipContentDiv();
			}, 1);
		}

		function flipContentDiv(){
			if(isTransitionEnd){
				isTransitionEnd=false;
				if(isBackHide()){
					refreshBacklogDiv();
				}
				contentDiv.ui.toggleClass('flip');
			}
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
 * 		show()
 * 		hide()
 */
var BacklogEditModal={
	creatNew:function(){
		var BacklogEditModal={};

		(function(){
			
		})();

		var e_save=function(CONTENT,IS_MAIN_QUEST,IS_RECENT){return false};
		BacklogEditModal.onSave=function(CALL_BACK){
			e_save=CALL_BACK;
		}

		var e_delete=function(){return false};
		BacklogEditModal.onDelete=function(CALL_BACK){
			e_delete=CALL_BACK;
		}

		BacklogEditModal.bindModal=function(BUTTON){
			BUTTON.setAttribute("data-toggle","modal");
			BUTTON.setAttribute("data-target","#backlog_edit_modal");
		}

		var isMainQuest;
		var isRecent;
		var contentTextarea=$("#backlog_modal_content_textarea");
		var saveBtn=$("#change_log_modal_change_btn");
		var deleteBtn=$("#change_log_modal_delete_btn");
		BacklogEditModal.initBeforShow=function(CONTENT,IS_MAIN_QUEST,IS_RECENT){
			contentTextarea.val(CONTENT);
			setMainQuestCheckbox(IS_MAIN_QUEST);
			setRecentCheckBox(IS_RECENT);

			saveBtn.unbind().bind("click",function(){
				if(e_save(contentTextarea.val(),getMainQuestCheckBoxState(),getRecentCheckBoxState())){
					
				}
			});
		
			deleteBtn.unbind().bind("click",function(){
				if(e_delete()){
					
				}
			});
		}

		var isMainQuestCheckBox=$("#isMainQuestCheck_checkbox");
		function setMainQuestCheckbox(IS_MAIN_QUEST){
			if(typeof(IS_MAIN_QUEST)=="boolean"){
				if(IS_MAIN_QUEST)
					isMainQuestCheckBox.iCheck("check");
				else
					isMainQuestCheckBox.iCheck("uncheck");
			}
			else{
				alert("data type error! from backlogModal->isMainQuestCheckBox");
			}
		}

		function getMainQuestCheckBoxState(){
			return isMainQuestCheckBox.is(":checked");
		}

		var isRecentCheckBox=$("#isRecentCheck_checkbox");
		function setRecentCheckBox(IS_RECENT){
			if(typeof(IS_RECENT)=="boolean"){
				if(IS_RECENT)
					isRecentCheckBox.iCheck("check");
				else
					isRecentCheckBox.iCheck("uncheck");
			}
			else{
				alert("data type error! from backlogModal->isRecentCheckBox");
			}
		}

		function getRecentCheckBoxState(){
			return isRecentCheckBox.is(":checked");
		}

		BacklogEditModal.hide=function(){
			close();
		}

		var backlogModal=$("#backlog_edit_modal");
		function close(){
			backlogModal.modal('hide');
		}

		BacklogEditModal.show=function(){
			open();
		}

		function open(){
			backlogModal.modal('show');
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
 * 		isMainQuest()
 * 		isRecent()
 * 		onChange(CALL_BACK(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT))	当待办事项被改变时，你可以进行一些操作，当且仅当你的
 * 			操作返回true时，修改才发生
 * 		onDelete(CALL_BACK(ID))	当代办事项要被删除时，你可以进行一些操作，当且仅当你的操作返回true时，删除才发生
 */
var BacklogItem={
	creatNew:function(BACKLOG){
		var BacklogItem={};

		var backlogEditModal=BacklogEditModal.creatNew();
		var btn=PopoverButton.creatNew("hover",BACKLOG.getContent(),"",BACKLOG.getContent());
		var e_change=function(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT){return false;};
		var e_delete=function(ID){return false;};
		(function(){
			backlogEditModal.bindModal(btn);
			backlogEditModal.onSave(function(CONTENT,IS_MAIN_QUEST,IS_RECENT){
				if(e_change(BACKLOG.getId(),CONTENT,IS_MAIN_QUEST,IS_RECENT)){
					backlogEditModal.hide();
					BACKLOG.setContent(CONTENT);
					BACKLOG.setIsMainQuest(IS_MAIN_QUEST);
					BACKLOG.setIsRecent(IS_RECENT);
					btn.changeHtml(CONTENT);
					btn.changeContent(CONTENT);
					return true;
				}
				else{
					return false;
				}
				
			});
			backlogEditModal.onDelete(function(){
				if(e_delete(BACKLOG.getId())){
					backlogEditModal.hide();
					return true;
				}
				else{
					return false;
				}
			});
			btn.onClickListener(function(THIS,EVENT){
				backlogEditModal.initBeforShow(BACKLOG.getContent(),BACKLOG.isMainQuest(),BACKLOG.isRecent());
				EVENT.stopPropagation();
				backlogEditModal.show();
			});
			
		})();

		BacklogItem.onChange=function(CALL_BACK){
			e_change=CALL_BACK;
		}

		BacklogItem.onDelete=function(CALL_BACK){
			e_delete=CALL_BACK;
		}
		
		BacklogItem.getId=function(){
			return BACKLOG.getId();
		}

		BacklogItem.show=function(){
			btn.removeClass('hide');
			return btn;
		}

		BacklogItem.hide=function(){
			hideItem();
		}

		function hideItem(){
			btn.addClass('hide');
		}

		BacklogItem.isMainQuest=function(){
			return BACKLOG.isMainQuest();
		}

		BacklogItem.isRecent=function(){
			return BACKLOG.isRecent();
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




