

minclude("DaylogManager");
minclude("AttentionTableAryManager");
minclude("MPagination");
minclude("HistoryItem");
minclude("HistoryPage");
minclude("HistoryPageManager");
minclude("Table");
minclude("AttentionTable");
minclude("Transaction");
minclude("TransactionDataStructure");
minclude("InputController");
minclude("TextTranslator");
minclude("TransactionItem");
minclude("TimeSameTransactionItem");
minclude("LoaderPiano");
minclude("InputControl");


function host(){

	// console.log(tableInheritLinkAry);
	// console.log(attentionTableAryNET);
	var attentionTableAryManager=AttentionTableAryManager.creatNew();
	$.each(attentionTableAryNET,function(index, el) {
		var attentionTable=AttentionTable.creatNew();
		attentionTable.setTableId(el.tableId);
		attentionTable.setTableName(el.tableName);
		attentionTable.setIsManager(el.isManager);
		$.each(el.inheritTableAry,function(ind, value) {
			var table=Table.creatNew();
			table.setTableId(value.tableId);
			table.setTableName(value.tableName);
			attentionTable.addParentTable(table);
		});
		attentionTable.setInheritAry(tableInheritLinkAry[index]);
		attentionTableAryManager.addAttentionTable(attentionTable);
	});

	var attentionTableAry=attentionTableAryManager.getAttentionTableAry();
	var allTableIdAry=attentionTableAryManager.getAllTableIdAry();
	var mainTable=$("#mainTable");
	var daylogManager=DaylogManager.creatNew(mainTable);
	var transactionItemAryAry=[];
	var createTime=new Date();
	var isInfoModalShow=false;
	var isTimeSameModalShow=false;

	//--------------------------------------------------------------------------------------------

	//初始化createTransactionIC
	var createTransactionModalContentTextarea=$("#create_log_modal_content_input");
	var createTransactionIC=InputController.creatNew(createTransactionModalContentTextarea,1000);
	createTransactionIC.onChange(function(){
		var createTransactionModalcontentRow=$("#create_transaction_content_row");
		createTransactionModalContentLength.html(createTransactionIC.getRemainLength()+"字");
		if(createTransactionIC.verify()){
			createTransactionModalcontentRow.removeClass('has-error');
		}
		else{
			createTransactionModalcontentRow.addClass('has-error');
		}
	});

	//获取所有未来的transaction，并制作成TransacctionItem，push到transactionItemAryAry中
	var getTransaction=GetTransaction.creatNew(allTableIdAry);
	getTransaction.onSuccessLisenter(function(DATA){
		$.each(DATA,function(index, el) {
			var transactionItem=createTransactionItem(el.id,el.tableId,el.content,el.time);
			insertTransactionItem(transactionItem);
		});
		refreshDaylogManager();
	});
	getTransaction.launch();

	// "+" 按钮的初始化
	var createTransactionModalContentLength=$("#transaction_create_input_length");
	var addTransactionBtn=$("#addTransactionBtn");
	addTransactionBtn.attr("data-toggle","modal");
	addTransactionBtn.attr("data-target","#create_transaction_modal");
	addTransactionBtn.bind("click",function(){
		createTransactionIC.empty();
		createTransactionModalContentLength.html("1000字");
	});

	//初始化CreateTransactionModal中的TableSelect列表
	var createTransactionModalTableSelect=$("#create_log_modal_tableSelect");
	$.each(attentionTableAry,function(index,value){
		if(value.isManager()){
			createTransactionModalTableSelect.append("<option value="+value.getTableId()+">"+value.getTableName()+"</option>");
		}
	});

	//设置CreateTransactionModal中的"创建"按钮被点击时的响应
	var createTransactionModalLoaderScope=$("#create_transaction_modal_loader_scope");
	var createTransactionModalLoader=LoaderPiano.creatNew();
	createTransactionModalLoader.appendTo(createTransactionModalLoaderScope);
	createTransactionModalLoader.hide();
	var createTransactionModalCreateBtn=$("#create_log_modal_create_btn");
	createTransactionModalCreateBtn.bind("click",function(){
		var createTransactionModal=$("#create_transaction_modal");
		if(createTransactionIC.verify()){
			var content=createTransactionIC.getContent();
			var time=createTime.getTime();
			var tableId=createTransactionModalTableSelect.val();
			var createTransactionNET=CreateTransaction.creatNew(tableId,time,content);
			createTransactionNET.onSuccessLisenter(function(data){
				if(data > 0){
					var transactionItem=createTransactionItem(data,tableId,content,time);
					insertTransactionItem(transactionItem);
					refreshDaylogManager();
					createTransactionModalLoader.hide();
					createTransactionModal.modal('hide');
				}
			});
			createTransactionNET.launch();
			createTransactionModalLoader.show();
		}
		else{
			//do nothing if varification failed 
		}
	});


	//TimmPicker初始化
	var timePicker=$("#timePicker");
	timePicker.datetimepicker({
		startDate:createTime,
		autoclose:true,
		todayBtn:true,
		todayHighlight:true,
		language:'zh-CN',
		format:'yyyy-mm-dd hh:ii'
	});
	timePicker.datetimepicker("update",createTime);
	timePicker.on("changeDate",function(ev){
		createTime=ev.date;
	});

	function refreshDaylogManager(){
		if(!isTimeSameModalShow && !isInfoModalShow){
			var timeSameTransactionScopeInModal=$("#time_same_transaction_scope");
			var timeSameTransactionModal=$("#time_same_transaction_modal");
			daylogManager.clear();
			$.each(transactionItemAryAry,function(index, el) {
				if(el.length > 1){
					var timeSameTransactionItem=TimeSameTransactionItem.creatNew(el);
					timeSameTransactionItem.setAttribute("data-toggle","modal");
					timeSameTransactionItem.setAttribute("data-target","#time_same_transaction_modal");
					timeSameTransactionItem.onClick(function(){
						//当timeSameTransaction被点击的时候，将其内容添加到modal的相应位置中
						//并把TimeSameModal的显示标志改为true
						isTimeSameModalShow=true;
						$.each(el,function(index, vel) {
							vel.show();
							vel.appendTo(timeSameTransactionScopeInModal);
						});

						//重置timeSameModal隐藏时的行为
						//timeSameTransactionModal被隐藏的时候，把添加到其中的Item也隐藏
						timeSameTransactionModal.on("hide.bs.modal",function(){
							isTimeSameModalShow=false;
							$.each(el,function(index, vel) {
								vel.hide();
							});
							refreshDaylogManager();
						});
					});
					daylogManager.addTransactionItem(timeSameTransactionItem);
				}
				else{
					daylogManager.addTransactionItem(el[0]);
				}
			});
			daylogManager.refreshUI();
		}
	
	}

	function insertTransactionItem(transactionItem){
		var isExist=false;
		$.each(transactionItemAryAry,function(index, el) {
			if(el[0].getTransactionTime() == transactionItem.getTransactionTime()){
				el.push(transactionItem);
				isExist=true;
			}
		});
		if(!isExist){
			var transactionItemAry=[];
			transactionItemAry.push(transactionItem);
			transactionItemAryAry.push(transactionItemAry);
		}
	}

	function removeTransactionItem(TRANSACTION_ID){
		var aryAry=[];
		$.each(transactionItemAryAry,function(index, el) {
			var ary=[];
			$.each(el,function(ind, vel) {
				if(vel.getTransactionId() != TRANSACTION_ID){
					ary.push(vel);
				}
				else{
					vel.hide();
				}
			});
			if(ary.length>0){
				aryAry.push(ary);
			}
		});
		transactionItemAryAry=aryAry;
	}


	function createTransactionItem(ID,TABLE_ID,CONTENT,TIME){
		var transaction=Transaction.creatNew();
		transaction.setTransactionId(ID);
		transaction.setTableId(TABLE_ID);
		transaction.setContent(CONTENT);
		transaction.setTime(TIME);
		var transactionDataStructure=TransactionDataStructure.creatNew(attentionTableAry,transaction);
		var transactionItem=TransactionItem.creatNew(transactionDataStructure);
		transactionItem.setAttribute("data-toggle","modal");
		transactionItem.setAttribute("data-target","#transaction_info_modal");
		transactionItem.onClick(function(){
			initTransactionInfoModal(ID,transactionDataStructure.sourceSTR(),transactionDataStructure.pathSTR(),TIME,CONTENT,transactionDataStructure.isManager());
		});
		return transactionItem;
	}

	//TransactionInfoModal的初始化
	var e_withdrawal=function(){};
	var confirmBtn=$("#checkAction_btn");
	var confirmModal=$("#checkAction_Modal");
	var confirmModalLoaderScope=$("#confirmModalLoaderScope");
	var confirmLoader=LoaderPiano.creatNew();
	confirmLoader.hide();
	confirmLoader.appendTo(confirmModalLoaderScope);
	confirmBtn.bind("click",function(){
		e_withdrawal();
	});
	function initTransactionInfoModal(ID,SOURCE_NODE_NAME,PATH,TIME,CONTENT,IS_SHOW_WITHDRAWAL_BTN){
		// console.log(TIME);
		isInfoModalShow=true;
		var transactionInfoModal=$("#transaction_info_modal");
		var transactionSourceNode=$("#transaction_info_modal_source");
		var transactionPath=$("#transaction_info_modal_path");
		var transactionTime=$("#transaction_info_modal_time");
		var transactionContent=$("#transaction_info_modal_content");
		var withdrawalBtn=$("#transaction_info_modal_withdrawal");

		transactionSourceNode.html(SOURCE_NODE_NAME);
		transactionPath.html(PATH);
		var date=new Date(Number(TIME));
		var year=date.getFullYear();
		var month=date.getMonth()+1;
		var dateD=date.getDate();
		var hour=date.getHours();
		var minute=date.getMinutes();
		transactionTime.html(year+"-"+month+"-"+dateD+"  "+hour+":"+minute);
		transactionContent.html(TextTranslator.creatNew().encodeText(CONTENT));
		if(IS_SHOW_WITHDRAWAL_BTN){
			//初始化撤销按钮
			e_withdrawal=function(){
				var deleteTransaction=DeleteTransaction.creatNew(ID);
				deleteTransaction.onSuccessLisenter(function(data){
					if(data==0){
						confirmLoader.hide();
						confirmModal.modal("hide");
						transactionInfoModal.modal('hide');
						removeTransactionItem(ID);
						refreshDaylogManager();
					}
				});
				deleteTransaction.launch();
				confirmLoader.show();
			}
			withdrawalBtn.removeClass('hide');
		}
		else{
			withdrawalBtn.addClass('hide');
		}

		transactionInfoModal.on("hide.bs.modal",function(){
			isInfoModalShow=false;
		});
	}


	//历史清单的初始化
	var pagination=$("#pagination");
	var historyList=$("#history-list");
	if(0 < historyCountOfTransaction){
		var historyPageManager=HistoryPageManager.creatNew();
		var mPagination=MPagination.creatNew(pagination,historyCountOfTransaction,20);
		var getHistoryTransaction=GetHistoryTransaction.creatNew(allTableIdAry,1);
		getHistoryTransaction.onSuccessLisenter(function(data){
			var historyPage=makeHistoryPage(data,1);
			historyPage.appendTo(historyList);
			historyPageManager.addPage(historyPage);
		});
		getHistoryTransaction.launch();

		mPagination.onPageChange(function(PAGES){
			// console.log(PAGES);
			if(historyPageManager.isPageExist(PAGES)){
				$.each(historyPageManager.getPageAry(),function(index, el) {
					el.hide();
				}); 
				historyPageManager.getPage(PAGES).show();
			}
			else{
				var getHistoryTransactionNET=GetHistoryTransaction.creatNew(allTableIdAry,PAGES);
				getHistoryTransactionNET.onSuccessLisenter(function(data){
					$.each(historyPageManager.getPageAry(),function(index, el) {
						el.hide();
					}); 
					var historyPage=makeHistoryPage(data,PAGES);
					historyPage.appendTo(historyList);
					historyPageManager.addPage(historyPage);
				});
				getHistoryTransactionNET.launch();
			}
		});
	}

	function makeHistoryPage(DATA,PAGES){
		var historyPage=HistoryPage.creatNew(PAGES);
		$.each(DATA,function(index, el) {
			var transaction=Transaction.creatNew();
			transaction.setTransactionId(el.id);
			transaction.setTableId(el.tableId);
			transaction.setContent(el.content);
			transaction.setTime(el.time);
			var transactionDataStructure=TransactionDataStructure.creatNew(attentionTableAry,transaction);
			var historyItem=HistoryItem.creatNew(transactionDataStructure);
			historyItem.setAttribute("data-toggle","modal");
			historyItem.setAttribute("data-target","#transaction_info_modal");
			historyItem.ui.bind("click",function(){
				initTransactionInfoModal(el.id,transactionDataStructure.sourceSTR(),transactionDataStructure.pathSTR(),el.time,el.content,false);
			});
			historyPage.addHistoryItem(historyItem);
		});
		return historyPage;
	}




	//filterInput的测试代码
	var filter=$("#filterInput");
	var inputController=InputController.creatNew(filter,20);
	inputController.onChange(function(){
		var content=inputController.getContent();
		var str=/\*(.+)|\^(.+)/;
		var resultAry=content.match(str);
		// console.log(resultAry);
		// console.log("节点名称是："+resultAry[1]);
	});
}






















	// daylogManager.whatINeed(function(TIME_ARY){
	// 	var def=$.Deferred();
	// 	
	// 	
	// 	return def;
	// });
	// daylogManager.onCreate(function(TABLE_ID,CONTENT,TIME){
	// 	var def=$.Deferred();
	// 	var createLogTransaction=CreateLogTransaction.creatNew(TABLE_ID,TIME,CONTENT);
	// 	createLogTransaction.onSuccessLisenter(function(data){
	// 		var transaction=Transaction.creatNew();
	// 		transaction.setTransactionId(data);
	// 		transaction.setTableId(TABLE_ID);
	// 		transaction.setContent(CONTENT);
	// 		transaction.setTime(TIME);
	// 		def.resolve(TransactionDataStructure.creatNew(attentionTableAry,transaction));
	// 	});
	// 	createLogTransaction.onErrorLisenter(function(){
	// 		def.reject();
	// 	});
	// 	createLogTransaction.launch();
	// 	return def;
	// });
	// daylogManager.onChange(function(TRANSACTION_ID,CONTENT,TIME){
	// 	var def=$.Deferred();
	// 	var changeLogTransaction=ChangeLogTransaction.creatNew(TRANSACTION_ID,TIME,CONTENT);
	// 	changeLogTransaction.onSuccessLisenter(function(data){
	// 		if(data == 0){
	// 			def.resolve();
	// 		}
	// 	});
	// 	changeLogTransaction.onErrorLisenter(function(){
	// 		def.reject();
	// 	});
	// 	changeLogTransaction.launch();
	// 	return def;
	// });
	// daylogManager.onDelete(function(TRANSACTION_ID){
	// 	var def=$.Deferred();
	// 	var deleteLogTransaction=DeleteLogTransaction.creatNew(TRANSACTION_ID);
	// 	deleteLogTransaction.onSuccessLisenter(function(data){
	// 		if(data == 0){
	// 			def.resolve();
	// 		}
	// 	});
	// 	deleteLogTransaction.onErrorLisenter(function(){
	// 		def.reject();
	// 	});
	// 	deleteLogTransaction.launch();
	// 	return def;
	// });





