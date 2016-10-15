
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/dropdown/DropDown.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/span/Span.js"+'">' + '</script>');


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
		var ndiv=Div.creatNew();
		var tableItemInheritEdit=TableItemInheritEdit.creatNew();
		var e_changName=function(TABLE_NAME){return $.Deferred();};
		var e_deprecated=function(){return $.Deferred();};
		var e_cancelAttention=function(){return $.Deferred();};
		var e_open=function(){return $.Deferred();};
		var e_inherit=function(TABLE_ID){return $.Deferred();};
		var e_searchTable=function(TABLE_ID){return $.Deferred();};
		var e_openFollowerList=function(){};

		(function(){
			ndiv.addClass("row correction-row-css deep-background-on-hover col-xs-12");
			ndiv.setAttribute("style","padding-top:6px;padding-bottom:6px;");

			var tableNameScope=Div.creatNew();
			tableNameScope.addClass('col-xs-8');
			tableNameScope.setAttribute("style","padding-top:6px;");
			tableNameScope.html(tableName+" ("+tableId+") "+"("+(IS_PUBLIC==true? "公开的":"私有的")+") ");
			spanOfBelong(IS_CREATOR,IS_ATTENTION).appendTo(tableNameScope.ui);
			tableNameScope.appendTo(ndiv.ui);

			var dropDownDiv=Div.creatNew();
			dropDownDiv.addClass("col-xs-offset-2 col-xs-2");
			dropDownDiv.appendTo(ndiv.ui);
			var dropDown=DropDown.creatNew("<span class=\"glyphicon glyphicon-cog\"></span>");
			dropDown.appendTo(dropDownDiv.ui);
			
			if(isCreator){
				dropDown.addMenuItem(getChangeTableNameBtn());
				dropDown.addMenuItem(getDeprecatedBtn());
				dropDown.addMenuItem(getInheritBtn());
				dropDown.addMenuItem(getOpenFollowerListBtn());
				if(!isPublic){
					dropDown.addMenuItem(getOpenTableBtn());
				}
			}
			else if(isAttention){
				dropDown.addMenuItem(getCancelAttentionBtn());
			}
			else{
				dropDownDiv.hide();
			}
			ndiv.ui.appendTo(div.ui);

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









/**
 * TableItemDisplay(tableId,tableName,isCreator,isPublic,isAttention)
 * 		getUI()
 * 		show()
 * 		hide()
 * 		
 * 		onClickInherit()
 * 		
 * 		onChangeName(CALL_BACK())	//返回Deferred对象
 * 		onDeprecated(CALL_BACK())	//返回Deferred对象
 * 		onCancelAttention(CALL_BACK())	//返回Deferred对象
 * 		onOpen(CALL_BACK())			//返回Deferred对象
 * 		onOpenFollowerList(CALL_BACK())
 */
// var TableItemDisplay={
// 	creatNew:function(TABLE_ID,TABLE_NAME,IS_CREATOR,IS_PUBLIC,IS_ATTENTION){
// 		var TableItemDisplay={};

// 		var logNameInpChangeNickName=$("#log_name_inp_changeNickName");
// 		var createInpParentChangeNickName=$("#create_inp_parent_changeNickName");
// 		var changeNickNameSaveBtn=$("#changeNickName_save_btn");
// 		var changeNickNameModal=$("#changeNickName_modal");
// 		var checkActionBtn=$("#checkAction_btn");
// 		var checkActionModal=$("#checkAction_Modal");
// 		var checkActionContent=$("#checkAction_Content");
// 		var tableName=TABLE_NAME;
// 		var tableId=TABLE_ID;
// 		var isCreator=IS_CREATOR;
// 		var isPublic=IS_PUBLIC;
// 		var isAttention=IS_ATTENTION;
// 		var div=Div.creatNew();
// 		var e_changName=function(){return $.Deferred();};
// 		var e_deprecated=function(){return $.Deferred();};
// 		var e_cancelAttention=function(){return $.Deferred();};
// 		var e_open=function(){return $.Deferred();};
// 		var e_inherit=function(){};
// 		var e_openFollowerList=function(){};

// 		(function(){
// 			div.addClass("row correction-row-css deep-background-on-hover col-xs-12");
// 			div.setAttribute("style","padding-top:6px;padding-bottom:6px;");

// 			var tableNameScope=Div.creatNew();
// 			tableNameScope.addClass('col-xs-8');
// 			tableNameScope.setAttribute("style","padding-top:6px;");
// 			tableNameScope.html(tableName+" ("+tableId+") "+"("+(IS_PUBLIC==true? "公开的":"私有的")+") ");
// 			spanOfBelong(IS_CREATOR,IS_ATTENTION).appendTo(tableNameScope.ui);
// 			tableNameScope.appendTo(div.ui);

// 			var dropDownDiv=Div.creatNew();
// 			dropDownDiv.addClass("col-xs-offset-2 col-xs-2");
// 			dropDownDiv.appendTo(div.ui);
// 			var dropDown=DropDown.creatNew("<span class=\"glyphicon glyphicon-cog\"></span>");
// 			dropDown.appendTo(dropDownDiv.ui);
			
// 			if(isCreator){
// 				dropDown.addMenuItem(getChangeTableNameBtn());
// 				dropDown.addMenuItem(getDeprecatedBtn());
// 				dropDown.addMenuItem(getInheritBtn());
// 				dropDown.addMenuItem(getOpenFollowerListBtn());
// 				if(!isPublic){
// 					dropDown.addMenuItem(getOpenTableBtn());
// 				}
// 			}
// 			else if(isAttention){
// 				dropDown.addMenuItem(getCancelAttentionBtn());
// 			}
// 			else{
// 				dropDownDiv.hide();
// 			}
// 		})();

// 		function spanOfBelong(IS_CREATOR,IS_ATTENTION){
// 			var span=Span.creatNew();
// 			span.setAttribute("aria-hidden",true);
// 			span.setAttribute("data-toggle","tooltip");
// 			span.setAttribute("data-placement","right");
// 			if(IS_CREATOR){
// 				span.addClass('glyphicon glyphicon-user');
// 				span.setAttribute("data-original-title","自建");
// 				span.ui.tooltip();
// 				return span.ui;
// 			}
// 			else if(IS_ATTENTION){
// 				span.addClass('glyphicon glyphicon-eye-open');
// 				span.setAttribute("data-original-title","关注");
// 				span.ui.tooltip();
// 				return span.ui;
// 			}
// 			return span.ui;
// 		}

// 		function getChangeTableNameBtn(){
// 			var btn=DropDownItemButton.creatNew();
// 			btn.html("修改名称");
// 			btn.onClickListener(function(){
// 				logNameInpChangeNickName.val(tableName);
// 				changeNickNameSaveBtn.unbind().bind("click",function(){
// 					if(logNameInpChangeNickName.val().length>12 || logNameInpChangeNickName.val().length==0){
// 						createInpParentChangeNickName.addClass("has-error");
// 					}
// 					else{
// 						e_changName(logNameInpChangeNickName.val());
// 					}
// 				});
// 				changeNickNameModal.modal('show');
// 			});

// 			return btn;
// 		}

// 		function getDeprecatedBtn(){
// 			var btn=DropDownItemButton.creatNew();
// 			btn.html("弃用此表");
// 			btn.onClickListener(function(){
// 				checkActionContent.html("您确定要弃用\""+tableName+"\"吗？");
// 				checkActionBtn.unbind().bind("click",function(){
// 					e_deprecated();
// 				});
// 				checkActionModal.modal("show");
// 			});

// 			return btn;
// 		}

// 		function getCancelAttentionBtn(){
// 			var btn=DropDownItemButton.creatNew();
// 			btn.html("取消关注");
// 			btn.onClickListener(function(){
// 				checkActionContent.html("您确定要取消关注\""+tableName+"\"吗？");
// 				checkActionBtn.unbind().bind("click",function(){
// 					e_cancelAttention();
// 				});
// 				checkActionModal.modal("show");
// 			});
// 			return btn;
// 		}

// 		function getOpenTableBtn(){
// 			var btn=DropDownItemButton.creatNew();
// 			btn.html("公开此表");
// 			btn.onClickListener(function(){
// 				checkActionContent.html("您确定要公开\""+tableName+"\"吗？(公开后将无法再设为私有)");
// 				checkActionBtn.unbind().bind("click",function(){
// 					e_open();
// 				});
// 				checkActionModal.modal("show");
// 			});
// 			return btn;
// 		}

// 		function getInheritBtn(){
// 			var btn=DropDownItemButton.creatNew();
// 			btn.html("继承其他表");
// 			btn.onClickListener(function(){
// 				e_inherit();
// 			});
// 			return btn;
// 		}

// 		function getOpenFollowerListBtn(){
// 			var btn=DropDownItemButton.creatNew();
// 			btn.html("关注者&管理者");
// 			btn.onClickListener(function(){
// 				e_openFollowerList();
// 			});
// 			return btn;
// 		}

// 		TableItemDisplay.getUI=function(){
// 			return div.ui;
// 		}

// 		TableItemDisplay.show=function(){
// 			div.removeClass('hode');
// 		}

// 		TableItemDisplay.hide=function(){
// 			div.addClass('hide');
// 		}

// 		TableItemDisplay.onChangeName=function(CALL_BACK){
// 			e_changName=CALL_BACK;
// 		}

// 		TableItemDisplay.onDeprecated=function(CALL_BACK){
// 			e_deprecated=CALL_BACK;
// 		}

// 		TableItemDisplay.onOpen=function(CALL_BACK){
// 			e_open=CALL_BACK;
// 		}

// 		TableItemDisplay.onCancelAttention=function(CALL_BACK){
// 			e_cancelAttention=CALL_BACK;
// 		}

// 		TableItemDisplay.onClickInherit=function(CALL_BACK){
// 			e_inherit=CALL_BACK;
// 		}

// 		TableItemDisplay.onOpenFollowerList=function(CALL_BACK){
// 			e_openFollowerList=CALL_BACK;
// 		}

// 		return TableItemDisplay;
// 	}
// }




