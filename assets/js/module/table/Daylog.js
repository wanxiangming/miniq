document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/DateItem.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/TransactionItem.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/TransactionItemContainer.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
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
 * 		show()	//show和hide并不会影响它的可见性，如果它是不可见的，那么你调用show方法它也不会出现
 * 		hide()
 *
 * 		addTransaction(TransactionDataStructure)	//
 * 		getDayFlag()	//获取它的唯一标识
 * 		
 * 		setVisible(boolean)	//设置其可见性
 * 		isVisible()			//你可以通过这个函数获取到它的可见性
 * 		isUiEmpty()			//用来判断目前该daylog的transaction列表“看起来”是否是空的，也就是说进过filt后它没有东西可以显示，那么也会判定为是empty
 * 		
 * 		filtByContent(string)			//你可以告诉它只显示content包含某个字符串的transaction
 * 		filtByTableId(tableId)			//只显示指定日程的transaction
 * 		filtByTableAnotherName(tableAnotherName)	//只显示指定日程的transaction
 * 		clearFilt()						//移除filt限制
 * 		
 * 		onCreate(CALL_BACK(tableId,content,time))		//当用户创建transaction的时候，你可以做一些事情，返回Deferred对象，包含TransacitonDataStructure对象
 * 		onDelete(CALL_BACK(transactionId))				//当用户删除transaction的时候，你可以做一些事情，返回Deferred对象
 * 		onChange(CALL_BACK(transactionId,content,time))	//当用户修改transaction的时候，你可以做一些事情，返回Deferred对象
 */
var Daylog={
	creatNew:function(DAY_FLAG){
		var Daylog={};
		
		var div=Div.creatNew();
		var dateScope=Div.creatNew();
		var transactionScope=Div.creatNew();
		var isVisible=true;
		var dayFlag=Number(DAY_FLAG);
		var dateItem=DateItem.creatNew(dayFlag);
		var transactionItemContainerAry=[];
		var transactionItemAry=[];
		var e_createTransaction=function(tableId,content,time){return $.Deferred();};	
		var e_deleteTransaction=function(transactionId){return $.Deferred();};
		var e_changeTransaction=function(transactionId,content,time){return $.Deferred();};
		(function(){
			dateScope.appendTo(div.ui);
			transactionScope.appendTo(div.ui);
			dateItem.onCreate(function(TABLE_ID,CONTENT,TIME){
				var def=e_createTransaction(TABLE_ID,CONTENT,TIME);
				def.done(function(TRANSACTION_DATA_STRUCTURE){
					addTransaction(TRANSACTION_DATA_STRUCTURE);
				});
				return def;
			});
			dateItem.show().appendTo(dateScope.ui);
		})();

		Daylog.setVisible=function(BOOLEAN){
			isVisible=BOOLEAN;
			if(!isVisible){
				hide();
			}
		}

		Daylog.isVisible=function(){
			return isVisible;
		}

		Daylog.isUiEmpty=function(){
			var isUiEmpty=true;
			$.each(transactionItemAry,function(index, el) {
				if(el.isVisible()){
					isUiEmpty=false;
				}
			});
			return isUiEmpty;
		}

		Daylog.show=function(){
			if(isVisible){
				show();
			}
			return div.ui;
		}

		function show(){
			div.removeClass('hide');
		}

		Daylog.hide=function(){
			hide();
		}	

		function hide(){
			div.addClass('hide');
		}

		Daylog.getDayFlag=function(){
			return dayFlag;
		}

		Daylog.addTransaction=function(TRANSACTION_DATA_STRUCTURE){
			addTransaction(TRANSACTION_DATA_STRUCTURE);
		}

		function addTransaction(TRANSACTION_DATA_STRUCTURE){
			var transactionItem=TransactionItem.creatNew(TRANSACTION_DATA_STRUCTURE);
			transactionItem.onChange(function(CONTENT,TIME){
				var def=e_changeTransaction(transactionItem.getTransactionId(),CONTENT,TIME);
				def.done(function(){
					if(TIME != transactionItem.getTransactionTime()){
						transactionItem.hide();
						removeItemFromContainer(transactionItem.getTransactionId());
						addItemToContainer(transactionItem,TIME);
					}
					else{
						setTimeout(function(){
							refreshContainerUI();
						},200);
					}
				});
				return def;
			});
			transactionItem.onDelete(function(){
				var def=e_deleteTransaction(transactionItem.getTransactionId());
				def.done(function(){
					transactionItem.setVisible(false);
					removeItemFromContainer(transactionItem.getTransactionId());
					removeItemFromTransactionAry(transactionItem.getTransactionId());
				});
				return def;
			});
			transactionItemAry.push(transactionItem);
			addItemToContainer(transactionItem,transactionItem.getTransactionTime());
		}

		function removeItemFromTransactionAry(ID){
			transactionItemAry=$.grep(transactionItemAry,function(value,index){
				if(value.getTransactionId()==ID){
					return false;
				}
				else{
					return true;
				}
			});
		}

		function removeItemFromContainer(TRANSACTION_ID){
			$.each(transactionItemContainerAry,function(index, el) {
				el.removeTransactionItem(TRANSACTION_ID);
			});
		}

		function refreshContainerUI(){
			$.each(transactionItemContainerAry,function(index, el) {
				el.refreshUI();
			});
		}

		//这个函数有待优化
		function addItemToContainer(TRANSACTION_ITEM,TIME){
			var isExist=false;
			$.each(transactionItemContainerAry,function(index, el) {
				if(el.getTime() == TIME){
					el.addTransactionItem(TRANSACTION_ITEM);
					isExist=true;
				}
			});
			if(!isExist){
				var transactionItemContainer=TransactionItemContainer.creatNew(TIME);
				transactionItemContainer.addTransactionItem(TRANSACTION_ITEM);
				transactionItemContainerAry.push(transactionItemContainer);
				sortContainer();
				$.each(transactionItemContainerAry,function(index, el) {
					el.show().appendTo(transactionScope.ui);
				});
			}
		}

		function sortContainer(){
			transactionItemContainerAry.sort(function(valueA,valueB){
				if(valueA.getTime() <= valueB.getTime()){
					return -1;
				}
				else{
					return 1;
				}
			});
		}

		function isTransactionItemContainerExist(TIME){
			var isExist=false;
			$.each(transactionItemContainerAry,function(index, el) {
				if(el.getTime() == TIME){
					isExist=true;
				}
			});
			return isExist;
		}

		Daylog.onCreate=function(CALL_BACK){
			e_createTransaction=CALL_BACK;
		}

		Daylog.onDelete=function(CALL_BACK){
			e_deleteTransaction=CALL_BACK;
		}

		Daylog.onChange=function(CALL_BACK){
			e_changeTransaction=CALL_BACK;
		}

		Daylog.filtByContent=function(CONTENT){
			$.each(transactionItemAry,function(index, el) {
				if(el.getTransactionContent().indexOf(CONTENT) > 0){
					el.setVisible(true);
					el.show();
				}
			});
		}

		Daylog.filtByTableId=function(TABLE_ID_ARY){

		}

		Daylog.filtByTableName=function(){

		}

		Daylog.clearFilt=function(){

		}


		return Daylog;
	}
}

