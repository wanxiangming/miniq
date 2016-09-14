

var Internet={
	creatNew:function(URL,TYPE,DATA){
		var Internet={};

		var internetDataType="json";
		var internetAsync=true;
		var internetType=TYPE.toUpperCase();
		var internetData=internetType=="GET" ? DATA : JSON.stringify(DATA);
		var internetUrl=URL;
		var successCallBackFunction=function(data){return false};
		var errorCallBackFunction=function(XMLHttpRequest, textStatus, errorThrown){return false};

		Internet.launch=function(){
			$.ajax({
				url:internetUrl,
				dataType:internetDataType,
				async:internetAsync,
				data:internetData,
				type:internetType,
				
				success:function(data){
					successCallBackFunction(data);
				},

				error:function(XMLHttpRequest, textStatus, errorThrown){
					errorCallBackFunction(XMLHttpRequest,textStatus,errorThrown);
				}
			});
		}

		Internet.onSuccessLisenter=function(CALL_BACK_SUCCESS){
			successCallBackFunction=CALL_BACK_SUCCESS;
		}

		Internet.onErrorLisenter=function(CALL_BACK_SUCCESS){
			errorCallBackFunction=CALL_BACK_SUCCESS;
		}

		return Internet;
	}
}

var LoginCheck={
	creatNew:function(OPEN_ID){
		var LoginCheck=Internet.creatNew(LOGIN_CHECK,"GET",{"openId":OPEN_ID});
		return LoginCheck;
	}
}

var SetCookie={
	creatNew:function(OPEN_ID){
		var SetCookie=Internet.creatNew(SET_COOKIE,"GET",{"openId":OPEN_ID});
		return SetCookie;
	}
}

var DelCookie={
	creatNew:function(OPEN_ID){
		var DelCookie=Internet.creatNew(DEL_COOKIE,"GET",{});
		return DelCookie;
	}
}

var CheckCookie={
	creatNew:function(){
		var CheckCookie=Internet.creatNew(CHECK_COOKIE,"GET",{});
		return CheckCookie;
	}
}

var ChangeNickName={
	creatNew:function(OPEN_ID,NICK_NAME){
		var ChangeNickName=Internet.creatNew(CHANGE_NICK_NAME,"POST",{"openId":OPEN_ID,"nickName":NICK_NAME});
		return ChangeNickName;
	}
}

var GetLogTableList={
	creatNew:function(){
		var GetLogTableList=Internet.creatNew(GET_LOG_TABLE_LIST,"GET",{});
		return GetLogTableList;
	}
}

var GetTransactionByTimeAry={
	creatNew:function(TIMEARY){
		var GetTransactionByTimeAry=Internet.creatNew(GET_TRANSACTION_BY_TIMEARY,"POST",{"time":TIMEARY});
		return GetTransactionByTimeAry;
	}
}

var CreateLogTransaction={
	creatNew:function(TABLE_ID,TIME,CONTENT){
		var CreateLogTransaction=Internet.creatNew(CREATE_LOG_TRANSACTION,"POST",{"tableId":TABLE_ID,"time":TIME,"content":CONTENT});
		return CreateLogTransaction;
	}
}

var ChangeLogTransaction={
	creatNew:function(LOG_TRANSACTION_ID,TIME,CONTENT){
		var ChangeLogTransaction=Internet.creatNew(CHANGE_LOG_TRANSACTION,"POST",{"transactionId":LOG_TRANSACTION_ID,"time":TIME,"content":CONTENT});
		return ChangeLogTransaction;
	}
}

var DeleteLogTransaction={
	creatNew:function(LOG_TRANSACTION_ID){
		var DeleteLogTransaction=Internet.creatNew(DELETE_LOG_TRANSACTION,"GET",{"logTransactionId":LOG_TRANSACTION_ID});
		return DeleteLogTransaction;
	}
}

var SearchTableByTableId={
	creatNew:function(TABLE_ID){
		var SearchTableByTableId=Internet.creatNew(SEARCH_TABLE_BY_TABLE_ID,"GET",{"tableId":TABLE_ID});
		return SearchTableByTableId;
	}
}

var ChangeTableAnotherName={
	creatNew:function(TABLE_ID,NICK_NAME){
		var ChangeTableAnotherName=Internet.creatNew(CHANGE_TABLE_ANOTHER_NAME,"POST",{"tableId":TABLE_ID,"nickName":NICK_NAME});
		return ChangeTableAnotherName;
	}
}

var CreateLogTable={
	creatNew:function(LOG_TABLE_NAME){
		var CreateLogTable=Internet.creatNew(CREATE_LOG_TABLE,"POST",{"logTableName":LOG_TABLE_NAME});
		return CreateLogTable;
	}
}