minclude("Daylog");
minclude("MDate");
minclude("Div");
/**
 * DaylogManager(SCOPE)
 * 		addTransactionItem(TransactionItem transactionItem)
 * 		removeTransactionItem(int TransactionId)
 * 		refreshUI()		//让DaylogMangaer根据TransactionItem数据自动调整UI
 * 		rewind()		//重置显示区间
 */
var DaylogManager={
	creatNew:function(SCOPE){
		var DaylogManager={};

		var div=Div.creatNew();
		var daylogScopeAry=[];
		var daylogAry=[];
		var firstScopeNum=1;
		var lastScopeNum=6;
		var transactionItemAryAry=[];

		(function(){

		})();

		DaylogManager.rewind=function(){
			firstScopeNum=1;
			lastScopeNum=6;
		}

		//使daylogManager根据transactionItemAryAry自动调整UI
		DaylogManager.refreshUI=function(){
			sortDaylog();

			div=Div.creatNew();
			div.addClass('panel-body');
			div.appendTo(SCOPE);
			$.each(daylogAry,function(index,value){
				var logScope=Div.creatNew();
				logScope.setAttribute("style","height:280px;overflow-y: auto;");
				logScope.addClass("col-xs-2 correction-clear-col-xs-padding");
				logScope.appendTo(div.ui);
				daylogScopeAry.push(logScope);
				value.appendTo(logScope.ui);
			});
			changeDaylogScopeVisibility();
			if(6 < daylogScopeAry.length){
				SCOPE.unbind().bind('mousewheel',function(event,delta){
					var dl=delta > 0 ? false:true;
					if(dl){
						next();
					}
					else{
						last();
					}
					return false;
				});
			}
		}

		DaylogManager.clear=function(){
			daylogScopeAry=[];
			daylogAry=[];
			div.addClass('hide');
		}

		function next(){
			if(lastScopeNum < daylogScopeAry.length){
				firstScopeNum++;
				lastScopeNum++;
				changeDaylogScopeVisibility();
			}
		}

		function last(){
			if(1 < firstScopeNum){
				firstScopeNum--;
				lastScopeNum--;
				changeDaylogScopeVisibility();
			}
		}

		DaylogManager.addTransactionItem=function(TRANSACTION_ITEM){
			var isExist=false;
			var mDate=MDate.creatNew(TRANSACTION_ITEM.getTransactionTime());
			$.each(daylogAry,function(index, el) {
				if(el.getDayFlag() == mDate.getDayFlag()){
					el.addTransaction(TRANSACTION_ITEM);
					isExist=true;
				}
			});
			if(!isExist){
				var daylog=Daylog.creatNew(mDate.getDayFlag());
				daylog.addTransaction(TRANSACTION_ITEM);
				daylogAry.push(daylog);
			}
		}

		function changeDaylogScopeVisibility(){
			var index=1;
			$.each(daylogScopeAry,function(ind, el) {
				if(firstScopeNum <= index && index <= lastScopeNum){
					el.removeClass('hide');
				}
				else{
					el.addClass('hide');
				}
				index++;
			});
		}

		function sortDaylog(){
			daylogAry.sort(function(valueA,valueB){
				if(valueA.getDayFlag() <= valueB.getDayFlag()){
					return -1;
				}
				else{
					return 1;
				}
			});
		}

		// DaylogManager.addTransactionItem=function(TRANSACTION_ITEM){
		// 	var isExist=false;
		// 	$.each(transactionItemAryAry,function(index, el) {
		// 		if(el[0].getTransactionTime() == TRANSACTION_ITEM.getTransactionTime()){
		// 			el.push(TRANSACTION_ITEM);
		// 			isExist=true;
		// 		}
		// 	});
		// 	if(!isExist){
		// 		var transactionItemAry=[];
		// 		transactionItemAry.push(TRANSACTION_ITEM);
		// 		transactionItemAryAry.push(transactionItemAry);
		// 	}
		// }

		return DaylogManager;
	}
}


