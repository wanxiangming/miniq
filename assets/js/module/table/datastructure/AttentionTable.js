document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/datastructure/Table.js"+'">' + '</script>');
/**
 *	parentTableAry
 *	isManager 	//这个数据在服务器上判断，我们仅告诉服务器我们的openId，服务器去查询link表，然后用是否是管理员，是否是该表创建者来决定isManager字段
 *	tableAnotherName
 * 
 * AttentionTable()
 * 		setIsManager(boolean)
 * 		isManager()
 *
 * 		setParentTableAry(Table_Ary)
 * 		findParentTable(tableId)	//有则返回Table对象，没有返回null
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

		AttentionTable.setIsManager=function(BOOLEAN){
			isManager=BOOLEAN;
		}

		AttentionTable.isManager=function(){
			return isManager;
		}

		AttentionTable.setParentTableAry=function(PARENT_TABLE_ARY){
			parentTableAry=PARENT_TABLE_ARY;
		}

		AttentionTable.findParentTable=function(TABLE_ID){
			var table=null;
			$.each(parentTableAry,function(index, el) {
				if(el.getTableId() == TABLE_ID){
					table=el;
				}
			});
			return table;
		}

		return AttentionTable;
	}
}
