

minclude("GetTableInfoNET");
minclude("ParentTableItem");
minclude("ChildTableItem");
minclude("TableItem");
minclude("FollowerDataStructure");
minclude("FollowerItem");
minclude("FollowerItemAryIterator");
minclude("FollowerItemFilter");
minclude("LoaderPiano");

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
					window.location.href="?r=Table/TableManage";
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

		if(TABLE_INFO_DATA_STRUCTURE.queryParentTableCount() > 0){
			TABLE_INFO_DATA_STRUCTURE.parentTableIterator(function(PARENT_TABLE_ID,PARENT_TABLE_NAME){
				var parentTableItem=ParentTableItem.creatNew(tableName,PARENT_TABLE_ID,PARENT_TABLE_NAME,isCreator);
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
				var childTableItem=ChildTableItem.creatNew(tableName,CHILE_TABLE_ID,CHILD_TABLE_NAME,isCreator);
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





minclude("Table");
minclude("TableInfoDataStructure");
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


minclude("Div");
minclude("DropDownListItem");
minclude("DropDownItemButton");
/**
 * href=http://www.miniq.site/?r=Table/TableInfo&tableId=
 * 
 * ParentTableItem(tableName,parentTableId,parentTableName,editPermission)
 * 		show()
 * 		hide()
 * 		getUI()
 * 		onRelieveInherit(CALL_BACK(parentTableId))
 */
var ParentTableItem={
	creatNew:function(TABLE_NAME,PARENT_TABLE_ID,PARENT_TABLE_NAME,EDIT_PERMISSION){
		var ParentTableItem={};


		var checkActionBtn=$("#checkAction_btn");
		var checkActionModal=$("#checkAction_Modal");
		var checkActionContent=$("#checkAction_Content");
		var div=Div.creatNew();
		var e_relieveInherit=function(parentTableId){};
		(function(){
			var tableNameDiv=Div.creatNew();
			tableNameDiv.html(TABLE_NAME+"  <<  "+"<a href=\""+MINIQ_URL+"Table/TableInfo&tableId="+PARENT_TABLE_ID+"\">"+PARENT_TABLE_NAME+" ("+PARENT_TABLE_ID+")</a>");

			var dropDownListItem=DropDownListItem.creatNew(EDIT_PERMISSION,"<span class=\"glyphicon glyphicon-cog\"></span>","mousein");
			dropDownListItem.addDropDownMenu(makeRelieveInheritBtn());
			dropDownListItem.appendContent(tableNameDiv.ui);
			dropDownListItem.appendTo(div.ui);
		})();

		function makeRelieveInheritBtn(){
			var dropDownItem=DropDownItemButton.creatNew();
			dropDownItem.html("解除继承");
			dropDownItem.onClickListener(function(){
				checkActionContent.html("您确定要解除与\""+PARENT_TABLE_NAME+"\"的继承关系吗？");
				checkActionBtn.unbind().bind("click",function(){
					e_relieveInherit(PARENT_TABLE_ID);
				});
				checkActionModal.modal("show");
			});
			return dropDownItem;
		}

		ParentTableItem.onRelieveInherit=function(CALL_BACK){
			e_relieveInherit=CALL_BACK;
		}

		ParentTableItem.getUI=function(){
			return div.ui;
		}

		ParentTableItem.show=function(){
			div.removeClass('hide');
		}

		ParentTableItem.hide=function(){
			div.addClass('hide');
		}

		return ParentTableItem;
	}
}




minclude("DropDownListItem");
minclude("Div");
/**
 * ChildTableItem()
 * 		getUI()
 * 		show()
 * 		hide()
 * 		onClickSettingBtn()
 */
var ChildTableItem={
	creatNew:function(TABLE_NAME,CHILD_TABLE_ID,CHILD_TABLE_NAME,EDIT_PERMISSION){
		var ChildTableItem={};

		var div=Div.creatNew();
		var settingBtn=Div.creatNew();
		var e_clickSettingBtn=function(){};

		(function(){
			var dropDownListItem=DropDownListItem.creatNew(false,"<span class=\"glyphicon glyphicon-cog\"></span>","mousein");
			var tableNameDiv=Div.creatNew();
			tableNameDiv.html("<a href=\""+MINIQ_URL+"Table/TableInfo&tableId="+CHILD_TABLE_ID+"\">"+CHILD_TABLE_NAME+" ("+CHILD_TABLE_ID+")</a>"+"  <<  "+TABLE_NAME);
			dropDownListItem.appendContent(tableNameDiv.ui);
			dropDownListItem.appendTo(div.ui);	
		})();

		ChildTableItem.getUI=function(){
			return div.ui;
		}

		ChildTableItem.show=function(){
			div.removeClass('hide');
		}

		ChildTableItem.hide=function(){
			div.addClass('hide');
		}

		ChildTableItem.onRelieve=function(CALL_BACK){
			e_clickSettingBtn=CALL_BACK;
		}

		return ChildTableItem;
	}
}

















minclude("DropDownListItem");
minclude("Div");
minclude("DropDownItemButton");
minclude("Span");
minclude("TableItemInheritEdit");

/**
 * TableItem(tableId,tableName,isCreator,isPublic,isAttention)
 * 		getUI()
 * 		show()
 * 		hide()
 * 		onChangeName(CALL_BACK(tableName))	//返回Deferred对象
 * 		onDeprecated(CALL_BACK())	//返回Deferred对象
 * 		onCancelAttention(CALL_BACK())	//返回Deferred对象
 * 		onOpen(CALL_BACK())			//返回Deferred对象
 * 		onInherit(CALL_BACK(tableId,parentTableId))		//返回Deferred对象
 * 		onSearch(CALL_BACK(tableId))		//返回Deferred对象,并携带tableId,tableName,isPublic信息,
 * 											如果已经继承了该表，则reject 1
 * 											如果查无此表，或此表是私有的则reject 2
 * 											自我继承 reject 3
 * 		onOpenFollowerList(CALL_BACK)	//当用户打开了关注者列表的时候，你可以做一些事情
 * 											
 */
var TableItem={
	creatNew:function(TABLE_ID,TABLE_NAME,IS_CREATOR,IS_PUBLIC,IS_ATTENTION){
		var TableItem={};

		var logNameInpChangeNickName=$("#log_name_inp_changeNickName");
		var createInpParentChangeNickName=$("#create_inp_parent_changeNickName");
		var changeNickNameSaveBtn=$("#changeNickName_save_btn");
		var changeNickNameModal=$("#changeNickName_modal");
		var checkActionBtn=$("#checkAction_btn");
		var checkActionModal=$("#checkAction_Modal");
		var checkActionContent=$("#checkAction_Content");
		var tableId=TABLE_ID;
		var tableName=TABLE_NAME;
		var isCreator=IS_CREATOR;
		var isPublic=IS_PUBLIC;
		var isAttention=IS_ATTENTION;
		var div=Div.creatNew();
		var tableItemInheritEdit=TableItemInheritEdit.creatNew();
		var e_changName=function(TABLE_NAME){return $.Deferred();};
		var e_deprecated=function(){return $.Deferred();};
		var e_cancelAttention=function(){return $.Deferred();};
		var e_open=function(){return $.Deferred();};
		var e_inherit=function(TABLE_ID){return $.Deferred();};
		var e_searchTable=function(TABLE_ID){return $.Deferred();};
		var e_openFollowerList=function(){};

		(function(){
			var dropDownListItem=DropDownListItem.creatNew(true,"<span class=\"glyphicon glyphicon-cog\"></span>","alltime");
			if(isCreator){
				dropDownListItem.addDropDownMenu(getChangeTableNameBtn());
				dropDownListItem.addDropDownMenu(getDeprecatedBtn());
				dropDownListItem.addDropDownMenu(getInheritBtn());
				dropDownListItem.addDropDownMenu(getOpenFollowerListBtn());
				if(!isPublic){
					dropDownListItem.addDropDownMenu(getOpenTableBtn());
				}
			}
			else if(isAttention){
				dropDownListItem.addDropDownMenu(getCancelAttentionBtn());
			}
			else{
				dropDownListItem=DropDownListItem.creatNew(false,"","");
			}

			var tableNameScope=Div.creatNew();
			tableNameScope.html(tableName+" ("+tableId+") "+"("+(IS_PUBLIC==true? "公开的":"私有的")+") ");
			spanOfBelong(IS_CREATOR,IS_ATTENTION).appendTo(tableNameScope.ui);
			dropDownListItem.appendContent(tableNameScope.ui);
			dropDownListItem.appendTo(div.ui);

			tableItemInheritEdit.onSearch(function(TABLE_ID){
				var def=e_searchTable(TABLE_ID);
				return def;
			});
			tableItemInheritEdit.onInherit(function(TABLE_ID){
				var def=e_inherit(tableId,TABLE_ID);
				def.done(function(){

				});
				return def;
			});
		})();

		function spanOfBelong(IS_CREATOR,IS_ATTENTION){
			var span=Span.creatNew();
			span.setAttribute("aria-hidden",true);
			span.setAttribute("data-toggle","tooltip");
			span.setAttribute("data-placement","right");
			if(IS_CREATOR){
				span.addClass('glyphicon glyphicon-user');
				span.setAttribute("data-original-title","自建");
				span.ui.tooltip();
				return span.ui;
			}
			else if(IS_ATTENTION){
				span.addClass('glyphicon glyphicon-eye-open');
				span.setAttribute("data-original-title","关注");
				span.ui.tooltip();
				return span.ui;
			}
			return span.ui;
		}

		function getChangeTableNameBtn(){
			var btn=DropDownItemButton.creatNew();
			btn.html("修改名称");
			btn.onClickListener(function(){
				logNameInpChangeNickName.val(tableName);
				changeNickNameSaveBtn.unbind().bind("click",function(){
					if(logNameInpChangeNickName.val().length>12 || logNameInpChangeNickName.val().length==0){
						createInpParentChangeNickName.addClass("has-error");
					}
					else{
						e_changName(logNameInpChangeNickName.val());
					}
				});
				changeNickNameModal.modal('show');
			});

			return btn;
		}

		function getDeprecatedBtn(){
			var btn=DropDownItemButton.creatNew();
			btn.html("弃用此表");
			btn.onClickListener(function(){
				checkActionContent.html("您确定要弃用\""+tableName+"\"吗？");
				checkActionBtn.unbind().bind("click",function(){
					e_deprecated();
				});
				checkActionModal.modal("show");
			});

			return btn;
		}

		function getCancelAttentionBtn(){
			var btn=DropDownItemButton.creatNew();
			btn.html("取消关注");
			btn.onClickListener(function(){
				checkActionContent.html("您确定要取消关注\""+tableName+"\"吗？");
				checkActionBtn.unbind().bind("click",function(){
					e_cancelAttention();
				});
				checkActionModal.modal("show");
			});
			return btn;
		}

		function getOpenTableBtn(){
			var btn=DropDownItemButton.creatNew();
			btn.html("公开此表");
			btn.onClickListener(function(){
				checkActionContent.html("您确定要公开\""+tableName+"\"吗？(公开后将无法再设为私有)");
				checkActionBtn.unbind().bind("click",function(){
					e_open();
				});
				checkActionModal.modal("show");
			});
			return btn;
		}

		function getInheritBtn(){
			var btn=DropDownItemButton.creatNew();
			btn.html("继承其他表");
			btn.onClickListener(function(){
				tableItemInheritEdit.show();
			});
			return btn;
		}

		function getOpenFollowerListBtn(){
			var btn=DropDownItemButton.creatNew();
			btn.html("关注者&管理者");
			btn.onClickListener(function(){
				e_openFollowerList();
			});
			return btn;
		}


		TableItem.getUI=function(){
			return div.ui;
		}

		TableItem.show=function(){
			div.removeClass('hide');
		}

		TableItem.hide=function(){
			div.addClass('hide');
		}

		TableItem.onOpen=function(CALL_BACK){
			e_open=CALL_BACK;
		}

		TableItem.onChangeName=function(CALL_BACK){
			e_changName=CALL_BACK;
		}

		TableItem.onDeprecated=function(CALL_BACK){
			e_deprecated=CALL_BACK;
		}

		TableItem.onInherit=function(CALL_BACK){
			e_inherit=CALL_BACK;
		}

		TableItem.onSearch=function(CALL_BACK){
			e_searchTable=CALL_BACK;
		}

		TableItem.onCancelAttention=function(CALL_BACK){
			e_cancelAttention=CALL_BACK;
		}

		TableItem.onOpenFollowerList=function(CALL_BACK){
			e_openFollowerList=CALL_BACK;
		}

		return TableItem;
	}
}






/**
 * FollowerDataStructure(isManager,isCreator)	//接收boolean变量
 * 		setFollowerId(id)
 * 		getFollowerId()
 *
 * 		setFollowerName(name)
 * 		getFollowerName()
 *
 * 		isManager()
 * 		isCreator()
 */
var FollowerDataStructure={
	creatNew:function(IS_MANAGER,IS_CREATOR){
		var FollowerDataStructure={};

		var isManager=IS_MANAGER;
		var isCreator=IS_CREATOR;
		var followerId;
		var followerName;

		FollowerDataStructure.setFollowerId=function(FOLLOWER_ID){
			followerId=Number(FOLLOWER_ID);
		}

		FollowerDataStructure.getFollowerId=function(){
			return followerId;
		}

		FollowerDataStructure.setFollowerName=function(FOLLWER_NAME){
			followerName=FOLLWER_NAME;
		}

		FollowerDataStructure.getFollowerName=function(){
			return followerName;
		}

		FollowerDataStructure.isManager=function(){
			return isManager;
		}

		FollowerDataStructure.isCreator=function(){
			return isCreator;
		}

		return FollowerDataStructure;
	}
}




minclude("Div");
minclude("DropDownListItem");
minclude("DropDownItemButton");

/**
 * FollowerItem(FollowerDataStructure)
 * 		getUI()
 * 		show()
 * 		hide()
 * 		getFollowerId()
 * 		getFollowerName()
 * 		isManager()
 * 		isCreator()
 * 		onSetToManager(CALL_BACK(followerId))
 * 		onRepealManager(CALL_BACK(followerId))
 */
var FollowerItem={
	creatNew:function(FOLLOWER_DATA_STRUCTURE){
		var FollowerItem={};

		var followerDataStructure=FOLLOWER_DATA_STRUCTURE;
		var div=Div.creatNew();
		var e_setToManager=function(){};
		var e_repealManager=function(){};

		(function(){
			var userInfoDiv=Div.creatNew();
			userInfoDiv.html(followerDataStructure.getFollowerName()+" ("+followerDataStructure.getFollowerId()+") ");

			var dropDownListItem=null;
			if(followerDataStructure.isCreator()){
				dropDownListItem=DropDownListItem.creatNew(false,"<span class=\"glyphicon glyphicon-cog\"></span>","mousein");
			}
			else{
				dropDownListItem=DropDownListItem.creatNew(true,"<span class=\"glyphicon glyphicon-cog\"></span>","mousein");
			}
			
			dropDownListItem.appendContent(userInfoDiv.ui);
			dropDownListItem.appendTo(div.ui);

			if(followerDataStructure.isManager()){
				getManagerSpan().appendTo(userInfoDiv.ui);
				dropDownListItem.addDropDownMenu(dropDownMenuRepealManager());
			}
			else{
				dropDownListItem.addDropDownMenu(dropDownMenuSetManager());
			}
		})();

		function dropDownMenuSetManager(){
			var setManager=DropDownItemButton.creatNew();
			setManager.html("提升为管理员");
			setManager.ui.bind("click",function(){
				e_setToManager(followerDataStructure.getFollowerId());
			});
			return setManager;
		}

		function dropDownMenuRepealManager(){
			var repealManager=DropDownItemButton.creatNew();
			repealManager.html("撤销此管理员");
			repealManager.ui.bind("click",function(){
				e_repealManager(followerDataStructure.getFollowerId());
			});
			return repealManager;
		}

		function getManagerSpan(){
			var span=Span.creatNew();
			span.setAttribute("aria-hidden",true);
			span.setAttribute("data-toggle","tooltip");
			span.setAttribute("data-placement","right");
			span.addClass('glyphicon glyphicon-tag');
			span.setAttribute("data-original-title","管理员");
			span.ui.tooltip();
			return span.ui;
		}

		FollowerItem.getUI=function(){
			return div.ui;
		}

		FollowerItem.show=function(){
			div.removeClass('hide');
		}

		FollowerItem.hide=function(){
			div.addClass('hide');
		}

		FollowerItem.getFollowerId=function(){
			return followerDataStructure.getFollowerId();
		}

		FollowerItem.getFollowerName=function(){
			return followerDataStructure.getFollowerName();
		}

		FollowerItem.isManager=function(){
			return followerDataStructure.isManager();
		}

		FollowerItem.isCreator=function(){
			return followerDataStructure.isCreator();
		}

		FollowerItem.onSetToManager=function(CALL_BACK){
			e_setToManager=CALL_BACK;
		}

		FollowerItem.onRepealManager=function(CALL_BACK){
			e_repealManager=CALL_BACK;
		}

		return FollowerItem;
	}
}














/**
 * FollowerItemAryIterator(FollowerItemAry)
 * 		iterate(CALL_BACK(FollowerItem))
 * 		sort()
 */
var FollowerItemAryIterator={
	creatNew:function(FOLLOWER_ITEM_ARY){
		var FollowerItemAryIterator={};

		var followerItemAry=FOLLOWER_ITEM_ARY;

		FollowerItemAryIterator.iterate=function(CALL_BACK){
			$.each(followerItemAry,function(index, el) {
				CALL_BACK(el);
			});
		}

		FollowerItemAryIterator.sort=function(){
			followerItemAry.sort(function(FOLLOWER_A,FOLLOWER_B){
				if(FOLLOWER_A.isCreator()){
					return -1;
				}
				if(FOLLOWER_A.isManager() == FOLLOWER_B.isManager()){
					if(FOLLOWER_A.getFollowerId() <= FOLLOWER_B.getFollowerId()){
						return -1;
					}
					else{
						return 1;
					}
				}
				else{
					if(FOLLOWER_A.isManager()){
						return -1;
					}
					else{
						return 1;
					}
				}
			});
		}

		return FollowerItemAryIterator;
	}
}














minclude("FollowerItemAryIterator");
/**
 * FollowerItemFilter(FollowerItemAry)
 * 		filt(string)		//FollowerItem数组
 */
var FollowerItemFilter={
	creatNew:function(FOLLOWER_ITEM_ARY){
		var FollowerItemFilter={};

		var followerItemAry=FOLLOWER_ITEM_ARY;
		var followerItemAryIterator=FollowerItemAryIterator.creatNew(followerItemAry);

		(function(){
			followerItemAryIterator.sort();
		})();

		FollowerItemFilter.filt=function(STRING){
			var resultA=filtByFollowerId(STRING);
			var resultB=filtByFollowerName(STRING);
			var isExist=false;
			$.each(resultB,function(index, elB) {
				isExist=false;
				$.each(resultA,function(index, elA) {
					if(elB.getFollowerId() == elA.getFollowerId()){
						isExist=true;
					}
				});
				if(!isExist){
					resultA.push(elB);
				}
			});
			return resultA;
		}

		function filtByFollowerId(FOLLOWER_ID){
			var resultAry=[];
			var goalFollowerId=FOLLOWER_ID.toString();
			var goalFollowerIdLength=goalFollowerId.length;
			followerItemAryIterator.iterate(function(FOLLOWER_ITEM){
				followerId=FOLLOWER_ITEM.getFollowerId().toString();
				if(followerId.substring(0,goalFollowerIdLength) == goalFollowerId){
					resultAry.push(FOLLOWER_ITEM);
				}
			});
			return resultAry;
		}

		function filtByFollowerName(FOLLOWER_NAME){
			var resultAry=[];
			var goalFollowerName=FOLLOWER_NAME;
			var reg=new RegExp(goalFollowerName);
			followerItemAryIterator.iterate(function(FOLLOWER_ITEM){
				var followerName=FOLLOWER_ITEM.getFollowerName();
				if(reg.test(followerName)){
					resultAry.push(FOLLOWER_ITEM);
				}
			});
			return resultAry;
		}

		return FollowerItemFilter;
	}
}









minclude("Div");

var LoaderPiano={
	creatNew:function(){
		var LoaderPiano=Div.creatNew();

		var div1=Div.creatNew();
		var div2=Div.creatNew();
		var div3=Div.creatNew();

		LoaderPiano.addClass("cssload-piano hide");
		div1.addClass("cssload-rect1");
		div2.addClass("cssload-rect2");
		div3.addClass("cssload-rect3");
		div1.appendTo(LoaderPiano.ui);
		div2.appendTo(LoaderPiano.ui);
		div3.appendTo(LoaderPiano.ui);

		LoaderPiano.hide=function(){
			LoaderPiano.addClass('hide');
		}

		LoaderPiano.show=function(){
			LoaderPiano.removeClass('hide');
		}

		return LoaderPiano;
	}
}

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



minclude("Table");

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


minclude("Ui");

var Div={
	creatNew:function(){
		var Div=Ui.creatNew($("<div></div>"));

		return Div;
	}	
}

var HorizontalSlipDiv={
	creatNew:function(){
		var HorizontalSlipDiv=Div.creatNew();

		HorizontalSlipDiv.addClass("animated bounceInRight hide");

		HorizontalSlipDiv.show=function(){
			HorizontalSlipDiv.removeClass('hide');
		}

		HorizontalSlipDiv.slipRemove=function(){
			HorizontalSlipDiv.addClass("bounceOutLeft");
			HorizontalSlipDiv.one('animationend',function(){
				HorizontalSlipDiv.remove();
			});
		}

		return HorizontalSlipDiv;
	}
}

var FlipYDiv={
	creatNew:function(){
		var FlipYDiv=Div.creatNew();

		FlipYDiv.addClass("animated flipInY hide");

		FlipYDiv.show=function(){
			FlipYDiv.removeClass('hide');
		}

		FlipYDiv.flipRemove=function(){
			FlipYDiv.addClass("flipOutY");
			FlipYDiv.one('animationend',function(){
				FlipYDiv.remove();
			});
		}

		return FlipYDiv;
	}
}

var FadeDiv={
	creatNew:function(){
		var FadeDiv=Div.creatNew();

		FadeDiv.addClass("fadeIn animated correction-animated-css hide");
		
		FadeDiv.show=function(){
			FadeDiv.removeClass('hide');
		}

		FadeDiv.fadeRemove=function(){
			FadeDiv.addClass("fadeOut");
			FadeDiv.one("animationend",function(){
				FadeDiv.remove();
			});
		}

		return FadeDiv;
	}
}















minclude("Div");
minclude("DropDown");


/**
 * DropDownListItem(DropDownVisibility,DropDownHtml,DropDownModal)	//设置下拉菜单按钮可见性(默认可见)
 * 																	//你可以设置dropdown的html
 * 																	//设置下拉菜单显示模式
 *                   						 							alltime:一直显示(默认值)
 *                                 			 							mousein:仅鼠标在ListItem内的时候显示 
 * 		appendContent(element)		//你可以通过这个方法得到装载content的div，从而对它进行自定义
 * 		addDropDownMenu(DropDownItemButton)
 * 		appendTo(element)			//将ListItem添加到element中
 */
var DropDownListItem={
	creatNew:function(DROPDOWN_VISIBILITY,DROPDOWN_HTML,DROPDOWN_MODAL){
		var DropDownListItem={};

		var listDiv=Div.creatNew();
		var contentDiv=Div.creatNew();
		var dropDownBtnDiv=Div.creatNew();
		var dropDownBtn=DropDown.creatNew(DROPDOWN_HTML);
		var map=[{flag:"alltime",case:1},{flag:"mousein",case:2}];
		var isMouseIn;

		(function(){
			listDiv.addClass("row correction-row-css deep-background-on-hover col-xs-12 text-center ");
			listDiv.setAttribute("style","padding-top:6px;padding-bottom:6px;");
			contentDiv.addClass('col-xs-10 text-left ');
			contentDiv.setAttribute("style","padding-top:6px");
			contentDiv.appendTo(listDiv.ui);
			dropDownBtnDiv.addClass('col-xs-2');
			dropDownBtnDiv.appendTo(listDiv.ui);
			dropDownBtn.appendTo(dropDownBtnDiv.ui);
			if(!DROPDOWN_VISIBILITY){
				dropDownBtnDiv.addClass('hide');
			}
			$.each(map,function(index, el) {
				if(el.flag == DROPDOWN_MODAL){
					setDropDownModal(el.case);
				}
			});
		})();

		function setDropDownModal(CASE){
			switch(CASE){
				case 1:
					break;
				case 2:
					dropDownBtn.hide();
					dropDownBtn.onMenuClose(function(){
						if(!isMouseIn){
							dropDownBtn.hide();
						}
					});
					listDiv.ui.mouseenter(function(event) {
						dropDownBtn.show();
						isMouseIn=true;
					});
					listDiv.ui.mouseleave(function(event) {
						isMouseIn=false;
						if(!dropDownBtn.isMenuOpen()){
							dropDownBtn.hide();
						}
					});

					break;
			}
		}

		DropDownListItem.appendContent=function(ELEMENT){
			ELEMENT.appendTo(contentDiv.ui);
		}

		DropDownListItem.addDropDownMenu=function(DROPDOWN_MENU_ITEM){
			dropDownBtn.addMenuItem(DROPDOWN_MENU_ITEM);
		}

		DropDownListItem.appendTo=function(ELEMENT){
			listDiv.appendTo(ELEMENT);
		}

		return DropDownListItem;
	}
}















minclude("Li");

// var DropDownItemButton={
// 	creatNew:function(){
// 		var DropDownItemButton=Button.creatNew();

// 		DropDownItemButton.addClass("form-control btn btn-default correction-dropdown-btn-css");

// 		return DropDownItemButton;
// 	}
// }


var DropDownItemButton={
	creatNew:function(){
		var DropDownItemButton=Li.creatNew();

		DropDownItemButton.addClass("form-control btn btn-default correction-dropdown-btn-css");

		DropDownItemButton.onClickListener=function(CALL_BACK){
			DropDownItemButton.ui.bind("click",function(ev){
				CALL_BACK($(this),ev);
			});
		}

		return DropDownItemButton;
	}
}








var Ui={
	creatNew:function(UI){
		var Ui={};

		Ui.ui=UI;

		Ui.addClass=function(PROP){
			Ui.ui.addClass(PROP);
		}

		Ui.removeClass=function(PROP){
			Ui.ui.removeClass(PROP);
		}

		Ui.html=function(HTML){
			Ui.ui.html(HTML);
		}
		
		Ui.addHtml=function(HTML){
			var html=Ui.ui.html();
			Ui.ui.html(html+HTML)
		}

		Ui.appendTo=function(SCOPE){
			Ui.ui.appendTo(SCOPE);
		}

		Ui.remove=function(){
			Ui.ui.remove();
		}

		Ui.setAttribute=function(NAME,VALUE){
			Ui.ui.attr(NAME,VALUE);
		}
		
		Ui.getAttribute=function(NAME){
			return Ui.ui.attr(NAME);
		}

		Ui.one=function(ACTION,CALL_BACK){
			Ui.ui.one(ACTION,CALL_BACK);
		}
		
		Ui.hide=function(){
			Ui.ui.hide();
		}

		return Ui;
	}	
}


minclude("Div");
minclude("Button");
minclude("Ul");

/**
 * DropDown(Html)
 * 		setHtml()
 * 		appendTo()
 * 		addMenuItem()
 * 		
 * 		openMenu()
 * 		closeMenu()
 *
 * 		onMenuOpen()
 * 		onMenuClose()
 * 		
 * 		show()
 * 		hide()
 * 		isMenuOpen()
 */

var DropDown={
	creatNew:function(BTN_HTML){
		var DropDown={};

		var div=Div.creatNew();
		var dropDownBtn=Button.creatNew();
		var ul=Ul.creatNew();
		var e_menuOpen=function(){};
		var e_menuClose=function(){};

		div.addClass("dropdown");
		div.ui.on("shown.bs.dropdown",function(){
			e_menuOpen();
		});
		div.ui.on("hidden.bs.dropdown",function(){
			e_menuClose();
		});

		dropDownBtn.addClass("btn btn-default dropdown-toggle correction-cancel-border");
		dropDownBtn.setAttribute("type","button");
		dropDownBtn.setAttribute("data-toggle","dropdown");
		dropDownBtn.setAttribute("aria-haspopup","true");
		dropDownBtn.setAttribute("aria-expanded","false");
		dropDownBtn.html(BTN_HTML);

		ul.addClass("dropdown-menu correction-dropdown-menu-padding correction-cancel-border");
		ul.setAttribute("role","menu");

		dropDownBtn.appendTo(div.ui);
		ul.appendTo(div.ui);

		DropDown.appendTo=function(SCOP){
			div.appendTo(SCOP);
		}

		DropDown.addMenuItem=function(ITME){
			ITME.appendTo(ul.ui);
		}

		DropDown.show=function(){
			dropDownBtn.removeClass('hide');
		}

		DropDown.hide=function(){
			dropDownBtn.addClass('hide');
		}

		DropDown.openMenu=function(){
			div.addClass('open');
		}

		DropDown.isMenuOpen=function(){
			return div.ui.hasClass('open');
		}

		DropDown.closeMenu=function(){
			closeMenu();
		}

		function closeMenu(){
			div.removeClass('open');
		}

		DropDown.onMenuOpen=function(CALL_BACK){
			e_menuOpen=CALL_BACK;
		}

		DropDown.onMenuClose=function(CALL_BACK){
			e_menuClose=CALL_BACK;
		}

		DropDown.setHtml=function(HTML){
			dropDownBtn.html(HTML);
		}

		return DropDown;
	}
}


























minclude("Ui");

var Button={
	creatNew:function(){
		var Button=Ui.creatNew($("<button></button>"));

		Button.onClickListener=function(CALL_BACK){
			Button.ui.bind("click",function(ev){
				CALL_BACK($(this),ev);
			});
		}

		return Button;
	}
}













minclude("Ui");

var Ul={
	creatNew:function(){
		var Ul=Ui.creatNew($("<ul></ul>"));

		return Ul;
	}
}





















var Li={
	creatNew:function(){
		var Li=Ui.creatNew($("<li></li>"));
		return Li;
	}
}














minclude("Ui");


var Span={
	creatNew:function(){
		var Span=Ui.creatNew($("<span></span>"));
		return Span;
	}
}














minclude("Div");
minclude("InheritSearchResult");
/**
 * TableItemInheritEdit()
 * 		getUI()
 * 		show()
 * 		hide()
 * 		onInherit(CALL_BACK(tableId))	//返回Deferred对象
 * 		onSearch(CALL_BACK(tableId))	//返回Deferred对象，并携带tableId,tableName,isPublic信息
 * 										如果已经继承了该表，则reject 1
* 										如果查无此表，或此表是私有的则reject 2
* 										自我继承 reject 3
 */
var TableItemInheritEdit={
	creatNew:function(){
		var TableItemInheritEdit={};

		var inheritScope=$("#inheritSearch");
		var searchInput=$("#search_input");
		var searchBtn=$("#search_button");
		var searchResultScope=$("#searchResult");
		var e_seach=function(TABLE_ID){return $.Deferred();};
		var e_inherit=function(TABLE_ID){return $.Deferred();};

		(function(){
			searchInput.keydown(function(e){
				clearSearchScope();
				if(e.keyCode == 13){
					var def=e_seach(searchInput.val());
					def.done(function(TABLE_ID,TABLE_NAME,IS_PUBLIC){
						makeSearchResultItem(TABLE_ID,TABLE_NAME,IS_PUBLIC).appendTo(searchResultScope);
					});
					def.fail(function(ERROR_CODE){
						makeSearchFailedItem(ERROR_CODE).appendTo(searchResultScope);
					});
				}
			});

			searchBtn.on("click",function(){
				clearSearchScope();
				var def=e_seach(searchInput.val());
				def.done(function(TABLE_ID,TABLE_NAME,IS_PUBLIC){
					makeSearchResultItem(TABLE_ID,TABLE_NAME,IS_PUBLIC).appendTo(searchResultScope);
				});
				def.fail(function(ERROR_CODE){
					makeSearchFailedItem(ERROR_CODE).appendTo(searchResultScope);
				});
			});
		})();

		function makeSearchFailedItem(ERROR_CODE){
			var div=Div.creatNew();
			div.addClass('text-danger col-xs-12');
			div.setAttribute("style","padding-top:15px;padding-left:13px;padding-right:0px");
			if(ERROR_CODE == 1){
				div.html("已继承此表");
			}
			else if(ERROR_CODE == 2){
				div.html("查无此表，或此表为私有表");
			}
			else if(ERROR_CODE == 3){
				div.html("无法继承自己");
			}
			return div.ui;
		}

		function makeSearchResultItem(TABLE_ID,TABLE_NAME,IS_PUBLIC){
			var inheritSearchResult=InheritSearchResult.creatNew(TABLE_ID,TABLE_NAME,IS_PUBLIC);
			inheritSearchResult.onInherit(function(T_ID){
				return e_inherit(T_ID);
			});
			return inheritSearchResult.getUI();
		}

		function clearSearchScope(){
			searchResultScope.empty();
		}

		TableItemInheritEdit.show=function(){
			inheritScope.removeClass('hide');
		}

		TableItemInheritEdit.hide=function(){
			inheritScope.addClass('hide');
		}

		TableItemInheritEdit.onInherit=function(CALL_BACK){
			e_inherit=CALL_BACK;
		}

		TableItemInheritEdit.onSearch=function(CALL_BACK){
			e_seach=CALL_BACK;
		}

		return TableItemInheritEdit;
	}
}


minclude("Div");

/**
 *	如果对方是私有表，那么我们可以请求继承，如果是公开表，我们可以直接继承
 *	现在时间有限，我们仅让它能继承公开表，也就是说私有表我们给予用户说明，并且不提供继承操作
 * 
 * InheritSearchResult(tableId,tableName,isPublic)
 * 		getUI()
 * 		onInherit(CALL_BACK(tableId))	//返回Deferred对象
 */
var InheritSearchResult={
	creatNew:function(TABLE_ID,TABLE_NAME,IS_PUBLIC){
		var InheritSearchResult={};

		var tableId=TABLE_ID;
		var tableName=TABLE_NAME;
		var isPublic=IS_PUBLIC;
		var div=Div.creatNew();
		var errorTipDiv=Div.creatNew();
		var e_inherit=function(TABLE_ID){};

		(function(){
			div.addClass('col-xs-12');	
			div.setAttribute("style","padding-top:15px;padding-left:0px;padding-right:0px");

			if(isPublic){
				var visibilityState="公开的";
			}
			else{
				var visibilityState="私有的";
			}
			var tableInfoDiv=Div.creatNew();
			tableInfoDiv.setAttribute("style","padding-top:6px;");
			tableInfoDiv.addClass('col-xs-8');
			tableInfoDiv.html("<a href=\"http://localhost/?r=Table/TableInfo&tableId="+tableId+"\">"+tableName+"("+visibilityState+")</a>");
			tableInfoDiv.appendTo(div.ui);

			if(IS_PUBLIC){
				var inheritBtn=Div.creatNew();
				inheritBtn.addClass('col-xs-2 btn');
				inheritBtn.setAttribute("style","color: cornflowerblue;");
				inheritBtn.html("继承");
				inheritBtn.appendTo(div.ui);
				inheritBtn.ui.bind("click",function(){
					var def=e_inherit(tableId);
					errorTipDiv.html("");
					def.fail(function(ERROR_CODE){
						if(ERROR_CODE == -1){
							errorTipDiv.html("未知的错误");
						}
						else if(ERROR_CODE == -2){
							errorTipDiv.html("已继承该表");
						}
						else if(ERROR_CODE == -3){
							errorTipDiv.html("循环继承错误，</br>\""+tableName+"\"存在于您的子表链上，您无法继承它");
						}
					});
				});
			}

			errorTipDiv.addClass('col-xs-12 text-danger');
			errorTipDiv.appendTo(div.ui);
		})();

		InheritSearchResult.getUI=function(){
			return div.ui;
		}

		InheritSearchResult.onInherit=function(CALL_BACK){
			e_inherit=CALL_BACK;
		}

		return InheritSearchResult;
	}
}

