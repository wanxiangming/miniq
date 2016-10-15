document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/TimeSameTransactionItem.js"+'">' + '</script>');
/**
 *	它会根据自己所持有的transactionItem的可见性来改变自己的样子（也就是在transactionItem和timeSameTransaction之间切换，甚至在所有Item不可见的情况下隐藏自己）
 * 
 * TransactionItemContainer(time)
 * 		show()	//它会变成可见的，并返回给你一个元素节点
 * 		hide()
 * 		getTime()
 * 		addTransactionItem(TransactionItem)
 * 		removeTransactionItem(transactionId)
 */
var TransactionItemContainer={
	creatNew:function(TIME){
		var TransactionItemContainer={};

		var div=Div.creatNew();
		var transactionItemAry=[];
		var time=TIME;
		var timeSameTransactionItem=TimeSameTransactionItem.creatNew(time);

		(function(){
			timeSameTransactionItem.show().appendTo(div.ui);
		})();

		TransactionItemContainer.show=function(){
			show();
			return div.ui;
		}

		function show(){
			div.removeClass('hide');
		}

		TransactionItemContainer.hide=function(){
			hide();
		}

		function hide(){
			div.addClass('hide');
		}

		TransactionItemContainer.getTime=function(){
			return time;
		}

		TransactionItemContainer.addTransactionItem=function(TRANSACTION_ITEM){
			timeSameTransactionItem.addItem(TRANSACTION_ITEM);
			transactionItemAry.push(TRANSACTION_ITEM);
			if(transactionItemAry.length == 1){
				transactionItemAry[0].show().appendTo(div.ui);
			}
			if(transactionItemAry.length > 1){
				transactionItemAry[0].hide();
			}
		}

		TransactionItemContainer.removeTransactionItem=function(TRANSACTION_ITEM_ID){
			timeSameTransactionItem.removeItem(TRANSACTION_ITEM_ID);
			transactionItemAry=$.grep(transactionItemAry,function(value,index){
				if(value.getTransactionId() == TRANSACTION_ITEM_ID){
					value.hide();
					return false;
				}
				else{
					return true;
				}
			});
			if(transactionItemAry.length == 1){
				transactionItemAry[0].show().appendTo(div.ui);
			}
		}

		TransactionItemContainer.refreshUI=function(){
			timeSameTransactionItem.refreshUI();
		}


		return TransactionItemContainer;
	}
}