minclude("Table");
minclude("AttentionTable");
/**
 * AttentionTableAryManager()
 * 		addAttentionTable(AttentionTable)
 * 		getAllTableIdAry()		//返回的是你关注的表以及这些表的所有父表的tableId数组
 * 		getAttentionTableAry()	//返回的是AttetionTable对象的数组
 */
var AttentionTableAryManager={
	creatNew:function(){
		var AttentionTableAryManager={};

		var attentionTableAry=[];
		var allTableIdAry=[];

		(function(){

		})();

		AttentionTableAryManager.addAttentionTable=function(ATTENTION_TABLE){
			attentionTableAry.push(ATTENTION_TABLE);
			addTableId(ATTENTION_TABLE.getTableId());
			ATTENTION_TABLE.parentTableIterator(function(TABLE){
				addTableId(TABLE.getTableId());
			});
		}

		function addTableId(TABLE_ID){
			if($.inArray(TABLE_ID,allTableIdAry) < 0){
				allTableIdAry.push(TABLE_ID);
			}
		}

		AttentionTableAryManager.getAllTableIdAry=function(){
			return allTableIdAry;
		}

		AttentionTableAryManager.getAttentionTableAry=function(){
			return attentionTableAry;
		}


		return AttentionTableAryManager;
	}
}


