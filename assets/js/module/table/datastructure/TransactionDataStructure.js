
/**
 * 它需要知道该用户关注的表，是否对表具有管理员权限（这将决定该用户是否能对某个transaction进行修改），以及这些表各自的父表池（这将决定该transaction的头名）
 * 
 *	是否来自直接关注？
 *		是：是否具有管理员权限？（这个问题的回答，要考虑是否是该表的创建者这种情况）
 *		否：哪个子表获取了这条信息？
 *
 * 	内容是什么？
 * 	时间？
 * 	ID？
 * 
 * TransactionDataStructure(attentionTableAry,transaction)
 * 		isDirectAttention()
 * 		isManager()
 * 		getChildTableName()
 * 		getChildTableId()
 * 		getParentTableName()
 * 		getParentTableId()
 *
 * 		来自父：
 * 		setTransactionId();
 * 		getTransactionId();
 *
 * 		setTableId();
 * 		getTableId();	//这个tableId是transaction所指向的table
 *
 * 		setContent();
 * 		getContent();
 * 		
 * 		setTime();
 * 		getTime();
 */
var TransactionDataStructure={
	creatNew:function(ATTENTION_TABLE_ARY,TRANSACTION){
		var TransactionDataStructure=TRANSACTION;

		var attentionTableAry=ATTENTION_TABLE_ARY;
		var isDirectAttention=false;
		var isManager=false;
		var childTableName;
		var childTableId;
		var parentTableName;
		var parentTableId;

		(function(){
			$.each(attentionTableAry,function(index, el) {
				if(el.getTableId() == TransactionDataStructure.getTableId()){
					isDirectAttention=true;
					isManager=el.isManager();
					childTableName=el.getTableName();
					childTableId=el.getTableId();
				}
			});
			if(!isDirectAttention){
				$.each(attentionTableAry,function(index, el) {
					var result=el.findParentTable(TransactionDataStructure.getTableId());
					if(result != null){
						parentTableName=result.getTableName();
						parentTableId=result.getTableId();
						childTableName=el.getTableName();
						childTableId=el.getTableId();
					}
				});
			}
		})();

		TransactionDataStructure.isDirectAttention=function(){
			return isDirectAttention;
		}

		TransactionDataStructure.isManager=function(){
			return isManager;
		}

		TransactionDataStructure.getChildTableId=function(){
			return childTableId;
		}

		TransactionDataStructure.getChildTableName=function(){
			return childTableName;
		}

		TransactionDataStructure.getParentTableId=function(){
			return parentTableId;
		}

		TransactionDataStructure.getParentTableName=function(){
			return parentTableName;
		}

		return TransactionDataStructure;
	}
}
