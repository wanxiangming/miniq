document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/backlog/modal/BacklogAddModal.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/backlog/modal/MainQuestSetModal.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/backlog/BacklogBox.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/backlog/BacklogItem.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
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
 * 待办事项盒子们的位置应该作为它的参数传递给它,这位置的class要是row
 * 主线信息作为参数传递给它
 * 
 * BacklogBoxManager(backlogAry,hasMainLine,area)
 * 		onAddItem(CALL_BACK(content,isMainLine,isRecent))	当待办事项管理员要添加一条待办事项时，你可以进行一些操作，最后返回一个Deferred对象
 * 			该对象的resolve方法需要backlog对象作为参数
 * 		onRemoveItem(CALL_BACK(itemId))		当待办事项管理员要移除一条待办事项时，你可以进行一些操作，最后返回一个Deferred对象
 * 		onItemChange(CALL_BACK(id,content,isMainLine,isRecent))	当待办事项管理员要修改一条待办事项时，你可以进行一
 * 			些操作，最后返回一个Deferred对象
 * 		onItemComplete(CALL_BACK(id))	当待办事项完成时，你可以进行一些操作，最后返回一个Deferred对象
 * 		onAddMainQuest(CALL_BACK(CONTENT))	当我们添加了主线的时候，你可以获得主线内容，并进行一些操作，最后返回一个Deferred对象
 */
var BacklogBoxManager={
	creatNew:function(BACKLOG_ARY,HAS_MAIN_LINE,AREA){
		var BacklogBoxManager={};

		var backlogBoxAry=[];
		var classifyMap=[{IS_MAIN_LINE:true,IS_RECENT:true,index:0},{IS_MAIN_LINE:true,IS_RECENT:false,index:1},{IS_MAIN_LINE:false,IS_RECENT:true,index:2},{IS_MAIN_LINE:false,IS_RECENT:false,index:3}];
		var e_itemChange=function(ID,CONTENT,IS_MAIN_LINE,IS_RECENT){return $.Deferred();};
		var e_removeItem=function(ID){return $.Deferred();};
		var e_itemComplete=function(ID){return $.Deferred();};
		var e_addItem=function(CONTENT,IS_MAIN_LINE,IS_RECENT){return $.Deferred();};
		var e_addMainQuest=function(CONTENT){return $.Deferred();};
		(function(){
			var addItemButtonArea=Div.creatNew();
			addItemButtonArea.addClass('col-xs-1 text-right');
			addItemButtonArea.setAttribute("style","padding-right:0px;padding-top:20px;height:200px");
			addItemButtonArea.appendTo(AREA);

			var addBtn=Button.creatNew();
			addBtn.addClass('btn');
			addBtn.html("<span class=\"glyphicon glyphicon-plus\"></span>");
			addBtn.appendTo(addItemButtonArea.ui);
			var backlogAddModal=BacklogAddModal.creatNew();
			backlogAddModal.onSave(function(CONTENT,IS_MAIN_LINE,IS_RECENT){
				var def=e_addItem(CONTENT,IS_MAIN_LINE,IS_RECENT);
				def.done(function(BACKLOG){
					if(typeof(BACKLOG)=="object"){
						var backlogItem=transformBacklogToBacklogItem(BACKLOG);
						addItemIntoBacklogBoxByClassify(classify(backlogItem.isMainLine(),backlogItem.isRecent()),backlogItem);
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
					mianQuestSetModal.unbindModal(addBtn.ui);
					backlogAddModal.bindModal(addBtn.ui);
					setTimeout(function(){
						backlogAddModal.show();
					},650);
				});
				return def;
			});
			if(HAS_MAIN_LINE){
				backlogAddModal.bindModal(addBtn.ui);
			}
			else{
				mianQuestSetModal.bindModal(addBtn.ui);
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
				classifyAry[classify(value.isMainLine(),value.isRecent())].push(value);
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
			backlogItem.onChange(function(ID,CONTENT,IS_MAIN_LINE,IS_RECENT){
				var def=e_itemChange(ID,CONTENT,IS_MAIN_LINE,IS_RECENT);
				def.done(function(){
					if(backlogItem.isMainLine()==IS_MAIN_LINE && backlogItem.isRecent()==IS_RECENT){

					}
					else{
						removeItemFromBacklogBoxById(ID);
						addItemIntoBacklogBoxByClassify(classify(IS_MAIN_LINE,IS_RECENT),backlogItem);
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
		function classify(IS_MAIN_LINE,IS_RECENT){
			var classifyIndex;
			$.each(classifyMap,function(index, el) {
				if(el.IS_MAIN_LINE==IS_MAIN_LINE && el.IS_RECENT==IS_RECENT){
					classifyIndex=el.index;
				}
			});
			return classifyIndex;
		}

		function chooseBacklogBox(IS_MAIN_LINE,IS_RECENT){

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