/**
 * MPagination(Element element,int totalItems,int itemsPerPage)
 * 		onPageChange(CALL_BACK(int pages,Event event))
 */

var MPagination={
	creatNew:function(ELEMENT,TOTAL_ITEMS,ITEMS_PER_PAGE){
		var MPagination={};

		var paginationScope=ELEMENT;
		var totalItems=TOTAL_ITEMS;
		var itemsPerPage=ITEMS_PER_PAGE;
		var totalPages=Math.ceil(TOTAL_ITEMS/ITEMS_PER_PAGE);
		var e_pageChange=function(PAGES){};

		(function(){
			paginationScope.twbsPagination({
				totalPages:totalPages,
				visiblePages:10,
				nextClass:"hide",
				prevClass:"hide",
				firstClass:"hide",
				lastClass:"hide",
				onPageClick:function(EVENT,PAGES){
					e_pageChange(PAGES);
				}
			});
		})();

		MPagination.onPageChange=function(CALL_BACK){
			e_pageChange=CALL_BACK;
		}

		return MPagination;
	}
}




minclude("Div");
/**
 * HistoryItem(TransactionDataStructure transactionDataStructure)
 * 		onClick(CALL_BACK(TransactionDataStructure transactionDataStructure))
 */
var HistoryItem={
	creatNew:function(TRANSACTION_DATA_STRUCTURE){
		var HistoryItem=Div.creatNew();

		var transactionDataStructure=TRANSACTION_DATA_STRUCTURE;
		var contentDiv=Div.creatNew();
		var timeDiv=Div.creatNew();
		var e_click=function(TransactionDataStructure){};

		(function(){
			HistoryItem.addClass('col-xs-12 btn deep-background-on-hover');
			HistoryItem.ui.bind("click",function(){
				e_click(transactionDataStructure);
			});

			contentDiv.addClass('col-xs-9 text-left');
			contentDiv.setAttribute("style","text-overflow:ellipsis;overflow:hidden");
			contentDiv.html(transactionDataStructure.getFirstRowContent());
			contentDiv.appendTo(HistoryItem.ui);

			timeDiv.addClass('col-xs-3 text-right');
			timeDiv.setAttribute("style","color:darkgrey");
			timeDiv.html(getTimeString());
			timeDiv.appendTo(HistoryItem.ui);
		})();

		function getTimeString(){
			var string="";
			var date=new Date(transactionDataStructure.getTime());
			var thatYear=date.getFullYear();
			var thatMonth=date.getMonth()+1;
			var thatDate=date.getDate();

			// var todayDate=new Date();
			// var thisYear=todayDate.getFullYear();
			// var thisMonth=todayDate.getMonth();
			// var thisDate=todayDate.getDate();
			
			// if(thatYear < thisYear){
			// 	string+=thatYear+"-"+thatMonth+"-"+thatDate;
			// }
			// else if(thatMonth < thisMonth){
			// 	// string+=thatMonth+"-"+thatDate;
			// 	string+=thatYear+"-"+thatMonth+"-"+thatDate;
			// }
			// else{
			// 	string+=thatDate+" 日";
			// }
			string+=thatYear+"-"+thatMonth+"-"+thatDate;
			return string;
		}

		HistoryItem.onClick=function(CALL_BACK){
			e_click=CALL_BACK;
		}

		return HistoryItem;
	}
}



minclude("Div");
/**
 * HistoryPage(int page)
 * 		getPage()
 * 		addHistoryItem(HistoryItem historyItem)
 * 		show()
 * 		hide()
 */
var HistoryPage={
	creatNew:function(PAGE){
		var HistoryPage=Div.creatNew();

		var leftPage=Div.creatNew();
		var rightPage=Div.creatNew();
		var page=PAGE;
		var itemNum=0;

		(function(){
			leftPage.addClass('col-xs-6');
			leftPage.appendTo(HistoryPage.ui)
			rightPage.addClass('col-xs-6');
			rightPage.appendTo(HistoryPage.ui)
			HistoryPage.addClass('col-xs-12');
		})();

		HistoryPage.addHistoryItem=function(HISTORY_ITEM){
			if(itemNum < 10){
				HISTORY_ITEM.appendTo(leftPage.ui);
			}
			else{
				HISTORY_ITEM.appendTo(rightPage.ui);
			}
			itemNum++;
		}

		HistoryPage.show=function(){
			HistoryPage.removeClass('hide');
		}

		HistoryPage.hide=function(){
			HistoryPage.addClass('hide');
		}

		HistoryPage.getPage=function(){
			return page;
		}

		return HistoryPage;
	}
}

/**
 * HistoryPageManager()
 * 		isPageExist(int page)	//return boolean
 * 		addPage(HistoryPage historyPage)
 * 		getPage(int page)		//return HistoryPage
 * 		getPageAry()			//return array of HistoryPage
 */
var HistoryPageManager={
	creatNew:function(){
		var HistoryPageManager={};

		var historyPageAry=[];

		HistoryPageManager.isPageExist=function(PAGE){
			var isPageExist=false;
			$.each(historyPageAry,function(index, el) {
				if(el.getPage() == PAGE){
					isPageExist=true;
				}
			});
			return isPageExist;
		}

		HistoryPageManager.addPage=function(HISTORY_PAGE){
			historyPageAry.push(HISTORY_PAGE);
		}

		HistoryPageManager.getPage=function(PAGE){
			var historyPage=null;
			$.each(historyPageAry,function(index, el) {
				if(el.getPage() == PAGE){
					historyPage=el;
				}
			});
			return historyPage;
		}

		HistoryPageManager.getPageAry=function(){
			return historyPageAry;
		}

		return HistoryPageManager;
	}
}


/**
 *	table的创建者这种信息不应该告诉其他人，所以它的相关操作应该被隐藏在服务器中
 * 
 *	tableId
 *	tableName
 * 
 * Table()
 * 		setTableId(id)
 * 		getTableId()
 * 		setTableName(tableName)
 * 		getTableName()
 */
var Table={
	creatNew:function(){
		var Table={};

		var tableId;
		var tableName;

		Table.setTableId=function(TBALE_ID){
			tableId=Number(TBALE_ID);
		}

		Table.getTableId=function(){
			return tableId;
		}

		Table.setTableName=function(TABLE_NAME){
			tableName=TABLE_NAME;
		}

		Table.getTableName=function(){
			return tableName;
		}

		return Table;
	}
}



