
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

