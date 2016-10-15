
/**
 * GetTableInfoNET(TableId)
 * 		launch()
 * 		onSuccess(CALL_BACK(TableInfoDataStructure))	//当请求成功的时候，回调函数接收TableInfoDataStructure对象
 * 		onError(CALL_BACK(ErrorCode))	//出错时返回错误码，1表示网络问题，2表示该表不存在
 */


var GetTableInfoNET={
	creatNew:function(TABLE_ID){
		var GetTableInfoNET={};

		var e_success=function(TABLE_INFO_DATA_STRUCTURE){};
		var e_error=function(){};
		var getTableInfo=GetTableInfo.creatNew(TABLE_ID);
		(function(){
			getTableInfo.onSuccessLisenter(function(DATA){
				if(DATA == 0){
					e_error(2);
				}
				else{
					isCreator=changeNumToBoolean(DATA.isCreator);
					isPublic=changeNumToBoolean(DATA.isPublic);
					isAttention=changeNumToBoolean(DATA.isAttention);
					var tableInfoDataStructure=TableInfoDataStructure.creatNew(isCreator,isPublic,isAttention);
					tableInfoDataStructure.setTableId(DATA.tableId);
					tableInfoDataStructure.setTableName(DATA.tableName);
					$.each(DATA.parentTableAry,function(index, el) {
						var table=Table.creatNew();
						table.setTableId(el.tableId);
						table.setTableName(el.tableName);
						tableInfoDataStructure.addParentTable(table);
					});
					$.each(DATA.childTableAry,function(index, el) {
						var table=Table.creatNew();
						table.setTableId(el.tableId);
						table.setTableName(el.tableName);
						tableInfoDataStructure.addChildTable(table);
					});
					e_success(tableInfoDataStructure);
				}
			});
			getTableInfo.onErrorLisenter(function(){
				e_error(1);
			})
		})();

		function changeNumToBoolean(NUM){
			return NUM == 1 ? true:false;
		}

		GetTableInfoNET.launch=function(){
			getTableInfo.launch();
		}

		GetTableInfoNET.onSuccess=function(CALL_BACK){
			e_success=CALL_BACK;
		}

		GetTableInfoNET.onError=function(CALL_BACK){
			e_error=CALL_BACK;
		}
		
		return GetTableInfoNET;
	}
}