minclude("Table");
/**
 *	parentTableAry
 *	isManager 	//这个数据在服务器上判断，我们仅告诉服务器我们的openId，服务器去查询link表，然后用是否是管理员，是否是该表创建者来决定isManager字段
 *	tableAnotherName
 * 
 * AttentionTable()
 * 		setIsManager(boolean)
 * 		isManager()				//manager要弃用，因为以后凡是attention的table，就是manager
 *
 * 		setInheritAry(array inheritAry)	//inherit是一个以子表为key，父表为value的数组
 * 		setParentTableAry(Table_Ary)
 * 		
 * 		addParentTable(Table)
 * 		parentTableIterator(CALL_BACL(Table))	//父表的迭代器
 * 		findParentTable(int tableId)	//有则返回Table对象，没有返回null
 * 		entrance(int tableId)			//有则返回Table对象，没有返回null,用tableId去InheritAry中找，
 *
 *
 * 		来自父：
 * 		setTableId(id)
 * 		getTableId()
 * 		setTableName(tableName)
 * 		getTableName()
 */
var AttentionTable={
	creatNew:function(){
		var AttentionTable=Table.creatNew();

		var parentTableAry=[];
		var isManager;
		var inheritAry;

		AttentionTable.setIsManager=function(BOOLEAN){
			isManager=BOOLEAN;
		}

		AttentionTable.setInheritAry=function(INHERIT_ARY){
			inheritAry=INHERIT_ARY;
		}

		AttentionTable.isManager=function(){
			return true;
		}

		AttentionTable.setParentTableAry=function(PARENT_TABLE_ARY){
			parentTableAry=PARENT_TABLE_ARY;
		}

		AttentionTable.addParentTable=function(TABLE){
			parentTableAry.push(TABLE);
		}

		AttentionTable.parentTableIterator=function(CALL_BACL){
			$.each(parentTableAry,function(index, el) {
				CALL_BACL(el);
			});
		}

		AttentionTable.findParentTable=function(TABLE_ID){
			return findParentTable(TABLE_ID);
		}

		AttentionTable.entrance=function(TABLE_ID){
			var tableId=Number(TABLE_ID);
			if(tableId == AttentionTable.getTableId()){	//如果该tableId就是这个attentionTable的ID，说明不存在入口，此时应该返回null
				return null;
			}
			else{
				var key=true;
				var result;
				while(key){
					result=findKey(tableId);
					if(result == AttentionTable.getTableId()){
						//tableId是入口
						key=false;
					}
					else{
						tableId=result;
					}
				}
				//用tableId去找到table
				return findParentTable(tableId);
			}	
		}

		function findParentTable(TABLE_ID){
			var table=null;
			$.each(parentTableAry,function(index, el) {
				if(el.getTableId() == TABLE_ID){
					table=el;
				}
			});
			return table;
		}

		function findKey(VALUE){
			var key=null;
			$.each(inheritAry,function(index, el) {
				if(el[1] == VALUE){
					key=el[0];
				}
			});
			
			return key;
		}

		return AttentionTable;
	}
}

/**
 * Tranaction()
 * 		setTransactionId();
 * 		getTransactionId();
 *
 * 		setTableId();
 * 		getTableId();
 *
 * 		setContent();
 * 		getContent();
 * 		getFirstRowContent()
 * 		
 * 		setTime();
 * 		getTime();
 */
var Transaction={
	creatNew:function(){
		var Transaction={};

		var transactionId;
		var tableId;
		var content;
		var time;

		Transaction.setTransactionId=function(TRSANCTION_ID){
			transactionId=Number(TRSANCTION_ID);
		}

		Transaction.getTransactionId=function(){
			return transactionId;
		}

		Transaction.setTableId=function(TABLE_ID){
			tableId=Number(TABLE_ID);
		}

		Transaction.getTableId=function(){
			return tableId;
		}

		Transaction.setContent=function(CONTENT){
			content=CONTENT;
		}

		Transaction.getContent=function(){
			return content;
		}

		Transaction.getFirstRowContent=function(){
			var newContent=content;
			var reg=/(.)+/;
			var stringAry=content.match(reg);
			if(stringAry != null){
				newContent=stringAry[0];
			}
			return newContent;
		}

		Transaction.setTime=function(TIME){
			time=Number(TIME);
		}

		Transaction.getTime=function(){
			return time;
		}

		return Transaction;
	}
}

/**
 * 它需要知道该用户关注的表，是否对表具有管理员权限（这将决定该用户是否能对某个transaction进行修改），以及这些表各自的父表池（这将决定该transaction的头名）
 * 
 *	是否来自直接关注？
 *		是：是否具有管理员权限？（这个问题的回答，要考虑是否是该表的创建者这种情况）
 *		否：哪个子表获取了这条信息？
 *
 * 	内容是什么？
 * 	时间？
 * 	ID？
 * 
 * TransactionDataStructure(attentionTableAry,transaction)
 * 		//isDirectAttention()
 * 		isManager()
 * 		//getChildTableName()
 * 		//getChildTableId()
 * 		//getParentTableName()
 * 		//getParentTableId()
 *
 * 		sourceSTR()
 * 		pathSTR()
 *
 * 		来自父：
 * 		setTransactionId();
 * 		getTransactionId();
 *
 * 		setTableId();
 * 		getTableId();	//这个tableId是transaction所指向的table
 *
 * 		setContent();
 * 		getContent();
 * 		getFirstRowContent()
 * 		
 * 		setTime();
 * 		getTime();
 */
var TransactionDataStructure={
	creatNew:function(ATTENTION_TABLE_ARY,TRANSACTION){
		var TransactionDataStructure=TRANSACTION;

		var attentionTableAry=ATTENTION_TABLE_ARY;
		var isDirectAttention=false;
		var isManager=false;
		var childTableName;
		var childTableId;
		var parentTableName;

		var parentTableId;

		var sourceSTR;
		var pathSTR;

		(function(){
			$.each(attentionTableAry,function(index, el) {
				if(el.getTableId() == TransactionDataStructure.getTableId()){
					isDirectAttention=true;
					isManager=true;
					childTableName=el.getTableName();
					childTableId=el.getTableId();
					sourceSTR=el.getTableName();
					pathSTR=el.getTableName();
				}
			});
			if(!isDirectAttention){
				$.each(attentionTableAry,function(index, el) {
					var result=el.findParentTable(TransactionDataStructure.getTableId());
					if(result != null){
						parentTableName=result.getTableName();
						parentTableId=result.getTableId();
						childTableName=el.getTableName();
						childTableId=el.getTableId();

						sourceSTR=result.getTableName();
						// pathSTR=el.getTableName()+" << "+el.entrance(TransactionDataStructure.getTableId()).getTableName();
						pathSTR=el.getTableName()+" <span class=\"glyphicon glyphicon-arrow-left\"></span> "+el.entrance(TransactionDataStructure.getTableId()).getTableName();
					}
				});
			}
		})();

		TransactionDataStructure.sourceSTR=function(){
			return sourceSTR;
		}

		TransactionDataStructure.pathSTR=function(){
			return pathSTR;
		}

		// TransactionDataStructure.isDirectAttention=function(){
		// 	return isDirectAttention;
		// }

		TransactionDataStructure.isManager=function(){
			return isManager;
		}

		TransactionDataStructure.getChildTableId=function(){
			return childTableId;
		}

		TransactionDataStructure.getChildTableName=function(){
			return childTableName;
		}

		TransactionDataStructure.getParentTableId=function(){
			return parentTableId;
		}

		TransactionDataStructure.getParentTableName=function(){
			return parentTableName;
		}

		return TransactionDataStructure;
	}
}



