document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/datastructure/Table.js"+'">' + '</script>');

/**
 *	tableId
 *	tableName
 *	isCreator
 *	isPublic
 *	isAttention
 *
 * 	parentTableAry
 * 	childTableAry
 * 
 * TableInfoDataStructure(isCreator,isPublic)
 * 		setTableId(tableId)
 * 		getTableId()
 *
 * 		setTableName(tableName)
 * 		getTableName()
 * 		
 * 		isCreator()
 * 		isPublic()
 *
 * 		addParentTable()
 * 		removeParentTable(parentTableId)
 * 		queryParentTableCount()
 * 		parentTableIterator(CALL_BACK(parentTableId,parentTableName))
 * 		
 * 		addChildTable()
 * 		removeChildTable(childTableId)
 * 		queryChildTableCount()
 * 		childTableIterator(CALL_BACK(childTableId,childTableName))
 */
var TableInfoDataStructure={
	creatNew:function(IS_CREATOR,IS_PUBLIC,IS_ATTENTION){
		var TableInfoDataStructure={};

		var tableId;
		var tableName;
		var isCreator=IS_CREATOR;
		var isPublic=IS_PUBLIC;
		var isAttention=IS_ATTENTION;
		var parentTableAry=[];
		var childTableAry=[];

		TableInfoDataStructure.setTableId=function(TABLE_ID){
			tableId=TABLE_ID;
		}

		TableInfoDataStructure.getTableId=function(){
			return tableId;
		}

		TableInfoDataStructure.setTableName=function(TABLE_NAME){
			tableName=TABLE_NAME;
		}

		TableInfoDataStructure.getTableName=function(){
			return tableName;
		}

		TableInfoDataStructure.isCreator=function(){
			return isCreator;
		}

		TableInfoDataStructure.isPublic=function(){
			return isPublic;
		}

		TableInfoDataStructure.isAttention=function(){
			return isAttention;
		}

		TableInfoDataStructure.addParentTable=function(TABLE){
			parentTableAry.push(TABLE)
		}

		TableInfoDataStructure.removeParentTable=function(PARENT_TABLE_ID){
			parentTableAry=$.grep(parentTableAry,function(val,index){
				if(val.getTableId() == PARENT_TABLE_ID){
					return false;
				}
				else{
					return true;
				}
			});
		}

		TableInfoDataStructure.queryParentTableCount=function(){
			return parentTableAry.length;
		}

		TableInfoDataStructure.parentTableIterator=function(CALL_BACK){
			$.each(parentTableAry,function(index,val){
				CALL_BACK(val.getTableId(),val.getTableName());
			});
		}

		TableInfoDataStructure.addChildTable=function(TABLE){
			childTableAry.push(TABLE);
		}

		TableInfoDataStructure.removeChildTable=function(CHILD_TABLE_ID){
			childTableAry=$.grep(childTableAry,function(val,index){
				if(val.getTableId() == CHILD_TABLE_ID){
					return false;
				}
				else{
					return true;
				}
			});
		}

		TableInfoDataStructure.queryChildTableCount=function(){
			return childTableAry.length;
		}

		TableInfoDataStructure.childTableIterator=function(CALL_BACK){
			$.each(childTableAry,function(index,val){
				CALL_BACK(val.getTableId(),val.getTableName());
			});
		}



		return TableInfoDataStructure;
	}
}