var ChangeTableName={
	creatNew:function(TABLE_ID,NICK_NAME){
		var ChangeTableName=Internet.creatNew(CHANGE_TABLE_NAME,"POST",{"tableId":TABLE_ID,"nickName":NICK_NAME});
		return ChangeTableName;
	}
}

var DeprecatedTable={
	creatNew:function(TABLE_ID){
		var DeprecatedTable=Internet.creatNew(DEPRECATED_TABLE,"GET",{"tableId":TABLE_ID});
		return DeprecatedTable;
	}
}

var CancelAttention={
	creatNew:function(TABLE_ID){
		var CancelAttention=Internet.creatNew(CANCEL_ATTENTION,"GET",{"tableId":TABLE_ID});
		return CancelAttention;
	}
}

var PayAttentionToLogTable={
	creatNew:function(TABLE_ID){
		var PayAttentionToLogTable=Internet.creatNew(PAY_ATTENTION_TO_TABLE,"GET",{"tableId":TABLE_ID});
		return PayAttentionToLogTable;
	}
}

var OpenTheTable={
	creatNew:function(TABLE_ID){
		var OpenTheTable=Internet.creatNew(OPEN_THE_TABLE,"GET",{"tableId":TABLE_ID});
		return OpenTheTable;
	}
}

//---------------------------------------------------与待办事项相关--------------------------------------------------------
var AddMainLine={
	creatNew:function(CONTENT){
		var AddMainLine=Internet.creatNew(ADD_MAIN_LINE,"POST",{"content":CONTENT});
		return AddMainLine;
	}
}

var GetInfoInUseMainLineAndUncompletedBacklog={
	creatNew:function(){
		var GetInfoInUseMainLineAndUncompletedBacklog=Internet.creatNew(GET_INFO_IN_USE_MAIN_LINE_AND_UNCOMPLETED_BACKLOG,"GET",{});
		return GetInfoInUseMainLineAndUncompletedBacklog;
	}
}

var AddBacklog={
	creatNew:function(IN_USE_MIAN_LINE_ID,CONTENT,IS_MIAN_LINE,IS_RECENT){
		var AddBacklog=Internet.creatNew(ADD_BACKLOG,"POST",{"inUseMainLineId":IN_USE_MIAN_LINE_ID,"content":CONTENT,"isMainLine":IS_MIAN_LINE,"isRecent":IS_RECENT});
		return AddBacklog;
	}
}

var RemoveBacklog={
	creatNew:function(BACKLOG_ID){
		var RemoveBacklog=Internet.creatNew(REMOVE_BACKLOG,"GET",{"backlogId":BACKLOG_ID});
		return RemoveBacklog;
	}
}

var ChangeBacklog={
	creatNew:function(IN_USE_MIAN_LINE_ID,BACKLOG_ID,CONTENT,IS_MIAN_LINE,IS_RECENT){
		var ChangeBacklog=Internet.creatNew(CHANGE_BACKLOG,"POST",{"inUseMainLineId":IN_USE_MIAN_LINE_ID,"backlogId":BACKLOG_ID,"content":CONTENT,"isMainLine":IS_MIAN_LINE,"isRecent":IS_RECENT});
		return ChangeBacklog;
	}
}

var CompleteBacklog={
	creatNew:function(BACKLOG_ID){
		var CompleteBacklog=Internet.creatNew(COMPLETE_BACKLOG,"GET",{"backlogId":BACKLOG_ID});
		return CompleteBacklog;
	}
}







var GetLogTableAryByInternet={
	creatNew:function(){
		var GetLogTableAryByInternet={};

		var getLogTableList=GetLogTableList.creatNew();
		

		GetLogTableAryByInternet.launch=function(HAS_TABLE_CALL_BACK,NO_TABLE_CALL_BACK){
			getLogTableList.onSuccessLisenter(function(data){
				if(data == 0){
					NO_TABLE_CALL_BACK();
				}
				else{
					var logTableAry=[];
					$.each(data,function(index,item){
						var logTable=LogTable.creatNew();
						logTable.setLogTableUserId(item.userId);
						logTable.setLogTableId(item.tableId);
						logTable.setLogTableAnotherName(item.anotherName);
						logTable.setLogTableCreatorId(item.creatorId);
						logTable.setLogTableState(item.tableState);
						logTable.setLogTableVisibilityState(item.visibilityState);
						logTableAry.push(logTable);
					});
					HAS_TABLE_CALL_BACK(logTableAry);
				}
			});
			getLogTableList.launch();
		}
		

		return GetLogTableAryByInternet;
	}
}
























