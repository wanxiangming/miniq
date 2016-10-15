document.write('<script' + ' type="text/javascript" src="'+"assets/js/activity/table/data-structure/TableInfoDataStructure.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/activity/table/internet/GetTableInfoNET.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/activity/table/ParentTableItem.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/activity/table/ChildTableItem.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/activity/table/TableItem.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/activity/table/data-structure/FollowerDataStructure.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/activity/table/FollowerItem.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/activity/table/FollowerItemAryIterator.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/activity/table/FollowerItemFilter.js"+'">' + '</script>');

function host(){
	var tableScope=$("#table");
	var parentTableListScope=$("#parentTable");
	var childTableListScope=$("#childTable");
	var followerScope=$("#follower");
	var filtInput=$("#filt_follower_input");
	var followerListScope=$("#follower_list_scope");
	var loaderScope=$("#loaderScope");

	var loader=LoaderPiano.creatNew();
	loader.show();
	loader.ui.appendTo(loaderScope);

	var getTableInfoNet=GetTableInfoNET.creatNew(getUrlParam("tableId"));
	getTableInfoNet.onSuccess(function(TABLE_INFO_DATA_STRUCTURE){
		var tableId=TABLE_INFO_DATA_STRUCTURE.getTableId();
		var tableName=TABLE_INFO_DATA_STRUCTURE.getTableName();
		var isCreator=TABLE_INFO_DATA_STRUCTURE.isCreator();
		var isPublic=TABLE_INFO_DATA_STRUCTURE.isPublic();
		var isAttention=TABLE_INFO_DATA_STRUCTURE.isAttention();

		var table=Table.creatNew();
		table.setTableId(tableId);
		table.setTableName(tableName);

		var tableItem=TableItem.creatNew(tableId,tableName,isCreator,isPublic,isAttention);
		tableItem.getUI().appendTo(tableScope);
		tableItem.onChangeName(function(TABLE_NAME){
			var def=$.Deferred();
			var changeTableName=ChangeTableName.creatNew(tableId,TABLE_NAME);
			changeTableName.onSuccessLisenter(function(data){
				if(data == 0){
					def.resolve();	
					//这里要刷新页面	
					location.reload(true);
				}
			});
			changeTableName.launch();
			return def;
		});
		tableItem.onDeprecated(function(){
			var def=$.Deferred();
			var deprecatedTable=DeprecatedTable.creatNew(tableId);
			deprecatedTable.onSuccessLisenter(function(data){
				if(data==1){
					def.resolve();
					//这里要跳转回用户的管理页面
					window.location.href="?r=Main/ScheduleManager";
				}
			});
			deprecatedTable.launch();
			return def;
		});
		tableItem.onCancelAttention(function(){
			var def=$.Deferred();
			var cancelAttention=CancelAttention.creatNew(tableId);
			cancelAttention.onSuccessLisenter(function(data){
				if(data==1){
					def.resolve();
					//这里要刷新页面
					location.reload(true);
				}
			});
			cancelAttention.launch();
			return def;
		});
		tableItem.onOpen(function(){
			var def=$.Deferred();
			var openTheTable=OpenTheTable.creatNew(tableId);
			openTheTable.onSuccessLisenter(function(data){
				if(data==0){
					def.resolve();
					//这里要刷新页面
					location.reload(true);
				}
			});
			openTheTable.launch();
			return def;
		});
		tableItem.onSearch(function(TABLE_ID){
			var def=$.Deferred();
			var alreadyInherit=false;
			if(tableId != TABLE_ID){
				TABLE_INFO_DATA_STRUCTURE.parentTableIterator(function(PARENT_TABLE_ID,PARENT_TABLE_NAME){
					if(PARENT_TABLE_ID == TABLE_ID){
						alreadyInherit=true;
					}
				});
				if(!alreadyInherit){
					var searchTableByTableId=SearchTableByTableId.creatNew(TABLE_ID);
					searchTableByTableId.onSuccessLisenter(function(data){
						if(data==0){
							def.reject(2);
						}
						else{
							def.resolve(data.id,data.tableName,true);
						}
					});
					searchTableByTableId.launch();
				}
				else{
					def.reject(1);
				}
			}
			else{
				def.reject(3);
			}
			return def;
		});
		tableItem.onInherit(function(TABLE_ID,PARENT_TABLE_ID){
			var def=$.Deferred();
			var inherit=Inherit.creatNew(TABLE_ID,PARENT_TABLE_ID);
			inherit.onSuccessLisenter(function(data){
				if(data > 0){
					def.done();
					location.reload(true);
				}
				else{
					def.reject(data);
				}
			});
			inherit.launch();
			return def;
		});
		tableItem.onOpenFollowerList(function(){
			followerScope.removeClass('hide');
			refreshFollowerList();
		});

		function refreshFollowerList(){
			loader.show();
			var getFollowerList=GetFollowerList.creatNew(tableId);
			getFollowerList.onSuccessLisenter(function(data){
				loader.hide();
				followerListScope.empty();
				if(data.length == 0){
					//服务器返回的数据是空数组，说明该表没有任何人关注,实际上不会出现这种情况
				}
				else{
					var followerItemAry=[];
					$.each(data,function(index, el) {
						var followerDataStructure=FollowerDataStructure.creatNew(el.isManager,el.isCreator);
						followerDataStructure.setFollowerId(el.followerId);
						followerDataStructure.setFollowerName(el.followerName);
						var followerItem=FollowerItem.creatNew(followerDataStructure);
						followerItem.onSetToManager(function(followerId){
							var addManager=AddManager.creatNew(followerId,tableId);
							addManager.onSuccessLisenter(function(data){
								if(data == 1){
									refreshFollowerList();
								}
							});
							addManager.launch();
						});
						followerItem.onRepealManager(function(followerId){
							var repealManager=RepealManager.creatNew(followerId,tableId);
							repealManager.onSuccessLisenter(function(data){
								if(data == 1){
									refreshFollowerList();
								}
							});
							repealManager.launch();
						});
						followerItemAry.push(followerItem);
					});
					var followerItemAryIterator=FollowerItemAryIterator.creatNew(followerItemAry);
					followerItemAryIterator.sort();
					followerItemAryIterator.iterate(function(FOLLOWER_ITEM){
						FOLLOWER_ITEM.getUI().appendTo(followerListScope);
					});
					var followerItemFilter=FollowerItemFilter.creatNew(followerItemAry);
					filtInput.unbind().bind("input propertychange",function(){
						followerItemAryIterator.iterate(function(FOLLOWER_ITEM){
							FOLLOWER_ITEM.hide();
						});
						if(filtInput.val() == ""){
							followerItemAryIterator.iterate(function(FOLLOWER_ITEM){
								FOLLOWER_ITEM.getUI().appendTo(followerListScope);
								FOLLOWER_ITEM.show();
							});
						}
						else{
							$.each(followerItemFilter.filt(filtInput.val()),function(index,val){
								val.getUI().appendTo(followerListScope);
								val.show();
							});
						}
						
					});
				}
			});
			getFollowerList.launch();
		}

		// function makeFollowerItem(FOLLOWER_DATA_STRUCTURE){
		// 	var followerItem=FollowerItem.creatNew(FOLLOWER_DATA_STRUCTURE);
		// 	followerItem.onSetToManager(function(followerId){
		// 		//tableId followerId
		// 		var addManager=AddManager.creatNew(followerId,tableId);
		// 		addManager.onSuccessLisenter(function(data){
		// 			if(data == 1){
		// 				var followerDataStructure=FollowerDataStructure.creatNew(true,false);
		// 				followerDataStructure.setFollowerId(FOLLOWER_DATA_STRUCTURE.getFollowerId());
		// 				followerDataStructure.setFollowerName(FOLLOWER_DATA_STRUCTURE.getFollowerName());
		// 				makeFollowerItem(FollowerDataStructure);

		// 			}
				
		// 		});
		// 	});
		// 	followerItem.onRepealManager(function(){

		// 	});
		// }



		if(TABLE_INFO_DATA_STRUCTURE.queryParentTableCount() > 0){
			TABLE_INFO_DATA_STRUCTURE.parentTableIterator(function(PARENT_TABLE_ID,PARENT_TABLE_NAME){
				var parentTable=Table.creatNew();
				parentTable.setTableId(PARENT_TABLE_ID);
				parentTable.setTableName(PARENT_TABLE_NAME);
				var parentTableItem=ParentTableItem.creatNew(table,parentTable,isCreator);
				parentTableItem.getUI().appendTo(parentTableListScope);
				parentTableItem.onRelieveInherit(function(PRANT_T_ID){
					var relieveInherit=RelieveInherit.creatNew(tableId,PRANT_T_ID);
					relieveInherit.onSuccessLisenter(function(data){
						if(data == 1){
							location.reload(true);
						}
					});
					relieveInherit.launch();
				});
			});
		}
		else{
			var parentNullDiv=Div.creatNew();
			parentNullDiv.html("暂无父表");
			parentNullDiv.addClass('col-xs-12');
			parentNullDiv.setAttribute("style","padding-top:6px;padding-left:30px");
			parentNullDiv.appendTo(parentTableListScope);
		}

		if(TABLE_INFO_DATA_STRUCTURE.queryChildTableCount() > 0){
			TABLE_INFO_DATA_STRUCTURE.childTableIterator(function(CHILE_TABLE_ID,CHILD_TABLE_NAME){
				var childTable=Table.creatNew();
				childTable.setTableId(CHILE_TABLE_ID);
				childTable.setTableName(CHILD_TABLE_NAME);

				var childTableItem=ChildTableItem.creatNew(table,childTable,isCreator);
				childTableItem.getUI().appendTo(childTableListScope);
			});
		}
		else{
			var childNullDiv=Div.creatNew();
			childNullDiv.html("暂无子表");
			childNullDiv.addClass('col-xs-12');
			childNullDiv.setAttribute("style","padding-top:6px;padding-left:30px");
			childNullDiv.appendTo(childTableListScope);
		}
		
	});
	getTableInfoNet.onError(function(ERROR_CODE){
		if(ERROR_CODE == 1){
			alert("请检查网络");
		}
		else if(ERROR_CODE == 2){
			alert("不存在该表");
		}
	});
	getTableInfoNet.launch();
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null){
    	return unescape(r[2]);
    }
    else{
    	return null; //返回参数值
    }
}



