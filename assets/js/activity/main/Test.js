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

	var t=11;
	var backlogAry=[];
	for(var i=0; i<10; i++){
		var backlog=Backlog.creatNew();
		backlog.setId(i);
		backlog.setContent(i);
		backlog.setIsMainQuest(rollBoolean());
		backlog.setIsRecent(rollBoolean());
		backlogAry.push(backlog);
	}
	var area=$("#backlogBoxRow");
	var backlogBoxManager=BacklogBoxManager.creatNew(backlogAry,"",area);
	backlogBoxManager.onRemoveItem(function(ID){
		var def=$.Deferred();
		setTimeout(function(){
			def.resolve();
		},500);
		return def;
	});
	backlogBoxManager.onItemChange(function(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT){
		var def=$.Deferred();
		setTimeout(function(){
			def.resolve();
		},500);
		return def;
	});
	backlogBoxManager.onItemComplete(function(ID){
		var def=$.Deferred();
		setTimeout(function(){
			def.resolve();
		},500);
		return def;
	});
	backlogBoxManager.onAddItem(function(content,isMainQuest,isRecent){
		var def=$.Deferred();
		setTimeout(function(){
			var backlog=Backlog.creatNew();
			backlog.setId(t);
			backlog.setContent(content);
			backlog.setIsMainQuest(isMainQuest);
			backlog.setIsRecent(isRecent);
			t++;
			def.resolve(backlog);
		},1000);
		return def;
	});
	backlogBoxManager.onAddMainQuest(function(CONTENT){
		var def=$.Deferred();
		setTimeout(function(){
			$(".mainQuestContent_span").html(CONTENT);
			def.resolve();
		},1000);
		return def;
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
 * BacklogBoxManager(backlogAry,hasMainQuest,area)
 * 		onAddItem(CALL_BACK(content,isMainQuest,isRecent))	当待办事项管理员要添加一条待办事项时，你可以进行一些操作，
 * 			当且仅当你的操作返回true时，待办事项管理员才真正的添加这条待办事项
 * 		onRemoveItem(CALL_BACK(itemId))		当待办事项管理员要移除一条待办事项时，你可以进行一些操作，同样只有在
 * 			操作返回true时，移除才发生
 * 		onItemChange(CALL_BACK(id,content,isMainQuest,isRecent))	当待办事项管理员要修改一条待办事项时，你可以进行一
 * 			些操作，同样只有操作返回true时修改才发生
 * 		onItemComplete(CALL_BACK(id))	当待办事项完成时，你可以进行一些操作，只有返回true时，事项完成才发生
 * 		onAddMainQuest(CALL_BACK(CONTENT))	当我们添加了主线的时候，你可以获得主线内容，并进行一些操作，只有你的操作返回true
 * 			的时候，主线添加才成功
 */
var BacklogBoxManager={
	creatNew:function(BACKLOG_ARY,HAS_MAIN_QUEST,AREA){
		var BacklogBoxManager={};

		var backlogBoxAry=[];
		var classifyAry=[{IS_MAIN_QUEST:true,IS_RECENT:true,index:0},{IS_MAIN_QUEST:true,IS_RECENT:false,index:1},{IS_MAIN_QUEST:false,IS_RECENT:true,index:2},{IS_MAIN_QUEST:false,IS_RECENT:false,index:3}];
		var e_itemChange=function(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT){return $.Deferred();};
		var e_removeItem=function(ID){return $.Deferred();};
		var e_itemComplete=function(ID){return $.Deferred();};
		var e_addItem=function(CONTENT,IS_MAIN_QUEST,IS_RECENT){return $.Deferred();};
		var e_addMainQuest=function(CONTENT){return $.Deferred();};
		(function(){
			var addItemButtonArea=Div.creatNew();
			addItemButtonArea.addClass('col-xs-1 text-right');
			addItemButtonArea.setAttribute("style","padding-right:0px;padding-top:20px;height:200px");
			addItemButtonArea.appendTo(AREA);

			var addBtn=Button.creatNew();
			addBtn.addClass('btn btn-default');
			addBtn.html("<span class=\"glyphicon glyphicon-plus\"></span>");
			addBtn.appendTo(addItemButtonArea.ui);
			var backlogAddModal=BacklogAddModal.creatNew();
			backlogAddModal.onSave(function(CONTENT,IS_MAIN_QUEST,IS_RECENT){
				var def=e_addItem(CONTENT,IS_MAIN_QUEST,IS_RECENT);
				def.done(function(result){
					if(typeof(result)=="object"){
						var backlogItem=transformBacklogToBacklogItem(result);
						addItemIntoBacklogBoxByClassify(classify(backlogItem.isMainQuest(),backlogItem.isRecent()),backlogItem);
						backlogAddModal.hide();
					}
				});
				return def;
			});
			var mianQuestSetModal=MainQuestSetModal.creatNew();
			mianQuestSetModal.onSet(function(CONTENT){
				var def=e_addMainQuest(CONTENT);
				def.done(function(){
					mianQuestSetModal.hide();
					mianQuestSetModal.unbindModal(addBtn);
					backlogAddModal.bindModal(addBtn);
					setTimeout(function(){
						backlogAddModal.show();
					},650);
				});
				return def;
			});
			if(HAS_MAIN_QUEST){
				backlogAddModal.bindModal(addBtn);
			}
			else{
				mianQuestSetModal.bindModal(addBtn);
			}

			var itemArea=Div.creatNew();
			itemArea.addClass('col-xs-10');
			itemArea.appendTo(AREA);
			var backlogItemAry=transformBacklogAryToBacklogItemAry(BACKLOG_ARY);
			var backlogItemClassifyAry=transformBacklogItemAryToBacklogItemClassifyAry(backlogItemAry);
			$.each(backlogItemClassifyAry,function(index,value){
				var backlogBox=BacklogBox.creatNew(itemArea.ui,value);
				backlogBoxAry.push(backlogBox);
			});
			backlogBoxAry[0].flip();
		})();

		function transformBacklogItemAryToBacklogItemClassifyAry(BACKLOG_ITEM_ARY){
			var classifyAry=[];
			for (var i = 0; i < 4; i++) {
				var ary=[];
				classifyAry.push(ary);
			}
			$.each(BACKLOG_ITEM_ARY,function(index,value){
				classifyAry[classify(value.isMainQuest(),value.isRecent())].push(value);
			});
			return classifyAry;
		}

		function transformBacklogAryToBacklogItemAry(BACKLOG_ARY){
			var itemAry=[];
			$.each(BACKLOG_ARY,function(index, el) {
				itemAry.push(transformBacklogToBacklogItem(el));
			});
			return itemAry;
		}

		function transformBacklogToBacklogItem(BACKLOG){
			var backlogItem=BacklogItem.creatNew(BACKLOG);
			backlogItem.onChange(function(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT){
				var def=e_itemChange(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT);
				def.done(function(){
					if(backlogItem.isMainQuest()==IS_MAIN_QUEST && backlogItem.isRecent()==IS_RECENT){

					}
					else{
						removeItemFromBacklogBoxById(ID);
						addItemIntoBacklogBoxByClassify(classify(IS_MAIN_QUEST,IS_RECENT),backlogItem);
					}
				});
				return def;
			});
			backlogItem.onDelete(function(ID){
				var def=e_removeItem(ID);
				def.done(function(){
					removeItemFromBacklogBoxById(ID);
				});
				return def;
			});
			backlogItem.onComplete(function(ID){
				var def=e_itemComplete(ID);
				def.done(function(){
					removeItemFromBacklogBoxById(ID);
				});
				return def;
			});
			return backlogItem;
		}

		function addItemIntoBacklogBoxByClassify(CLASSIFY,BACKLOG_ITEM){
			backlogBoxAry[CLASSIFY].addItem(BACKLOG_ITEM);
		}

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

		BacklogBoxManager.onItemComplete=function(CALL_BACK){
			e_itemComplete=CALL_BACK;
		}

		BacklogBoxManager.onAddItem=function(CALL_BACK){
			e_addItem=CALL_BACK;
		}

		BacklogBoxManager.onAddMainQuest=function(CALL_BACK){
			e_addMainQuest=CALL_BACK;
		}

		return BacklogBoxManager;
	}
}

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
		var e_set=function(CONTENT){return $.Deferred();};
		(function(){
			saveBtn.unbind().bind("click",function(){
				e_set(input.val());
			});
			modal.on('show.bs.modal',function(){
				input.val("");
			});
		})();

		MainQuestSetModal.bindModal=function(BUTTON){
			BUTTON.setAttribute("data-toggle","modal");
			BUTTON.setAttribute("data-target","#set_mianQuest_modal");
		}

		MainQuestSetModal.unbindModal=function(BUTTON){
			BUTTON.setAttribute("data-toggle","");
			BUTTON.setAttribute("data-target","");
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

/**
 * 
 *
 * BacklogAddModal()
 * 		bindModal(button)
 * 		onSave(CALL_BACK(content,isMainQuest,isRecent))
 * 		show()
 * 		hide()
 */
var BacklogAddModal={
	creatNew:function(){
		var BacklogAddModal={};

		var modal=$("#backlog_add_modal");
		var saveBtn=$("#backlog_add_modal_save_btn");
		var contentTextarea=$("#backlog_add_modal_content_textarea");
		var mainQuestCheckBox=$("#backlog_add_modal_isMainQuestCheck_checkbox");
		var recentCheckBox=$("#backlog_add_modal_isRecentCheck_checkbox");
		var e_save=function(CONTENT,IS_MAIN_QUEST,IS_RECENT){return $.Deferred();};
		(function(){
			saveBtn.unbind().bind("click",function(){
				e_save(contentTextarea.val(),getMainQuestState(),getRecentState());
			});
			modal.on('show.bs.modal',function(e){
				contentTextarea.val("");
				mainQuestCheckBox.iCheck("uncheck");
				recentCheckBox.iCheck("uncheck");
			});
		})();

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
			BUTTON.setAttribute("data-toggle","modal");
			BUTTON.setAttribute("data-target","#backlog_add_modal");
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
				flipContentDiv();
			});

			contentDiv.addClass('thumbnail flip-container');
			contentDiv.setAttribute("style","margin-top:20px;height:200px;");
			contentDiv.appendTo(basisDiv.ui);

			flipperDiv.appendTo(contentDiv.ui);
			flipperDiv.addClass('flipper');
			flipperDiv.ui.bind("transitionend",function(){
				isTransitionEnd=true;
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
			if(itemInsideBackDivAryLength()<MAX_BACKLOG_SHOW_ITEM){
				itemInsideBackDivAry.push(BACKLOGITEM);
				hideAllShowingBacklogItemInInside();
				showAllhidingBacklogItemInInside();
			}
			else{
				itemOutsideBackDivAry.push(BACKLOGITEM);
			}

		}

		function itemInsideBackDivAryLength(){
			return itemInsideBackDivAry.length;
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
			setTimeout(function() {	//如果不使用定时器，box将不会触发transitionend
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
 * 		onComplete(CALL_BACK())
 * 		show()
 * 		hide()
 */
var BacklogEditModal={
	creatNew:function(){
		var BacklogEditModal={};

		var contentTextarea=$("#backlog_modal_content_textarea");
		var saveBtn=$("#backlog_edit_modal_save_btn");
		var deleteBtn=$("#backlog_edit_modal_delete_btn");
		var completeBtn=$("#backlog_edit_modal_complete_btn");
		var isMainQuestCheckBox=$("#isMainQuestCheck_checkbox");
		var isRecentCheckBox=$("#isRecentCheck_checkbox");
		var backlogModal=$("#backlog_edit_modal");
		var e_save=function(CONTENT,IS_MAIN_QUEST,IS_RECENT){return $.Deferred();};
		var e_delete=function(){return $.Deferred();};
		var e_complete=function(){return $.Deferred();};
		(function(){
			
		})();

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
			BUTTON.setAttribute("data-toggle","modal");
			BUTTON.setAttribute("data-target","#backlog_edit_modal");
		}

		BacklogEditModal.initBeforShow=function(CONTENT,IS_MAIN_QUEST,IS_RECENT){
			contentTextarea.val(CONTENT);
			setMainQuestCheckbox(IS_MAIN_QUEST);
			setRecentCheckBox(IS_RECENT);

			saveBtn.unbind().bind("click",function(){
				e_save(contentTextarea.val(),getMainQuestCheckBoxState(),getRecentCheckBoxState())
			});
		
			deleteBtn.unbind().bind("click",function(){
				e_delete();
			});

			completeBtn.unbind().bind("click",function(){
				e_complete();
			});
		}

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
 * 		onComplete(CALL_BACK(ID))	当待办事项被完成时，你可以进行一些操作，当且仅当你的操作返回true时，完成才发生
 */
var BacklogItem={
	creatNew:function(BACKLOG){
		var BacklogItem={};

		var backlogEditModal=BacklogEditModal.creatNew();
		var btn=PopoverButton.creatNew("hover",BACKLOG.getContent(),"",BACKLOG.getContent());
		var e_change=function(ID,CONTENT,IS_MAIN_QUEST,IS_RECENT){return $.Deferred();};
		var e_delete=function(ID){return $.Deferred();};
		var e_complete=function(ID){return $.Deferred();};
		(function(){
			backlogEditModal.bindModal(btn);
			backlogEditModal.onSave(function(CONTENT,IS_MAIN_QUEST,IS_RECENT){
				var def=e_change(BACKLOG.getId(),CONTENT,IS_MAIN_QUEST,IS_RECENT);
				def.done(function(){
					backlogEditModal.hide();
					BACKLOG.setContent(CONTENT);
					BACKLOG.setIsMainQuest(IS_MAIN_QUEST);
					BACKLOG.setIsRecent(IS_RECENT);
					btn.changeHtml(CONTENT);
					btn.changeContent(CONTENT);
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

		BacklogItem.onComplete=function(CALL_BACK){
			e_complete=CALL_BACK;
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




