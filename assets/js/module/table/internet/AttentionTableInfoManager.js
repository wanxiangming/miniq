document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/datastructure/AttentionTable.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/datastructure/Table.js"+'">' + '</script>');
/**
 * AttentionTableInfoManager()
 * 		launch()
 * 		onSuccess()
 * 		onError()
 * 		getAllTableIdAry()		//返回的是你关注的表以及这些表的所有父表的tableId数组
 * 		getAttentionTableAry()	//返回的是AttetionTable对象的数组
 */
var AttentionTableInfoManager={
	creatNew:function(){
		var AttentionTableInfoManager={};

		var e_success=function(){};
		var e_error=function(){};
		var attentionTableAry=[];
		var allTableIdAry=[];

		AttentionTableInfoManager.launch=function(){
			var getAttentionTableInfo=GetAttentionTableInfo.creatNew();
			getAttentionTableInfo.onSuccessLisenter(function(DATA){
				$.each(DATA,function(index, el) {
					var parentTableAry=[];
					$.each(el.parentTableInfoAry,function(index, value) {
						var table=Table.creatNew();
						table.setTableId(value.tableId);
						table.setTableName(value.tableName);
						parentTableAry.push(table);
						addTableId(value.tableId);
					});
					var attentionTable=AttentionTable.creatNew();
					attentionTable.setTableId(el.tableId);
					attentionTable.setTableName(el.tableName);
					attentionTable.setIsManager(el.isManager);
					attentionTable.setParentTableAry(parentTableAry);
					attentionTableAry.push(attentionTable);
					addTableId(el.tableId);
				});
				//消除allTableIdAry中的重复项
				e_success();
			});
			getAttentionTableInfo.onErrorLisenter(function(){
				e_error();
			});
			getAttentionTableInfo.launch();
		}

		function addTableId(TABLE_ID){
			if($.inArray(TABLE_ID,allTableIdAry) < 0){
				allTableIdAry.push(TABLE_ID);
			}
		}

		AttentionTableInfoManager.getAllTableIdAry=function(){
			return allTableIdAry;
		}

		AttentionTableInfoManager.getAttentionTableAry=function(){
			return attentionTableAry;
		}

		AttentionTableInfoManager.onSuccess=function(CALL_BACK){
			e_success=CALL_BACK;
		}

		AttentionTableInfoManager.onError=function(CALL_BACK){
			e_error=CALL_BACK;
		}


		return AttentionTableInfoManager;
	}
}