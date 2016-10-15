
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

		Transaction.setTime=function(TIME){
			time=Number(TIME);
		}

		Transaction.getTime=function(){
			return time;
		}

		return Transaction;
	}
}