/**
 * InputController(input,maxLength)
 * 		onChange(CALL_BACK())
 * 		verify()	验证输入框中的内容是否符合长度要求.......，符合返回true，不符合返回false
 * 		setContent()	设置输入框内容
 * 		getContent()	
 * 		getRemainLength()	获取输入框合法输入内容所剩长度
 * 		empty()		清空输入框内容
 */
var InputController={
	creatNew:function(INPUT,MAX_LENGTH){
		var InputController={};

		var input=INPUT;
		var CONTENT_LENGTH_MAX=MAX_LENGTH;
		var CONTENT_LENGTH_MIN=1;
		var e_change=function(){};
		(function(){
			input.bind("input propertychange",function(){
				e_change();
			});
		})();

		InputController.getRemainLength=function(){
			return getRemainLength();
		}

		function getRemainLength(){
			return CONTENT_LENGTH_MAX-getLength();
		}

		InputController.verify=function(){
			return thisVerify();
		}

		function thisVerify(){
			if(CONTENT_LENGTH_MIN<=getLength() && getLength()<=CONTENT_LENGTH_MAX){
				return true;
			}
			else{
				return false;
			}
		}

		function getLength(){
			return Number(getContent().length);
		}

		InputController.getContent=function(){
			return getContent();
		}

		function getContent(){
			return input.val();
		}

		InputController.onChange=function(CALL_BACK){
			e_change=CALL_BACK;
		}

		InputController.setContent=function(CONTENT){
			input.val(CONTENT);
		}

		InputController.empty=function(){
			input.val("");
		}

		return InputController;
	}
}


