


/**
 * TimeSameTransactionModal()
 * 		bindModal(Button)
 * 		initBeforeShow(TransactionItemAry)	//接收TransactionItem对象数组
 * 		show()
 * 		hide()
 */

var TimeSameTransactionModal={
	creatNew:function(){
		var TimeSameTransactionModal={};

		var modal=$("#time_same_transaction_modal");
		var scope=$("#time_same_transaction_scope");

		TimeSameTransactionModal.initBeforeShow=function(TRANSACTION_ITEM_ARY){
			var arae=Div.creatNew();
			arae.addClass('col-xs-offset-1 col-xs-10');
			arae.appendTo(scope);
			$.each(TRANSACTION_ITEM_ARY,function(index, el) {
				var div1=Div.creatNew();
				div1.setAttribute("style","height:10px");
				div1.appendTo(arae.ui);
				el.show().appendTo(arae.ui);
				var div2=Div.creatNew();
				div2.setAttribute("style","height:10px");
				div2.appendTo(arae.ui);
			});
			modal.on("hidden.bs.modal",function(){
				arae.addClass('hide');
			});
		}

		TimeSameTransactionModal.bindModal=function(BUTTON){
			BUTTON.attr("data-toggle","modal");
			BUTTON.attr("data-target","#time_same_transaction_modal");
		}

		TimeSameTransactionModal.show=function(){
			modal.modal('show');
		}

		TimeSameTransactionModal.hide=function(){
			modal.modal('hide');
		}

		return TimeSameTransactionModal;
	}
}