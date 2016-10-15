document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/TextTranslator.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/modal/ChangeTransactionModal.js"+'">' + '</script>');
/**
 *	对transaction的show操作并不会改变它的可见性，
 * 
 * TransactionItem(TransactionDataStructure)
 * 		show()
 * 		hide()
 *
 * 		getTransactionId()
 * 		getTransactionTime()
 * 		getTransactionContent()
 * 		getTransactionTableId()
 * 		
 * 		isDirectAttention()
 * 		getChildTableName()
 * 		getChildTableId()
 * 		getParentTableName()
 * 		getParentTableId()
 * 		
 * 		setVisible(boolean)	//告诉它，它是否应该可见
 * 		isVisible()			//你可以通过这个方法得知它的可见性
 * 		
 * 		onChange(CALL_BACK(Content,Time))	//当transaction变化时，你可以做一些事情，返回Deferred对象
 * 		onDelete(CALL_BACK())					//当transaction被删除时，你可以做一些事情，返回Deferred对象
 */		
 
var TransactionItem={
	creatNew:function(TRANSACTION_DATA_STRUCTURE){
		var TransactionItem={};

		var transaction=TRANSACTION_DATA_STRUCTURE;
		var isVisible=true;
		var textTranslator=TextTranslator.creatNew();
		var div=Div.creatNew();
		var btn=null;
		var e_change=function(content,time){return $.Deferred();};
		var e_delete=function(){return $.Deferred();};
		(function(){
			btn=PopoverButton.creatNew("hover",transaction.getContent(),popverTitle(),popverContent());
			btn.appendTo(div.ui);
			div.addClass('clear-fix');

			if(transaction.isManager()){
				var changeTransactionModal=ChangeTransactionModal.creatNew();
				changeTransactionModal.onChange(function(CONTENT,TIME){
					var def=e_change(CONTENT,TIME);
					def.done(function(){
						transaction.setContent(CONTENT);
						transaction.setTime(TIME);
						changeTransactionModal.hide();
						btn.changeHtml(CONTENT);
						btn.changeContent(popverContent());
					});
					return def;
				});
				changeTransactionModal.onDelete(function(){
					var def=e_delete();
					def.done(function(){
						changeTransactionModal.hide();
					});
					return def;
				});
				changeTransactionModal.bindModal(btn.ui);
				btn.onClickListener(function(){
					changeTransactionModal.onModalShow(transaction.getTime(),transaction.getContent(),transaction.getChildTableName());
				});
			}
			else{
				btn.onClickListener(function(){
					btn.addClass("wobble animated");
				});
				btn.ui.on("animationend",function(){
					btn.removeClass("wobble animated");
				});
			}
		})();

		function popverContent(){
			var time=new Date(transaction.getTime());
			var content="<strong>"+time.getHours()+":"+time.getMinutes()+"</strong>"+"<br/>"+textTranslator.encodeText(transaction.getContent());
			return content;
		}

		function popverTitle(){
			var title="";
			if(transaction.isDirectAttention()){
				title="<strong>"+transaction.getChildTableName()+"</strong>";
			}
			else{
				title="<strong>"+transaction.getChildTableName()+" << "+transaction.getParentTableName()+"</strong>";
			}
			return title;
		}

		TransactionItem.onChange=function(CALL_BACK){
			e_change=CALL_BACK;
		}

		TransactionItem.onDelete=function(CALL_BACK){
			e_delete=CALL_BACK;
		}

		TransactionItem.setVisible=function(BOOLEAN){
			isVisible=BOOLEAN;
			if(!isVisible){
				hideItem();
			}
		}

		TransactionItem.isVisible=function(){
			return isVisible;
		}

		TransactionItem.show=function(){
			if(isVisible){
				showItem();
			}
			return div.ui;
		}

		function showItem(){
			div.removeClass('hide');
		}

		TransactionItem.hide=function(){
			hideItem();
		}

		function hideItem(){
			div.addClass("hide");
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

		TransactionItem.getTransactionTableId=function(){
			return transaction.getTableId();
		}

		TransactionItem.isDirectAttention=function(){
			return transaction.isDirectAttention();
		}

		TransactionItem.getChildTableId=function(){
			return transaction.getChildTableId();
		}

		TransactionItem.getChildTableName=function(){
			return transaction.getChildTableName();
		}

		TransactionItem.getParentTableId=function(){
			return transaction.getParentTableId();
		}

		TransactionItem.getParentTableName=function(){
			return transaction.getParentTableName();
		}

		return TransactionItem;
	}
}