var TextTranslator={
	creatNew:function(){
		var TextTranslator={};

		TextTranslator.encodeText=function(TEXT){
			TEXT=TextTranslator.encodeAmpersand(TEXT);
			TEXT=TextTranslator.encodeLessThan(TEXT);
			TEXT=TextTranslator.encodeGreaterThan(TEXT);
			TEXT=TextTranslator.encodeQuotation(TEXT);
			TEXT=TextTranslator.encodeSpacing(TEXT);
			TEXT=TextTranslator.encodeEnter(TEXT);
			return TEXT;
		}

		TextTranslator.decodeText=function(TEXT){
			TEXT=TextTranslator.decodeLessThan(TEXT);
			TEXT=TextTranslator.decodeGreaterThan(TEXT);
			TEXT=TextTranslator.decodeQuotation(TEXT);
			TEXT=TextTranslator.decodeQuotation(TEXT);
			TEXT=TextTranslator.decodeSpacing(TEXT);
			TEXT=TextTranslator.decodeEnter(TEXT);
			return TEXT;
		}

		/*
		回车转空格
		 */
		TextTranslator.encodeEnterToSpacing=function(TEXT){
			return TEXT.replace(/<br>/g,"&nbsp");
		}	

		/*
		小于号转译
		 */
		TextTranslator.encodeLessThan=function(TEXT){
			return TEXT.replace(/</g,"&lt;");
		} 

		TextTranslator.decodeLessThan=function(TEXT){
			return TEXT.replace(/&lt;/g,"<");
		}

		/*
		大于号转译
		 */
		TextTranslator.encodeGreaterThan=function(TEXT){
			return TEXT.replace(/>/g,"&gt;");
		}

		TextTranslator.decodeGreaterThan=function(TEXT){
			return TEXT.replace(/&gt;/g,">");
		}

		/*
		&转译
		注意，由于所有的转译后字符串都含有&，所以&转译要注意先后顺序
		 */
		TextTranslator.encodeAmpersand=function(TEXT){
			return TEXT.replace(/&/g,"&amp;");
		}

		TextTranslator.decodeAmpersand=function(TEXT){
			return TEXT.replace(/&amp;/g,"&");
		}

		/*
		双引号转译
		 */
		TextTranslator.encodeQuotation=function(TEXT){
			return TEXT.replace(/\"/g,"&quot;");
		}

		TextTranslator.decodeQuotation=function(TEXT){
			return TEXT.replace(/&quot;/g,"\"");
		}

		/*
		单引号转译
		 */
		TextTranslator.encodeApostrophe=function(TEXT){
			return TEXT.replace(/\'/g,"&apos;");
		}

		/*
		空格转译
		 */
		TextTranslator.encodeSpacing=function(TEXT){
			return TEXT.replace(/  /g," &nbsp");
		}

		TextTranslator.decodeSpacing=function(TEXT){
			return TEXT.replace(/&nbsp;/g," ");
		}

		/*
		回车转译
		 */
		TextTranslator.encodeEnter=function(TEXT){
			return TEXT.replace(/\n/g,"<br>");
		}

		TextTranslator.decodeEnter=function(TEXT){
			return TEXT.replace(/<br>/g,"\n");
		}

		return TextTranslator;
	}
}


minclude("PopoverButton");
minclude("TextTranslator");
minclude("Div");
/**
 *	对transaction的show操作并不会改变它的可见性，
 * 
 * TransactionItem(TransactionDataStructure)
 * 		show()
 * 		hide()
 *
 * 		onClick(CALL_BACK())
 *
 * 		getTransactionId()
 * 		getTransactionTime()
 * 		getTransactionContent()
 * 		getSource()
 * 		getPath()
 */		
var TransactionItem={
	creatNew:function(TRANSACTION_DATA_STRUCTURE){
		var TransactionItem=Div.creatNew();

		var transaction=TRANSACTION_DATA_STRUCTURE;
		var isVisible=true;
		var textTranslator=TextTranslator.creatNew();
		var e_click=function(IS_MANAGER){};
		(function(){
			var btn=PopoverButton.creatNew("hover",popverHtml(),popverTitle(),popverContent());
			btn.onClickListener(function(){
				e_click();
			});
			btn.appendTo(TransactionItem.ui);
			TransactionItem.addClass('clear-fix');
		})();

		function popverHtml(){
			var content="";
			var transactionContent=transaction.getContent();
			var reg=/(.)+/;
			var stringAry=transactionContent.match(reg);
			if(stringAry != null){
				content=stringAry[0];
			}
			return content;
		}

		function popverContent(){
			var time=new Date(transaction.getTime());
			var content="<strong>"+time.getHours()+":"+time.getMinutes()+"</strong>"+"<br/>"+textTranslator.encodeText(transaction.getContent());
			return content;
		}

		function popverTitle(){
			var title=transaction.sourceSTR();
			return title;
		}

		TransactionItem.show=function(){
			showItem();
		}

		function showItem(){
			TransactionItem.removeClass('hide');
		}

		TransactionItem.hide=function(){
			hideItem();
		}

		function hideItem(){
			TransactionItem.addClass("hide");
		}

		TransactionItem.getTransactionId=function(){
			return transaction.getTransactionId();
		}

		TransactionItem.getTransactionTime=function(){
			return transaction.getTime();
		}

		TransactionItem.getTransactionContent=function(){
			return transaction.getContent();
		}

		TransactionItem.getPath=function(){
			return transaction.pathSTR();
		}

		TransactionItem.getSource=function(){
			return transaction.sourceSTR();
		}

		TransactionItem.onClick=function(CALL_BACK){
			e_click=CALL_BACK;
		}

		return TransactionItem;
	}
}


minclude("MDate");
minclude("Div");
minclude("PopoverButton");
minclude("TextTranslator");
/**
 * 
 * TimeSameTransactionItem(array TransactionItem)
 * 		show()	//它会变成可见的，并返回给你一个元素节点
 * 		hide()
 * 		onClick(CALL_BACK())
 * 		getTransactionTime()
 */
var TimeSameTransactionItem={
	creatNew:function(TRANSACTION_ITEM_ARY){
		var TimeSameTransactionItem=Div.creatNew();

		var transactionItemAry=TRANSACTION_ITEM_ARY;
		var mDate;
		var btn=null;
		var e_click=function(){};
		(function(){
			$.each(transactionItemAry,function(index, el) {
				mDate=MDate.creatNew(el.getTransactionTime());
			});

			btn=PopoverButton.creatNew("hover",popverHtml(),"",popverContent());
			btn.appendTo(TimeSameTransactionItem.ui);
			btn.onClickListener(function(){
				e_click();
			});
		})();

		function popverContent(){
			var textTranslator=TextTranslator.creatNew();
			var content="";
			$.each(transactionItemAry,function(index, el) {
				if(index!=0){
					content+="</br>";
				}
				content+="<strong>"+el.getSource()+"</strong></br>";
				if(el.getTransactionContent().length > 100){
					content+=textTranslator.encodeText(el.getTransactionContent()).substring(0,101)+"……";
				}
				else{
					content+=textTranslator.encodeText(el.getTransactionContent());
				}
				content+="</br>";
			});
			return content;
		}

		function popverHtml(){
			return mDate.getHours()+":"+mDate.getMinutes()+"&nbsp&nbsp"+"<span class=badge>"+transactionItemAry.length+"</span>";
		}

		TimeSameTransactionItem.show=function(){
			show();
		}

		function show(){
			TimeSameTransactionItem.removeClass('hide');
		}

		TimeSameTransactionItem.hide=function(){
			hide();
		}

		function hide(){
			TimeSameTransactionItem.addClass('hide');
		}

		TimeSameTransactionItem.onClick=function(CALL_BACK){
			e_click=CALL_BACK;
		}

		TimeSameTransactionItem.getTransactionTime=function(){
			return transactionItemAry[0].getTransactionTime();
		}

		return TimeSameTransactionItem;
	}
}


minclude("Div");

var LoaderPiano={
	creatNew:function(){
		var LoaderPiano=Div.creatNew();

		var div1=Div.creatNew();
		var div2=Div.creatNew();
		var div3=Div.creatNew();

		LoaderPiano.addClass("cssload-piano hide");
		div1.addClass("cssload-rect1");
		div2.addClass("cssload-rect2");
		div3.addClass("cssload-rect3");
		div1.appendTo(LoaderPiano.ui);
		div2.appendTo(LoaderPiano.ui);
		div3.appendTo(LoaderPiano.ui);

		LoaderPiano.hide=function(){
			LoaderPiano.addClass('hide');
		}

		LoaderPiano.show=function(){
			LoaderPiano.removeClass('hide');
		}

		return LoaderPiano;
	}
}

minclude("DateItem");
minclude("Div");
/**
 * 每一个Daylog都有一个DayFlag，是它的唯一标识
 * 
 * 它维护两个池，一个是TransactionItem池，一个是TransacctionItemContainer池，
 * TransactionItem触发onChange的时候，它把TransactionItem从原 TransacctionItemContainer中移除，然后根据其time，看是否已存在time一样
 * 的TransacctionItemContainer，存在则add给它，不存在则创建一个新的TransacctionItemContainer，并add给它
 * 
 * 它持有当天的所有TransactionItem，并相应他们的on……事件
 * 
 * Daylog(DayFlag)
 * 		addTransaction(TransactionItem transactionItem)	//
 * 		getDayFlag()	//获取它的唯一标识
 * 		
 */
var Daylog={
	creatNew:function(DAY_FLAG){
		var Daylog=Div.creatNew();
		
		// var div=Div.creatNew();
		var dateScope=Div.creatNew();
		var transactionScope=Div.creatNew();
		var isVisible=true;
		var dayFlag=Number(DAY_FLAG);
		var dateItem=DateItem.creatNew(dayFlag);
		var transactionItemAry=[];
		(function(){
			dateScope.appendTo(Daylog.ui);
			transactionScope.appendTo(Daylog.ui);
			dateItem.appendTo(dateScope.ui);
		})();

		Daylog.getDayFlag=function(){
			return dayFlag;
		}

		Daylog.addTransaction=function(TRANSACTION_ITEM){
			transactionItemAry.push(TRANSACTION_ITEM);
			sortItem();
			$.each(transactionItemAry,function(index, el) {
				el.hide();
				el.appendTo(transactionScope.ui);
				el.show();
			});
		}

		function sortItem(){
			transactionItemAry.sort(function(valueA,valueB){
				if(valueA.getTransactionTime() <= valueB.getTransactionTime()){
					return -1;
				}
				else{
					return 1;
				}
			});
		}

		return Daylog;
	}
}


var MDate={
	creatNew:function(DATE){
		var MDate=new Date(DATE);

		MDate.getTimeSeconds=function(){
			return secondsTime(MDate);
		}

		//该函数已弃用
		MDate.getTheDayBeginingTimeSeconds=function(){
			return secondsTime(MDate.getTheDayBeginingTime());
		}

		MDate.getTheDayBeginingTime=function(){
			var newDate=new Date(MDate.getTime());
			newDate.setHours(0);
			newDate.setMinutes(0);
			newDate.setSeconds(0);
			newDate.setMilliseconds(0);
			return newDate;
		}

		MDate.getChineseDay=function(){
			return turnToChineseDay(MDate.getDay());
		}

		MDate.getDayFlag=function(){
			return MDate.getTheDayBeginingTime().getTime();
		}

		function secondsTime(D){
			return Math.floor(D.getTime()/1000);
		}

		function turnToChineseDay(DAY){
			switch(DAY){
				case 1:
					return "星期一";

				case 2:
					return "星期二";

				case 3:
					return "星期三";

				case 4:
					return "星期四";

				case 5:
					return "星期五";

				case 6:
					return "星期六";

				case 0:
					return "星期天";
			}
		}

		return MDate;
	}
}


minclude("Ui");

var Div={
	creatNew:function(){
		var Div=Ui.creatNew($("<div></div>"));

		return Div;
	}	
}


minclude("MDate");
minclude("Div");
minclude("Button");
// minclude("CreateTransactionModal");
/**
 * 有两种显示模式，一种是显示年月日，一种是星期和日期
 * 它会根据日期自动调整自己的样式（也就是显示"今天"）
 * 
 * DateItem(dayFlag)
 * 		changeUiToYMD()
 * 		changeUiToDD()
 */
var DateItem={
	creatNew:function(DAY_FLAG){
		var DateItem=Div.creatNew();

		var dayFlag=DAY_FLAG;
		var theMDate=MDate.creatNew(DAY_FLAG);
		var dateBtn=Button.creatNew();
		(function(){
			initDateBtn();
		})();

		function initDateBtn(){
			dateBtn.addClass("btn text-center col-xs-12 ");
			dateBtn.appendTo(DateItem.ui);
			if(isToday()){
				dateBtn.addClass("btn-primary");
			}
			else{
				dateBtn.addClass("btn-activity-main-dateBtn");
			}
			changeUiToYMD();
		}

		function isToday(){
			var todayFlag=MDate.creatNew(new Date()).getDayFlag();
			return dayFlag == todayFlag;
		}

		DateItem.changeUiToDD=function(){
			changeUiToDD();
		}

		function changeUiToDD(){
			dateBtn.html(theMDate.getChineseDay()+"&nbsp;&nbsp;&nbsp;"+theMDate.getDate());
		}

		DateItem.changeUiToYMD=function(){
			changeUiToYMD();
		}

		function changeUiToYMD(){
			dateBtn.html(theMDate.getFullYear()+"-"+(theMDate.getMonth()+1)+"-"+theMDate.getDate()+"&nbsp;&nbsp;&nbsp;&nbsp;"+getChineseDay(theMDate.getDay()));
		}

		function getChineseDay(NUM){
			switch(NUM){
				case 1:
					return "一";
				case 2:
					return "二";
				case 3:
					return "三";
				case 4:
					return "四";
				case 5:
					return "五";
				case 6:
					return "六";
				case 0:
					return "日";
			}
		}

		return DateItem;
	}
}


minclude("Ui");

var Button={
	creatNew:function(){
		var Button=Ui.creatNew($("<button></button>"));

		Button.onClickListener=function(CALL_BACK){
			Button.ui.bind("click",function(ev){
				CALL_BACK($(this),ev);
			});
		}

		return Button;
	}
}













var Ui={
	creatNew:function(UI){
		var Ui={};

		Ui.ui=UI;

		Ui.addClass=function(PROP){
			Ui.ui.addClass(PROP);
		}

		Ui.removeClass=function(PROP){
			Ui.ui.removeClass(PROP);
		}

		Ui.html=function(HTML){
			Ui.ui.html(HTML);
		}
		
		Ui.addHtml=function(HTML){
			var html=Ui.ui.html();
			Ui.ui.html(html+HTML)
		}

		Ui.appendTo=function(SCOPE){
			Ui.ui.appendTo(SCOPE);
		}

		Ui.remove=function(){
			Ui.ui.remove();
		}

		Ui.setAttribute=function(NAME,VALUE){
			Ui.ui.attr(NAME,VALUE);
		}
		
		Ui.getAttribute=function(NAME){
			return Ui.ui.attr(NAME);
		}

		Ui.one=function(ACTION,CALL_BACK){
			Ui.ui.one(ACTION,CALL_BACK);
		}
		
		Ui.hide=function(){
			Ui.ui.hide();
		}

		return Ui;
	}	
}


minclude("Button");

/**
 * 这个按钮可以显示弹出框
 *
 * 它接收触发器选择，参数内容和bootstrap所要求的一致
 * 接收标题（title）
 * 接收内容（content）
 * 
 * PopoverButton(trigger,html,title,content)
 * 		changeTitle(title)
 * 		changeContent(content)
 * 		changeHtml(html)
 * 		changePosition(Position)	//指的是popver弹出的位置，上下左右
 * 		showPopover()
 * 		hidePopover()
 * 		destroyPopover()
 */

var PopoverButton={
	creatNew:function(TRIGGER,HTML,TITLE,CONTENT){
		var PopoverButton=Button.creatNew();

		(function(){
			PopoverButton.addClass("btn btn-default text-center col-xs-12");
			PopoverButton.setAttribute("style","text-overflow:ellipsis;overflow:hidden");
			PopoverButton.setAttribute("data-toggle","popover");
			PopoverButton.setAttribute("data-container","body");
			PopoverButton.html(HTML);
			PopoverButton.setAttribute("data-trigger",TRIGGER);
			PopoverButton.setAttribute("data-original-title",TITLE);
			PopoverButton.setAttribute("data-content",CONTENT);
			PopoverButton.setAttribute("data-html","true");
			PopoverButton.ui.popover();
		})();

		PopoverButton.changeHtml=function(Html){
			PopoverButton.html(Html);
		}

		PopoverButton.changeTitle=function(Title){
			PopoverButton.setAttribute("data-original-title",Title);
		}

		PopoverButton.changeContent=function(CONTENT){
			PopoverButton.setAttribute("data-content",CONTENT);
		}

		PopoverButton.changePosition=function(Position){
			PopoverButton.setAttribute("data-placement",Position);
		}

		PopoverButton.destroyPopover=function(){
			destroyPop();
		}

		function destroyPop(){
			PopoverButton.ui.popover('destroy');
		}

		PopoverButton.hidePopover=function(){
			hidePop();
		}

		function hidePop(){
			PopoverButton.ui.popover('hide');
		}

		PopoverButton.showPopover=function(){
			showPop();
		}

		function showPop(){
			PopoverButton.ui.popover('show');
		}

		return PopoverButton;
	}
}



























