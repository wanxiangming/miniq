
var LogTable={
	creatNew:function(){
		var LogTable={};
		
		var logTableUserId;
		var logTableId;
		var logTableName;
		var logTableAnotherName;
		var logTableCreatorId;
		var logTableState;
		var logTableVisibilityState;

		LogTable.setLogTableUserId=function(LOG_TABLE_USER_ID){
			logTableUserId=LOG_TABLE_USER_ID;
		}

		LogTable.getLogTableUserId=function(){
			return logTableUserId;
		}

		LogTable.setLogTableId=function(LOG_TABLE_ID){
			logTableId=LOG_TABLE_ID;
		}

		LogTable.getLogTableId=function(){
			return Number(logTableId);
		}

		LogTable.setLogTableName=function(LOG_TABLE_NAME){
			logTableName=LOG_TABLE_NAME;
		}

		LogTable.getLogTableName=function(){
			return logTableName;
		}

		LogTable.setLogTableAnotherName=function(LOG_TABLE_ANOTHER_NAME){
			logTableAnotherName=LOG_TABLE_ANOTHER_NAME;
		}

		LogTable.getLogTableAnotherName=function(){
			return logTableAnotherName;
		}

		LogTable.setLogTableCreatorId=function(LOG_TABLE_CREATOR_ID){
			logTableCreatorId=LOG_TABLE_CREATOR_ID;
		}

		LogTable.getLogTableCreatorId=function(){
			return logTableCreatorId;
		}

		LogTable.setLogTableState=function(LOG_TABLE_STATE){
			logTableState=LOG_TABLE_STATE;
		}

		LogTable.getLogTableState=function(){
			return Number(logTableState);
		}

		LogTable.setLogTableVisibilityState=function(LOG_TABLE_VISIBILITY_STATE){
			logTableVisibilityState=LOG_TABLE_VISIBILITY_STATE
		}

		LogTable.getLogTableVisibilityState=function(){
			return Number(logTableVisibilityState);
		}

		LogTable.isMaster=function(){
			return logTableUserId==logTableCreatorId;
		}

		LogTable.isPublicTable=function(){
			return logTableVisibilityState==1;
		}


		return LogTable;
	}
}

var LogTransaction={
	creatNew:function(){
		var LogTransaction=LogTable.creatNew();

		var logTransactionContent;
		var logTransactionTime;
		var logTransactionId;

		LogTransaction.setLogTransactionId=function(LOG_TRANSACTION_ID){
			logTransactionId=LOG_TRANSACTION_ID;
		}

		LogTransaction.getLogTransactionId=function(){
			return Number(logTransactionId);
		}

		LogTransaction.setLogTransactionContent=function(LOG_TRANSACTION_CONTENT){
			logTransactionContent=LOG_TRANSACTION_CONTENT;
		}

		LogTransaction.getLogTransactionContent=function(){
			return logTransactionContent;
		}

		LogTransaction.setLogTransactionTime=function(LOG_TRANSACTION_TIME){
			logTransactionTime=LOG_TRANSACTION_TIME;
		}

		LogTransaction.getLogTransactionTime=function(){
			return Number(logTransactionTime);
		}

		return LogTransaction;
	}
}



























