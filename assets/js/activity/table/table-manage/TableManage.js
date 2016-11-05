
minclude("LoaderPiano");
minclude("Div");
minclude("Button");
minclude("Alerts");
minclude("DropDown");
minclude("Dl");

function host(){
	var logNameInpCreat=$("#log_name_inp");
	var logNameInpParentCreat=$("#create_inp_parent");
	var createBtn=$("#create_btn");
	var tableListBlock=TableListBlock.creatNew();

	tableListBlock.flashTableList();

	$("#create_modal").on('show.bs.modal',function(e){
		logNameInpCreat.val("");
		logNameInpParentCreat.removeClass("has-error");
		createBtn.unbind().bind("click",function(){
			if(logNameInpCreat.val().length>12 || logNameInpCreat.val().length==0){
				logNameInpParentCreat.addClass("has-error");
			}
			else{
				var createLogTable=CreateLogTable.creatNew(logNameInpCreat.val());
				createLogTable.onSuccessLisenter(function(data){
					if(data==0){
						$("#create_modal").modal('hide');
						tableListBlock.flashTableList();
					}
				});
				createLogTable.launch();
			}
		});
	});

}












var TableListBlock={
	creatNew:function(){
		var TableListBlock={};

		var tableListMine=$("#table_list_mine");
		var tableListAnother=$("#table_list_another");
		var logNameInpChangeNickName=$("#log_name_inp_changeNickName");
		var createInpParentChangeNickName=$("#create_inp_parent_changeNickName");
		var changeNickNameSaveBtn=$("#changeNickName_save_btn");
		var changeNickNameModal=$("#changeNickName_modal");
		var checkActionBtn=$("#checkAction_btn");
		var checkActionModal=$("#checkAction_Modal");
		var checkActionContent=$("#checkAction_Content");
		var getLogTableAryByInternet=GetLogTableAryByInternet.creatNew();


		changeNickNameModal.on('show.bs.modal',function(e){
			createInpParentChangeNickName.removeClass("has-error");
		});

		TableListBlock.flashTableList=function(){
			tableListMine.empty();
			tableListAnother.empty();

			getLogTableAryByInternet.launch(function(ARY){
				$.each(ARY,function(index,value){
					var tableListItem=TableListItem.creatNew(value);
					if(value.isMaster())
						tableListItem.getItemUI().appendTo(tableListMine);
					else
						tableListItem.getItemUI().appendTo(tableListAnother);
					// makeTableListItem(value);
				});
				$("span").tooltip();
				Alerts.creatNew(true,"列表刷新完成",$("#tab_manage_firstRow"));
			},function(){

			});
		}

		var TableListItem={
			creatNew:function(LOG_TABLE){
				var TableListItem={};

				TableListItem.getItemUI=function(){
					return makeTableListItem();
				}

				function makeTableListItem(){
					var div=FadeDiv.creatNew();

					div.addClass("row correction-row-css deep-background-on-hover btn col-xs-12");
					div.setAttribute("style","padding-top:10px;padding-bottom:10px;");
					div.ui.bind("click",function(){
						window.location.href="?r=Table/TableInfo&tableId="+LOG_TABLE.getLogTableId();
					});
					
					getIdBlock(LOG_TABLE.getLogTableId()).appendTo(div.ui);
					getTableNameBlock(LOG_TABLE.getLogTableAnotherName()).appendTo(div.ui);
					getTableStateBlock(LOG_TABLE.isMaster()).appendTo(div.ui);
					// getBelongBlock(LOG_TABLE.isMaster(LOG_TABLE)).appendTo(div.ui);
					getVisibilityStateBlock(LOG_TABLE.isPublicTable()).appendTo(div.ui);
					// getDropDownBlock(LOG_TABLE).appendTo(div.ui);

					div.show();
					return div;
				}

				function getIdBlock(ID){
					var idDiv=Div.creatNew();
					idDiv.addClass("col-xs-1 table-list-text-css");
					idDiv.html(ID);
					return idDiv;
				}

				function getTableNameBlock(TABLE_NAME){
					var tableNameDiv=Div.creatNew();
					tableNameDiv.addClass("col-xs-2 table-list-text-css");
					tableNameDiv.html(TABLE_NAME);
					return tableNameDiv;
				}

				function getTableStateBlock(TABLE_STATE){
					var tableStateDiv=Div.creatNew();
					tableStateDiv.addClass("col-xs-2 table-list-text-css");
					if(TABLE_STATE){
						tableStateDiv.html("<span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"自建\"></span>");
					}
					else{
						tableStateDiv.html("<span class=\"glyphicon glyphicon-eye-open\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"关注\"></span>");
					}
					return tableStateDiv;
				}

				function getBelongBlock(IS_MASTER){
					var belongDiv=Div.creatNew();
					belongDiv.addClass("col-xs-2 table-list-text-css");
					if(IS_MASTER){
						belongDiv.html("<span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\"></span>");
					}
					else{
						belongDiv.html("<span class=\"glyphicon glyphicon-star-empty\" aria-hidden=\"true\"></span>");
					}
					return belongDiv;
				}

				function getVisibilityStateBlock(IS_PUBLIC_TABLE){
					var visibilityState=Div.creatNew();
					visibilityState.addClass("col-xs-2 table-list-text-css");
					if(IS_PUBLIC_TABLE)
						visibilityState.html("公开的");
					else
						visibilityState.html("私有的");
					return visibilityState;
				}

				function getDropDownBlock(){
					var dropDownDiv=Div.creatNew();
					var dropDown=DropDown.creatNew("tableDropDown"+LOG_TABLE.getLogTableId(),"<span class=\"glyphicon glyphicon-cog\"></span>");
					dropDownDiv.addClass("col-xs-offset-4 col-xs-1");

					addDropDownItem(dropDown);
					dropDown.appendTo(dropDownDiv.ui);
					return dropDownDiv;
				}

				function addDropDownItem(DROP_DOWN){
					if(LOG_TABLE.isMaster()){
						DROP_DOWN.addMenuItem(getChangeNickNameBtn_Y());
						if(!LOG_TABLE.isPublicTable())
							DROP_DOWN.addMenuItem(getOpenTableBtn());
						DROP_DOWN.addMenuItem(getDeprecatedBtn());
					}
					else{
						DROP_DOWN.addMenuItem(getChangeNickNameBtn_N());
						DROP_DOWN.addMenuItem(getCancelAttentionBtn());
					}
				}

				function getChangeNickNameBtn_N(){
					var btn=DropDownItemButton.creatNew();
					btn.html("修改名称");
					btn.onClickListener(function(){
						logNameInpChangeNickName.val(LOG_TABLE.getLogTableAnotherName());
						changeNickNameSaveBtn.unbind().bind("click",function(){
							if(logNameInpChangeNickName.val().length>12 || logNameInpChangeNickName.val().length==0){
								createInpParentChangeNickName.addClass("has-error");
							}
							else{
								var changeTableAnotherName=ChangeTableAnotherName.creatNew(LOG_TABLE.getLogTableId(),logNameInpChangeNickName.val());
								changeTableAnotherName.onSuccessLisenter(function(data){
									if(data == 0){
										changeNickNameModal.modal('hide');
										TableListBlock.flashTableList();
									}
								});
								changeTableAnotherName.launch();
							}
						});
						changeNickNameModal.modal('show');
					});

					return btn;
				}

				function getChangeNickNameBtn_Y(){
					var btn=DropDownItemButton.creatNew();
					btn.html("修改名称");
					btn.onClickListener(function(){
						logNameInpChangeNickName.val(LOG_TABLE.getLogTableAnotherName());
						changeNickNameSaveBtn.unbind().bind("click",function(){
							if(logNameInpChangeNickName.val().length>12 || logNameInpChangeNickName.val().length==0){
								createInpParentChangeNickName.addClass("has-error");
							}
							else{
								var changeTableName=ChangeTableName.creatNew(LOG_TABLE.getLogTableId(),logNameInpChangeNickName.val());
								changeTableName.onSuccessLisenter(function(data){
									if(data == 0){
										changeNickNameModal.modal('hide');
										TableListBlock.flashTableList();
									}
								});
								changeTableName.launch();
							}
						});
						changeNickNameModal.modal('show');
					});

					return btn;
				}

				function getDeprecatedBtn(){
					var btn=DropDownItemButton.creatNew();
					btn.html("弃用");
					btn.onClickListener(function(){
						checkActionContent.html("您确定要弃用\""+LOG_TABLE.getLogTableAnotherName()+"\"吗？");
						checkActionBtn.unbind().bind("click",function(){
							var deprecatedTable=DeprecatedTable.creatNew(LOG_TABLE.getLogTableId());
							deprecatedTable.onSuccessLisenter(function(data){
								if(data==0){
									checkActionModal.modal('hide');
									TableListBlock.flashTableList();
								}
							});
							deprecatedTable.launch();
						});
						checkActionModal.modal("show");
					});

					return btn;
				}

				function getCancelAttentionBtn(){
					var btn=DropDownItemButton.creatNew();
					btn.html("取消关注");
					btn.onClickListener(function(){
						checkActionContent.html("您确定要取消关注\""+LOG_TABLE.getLogTableAnotherName()+"\"吗？");
						checkActionBtn.unbind().bind("click",function(){
							var cancelAttention=CancelAttention.creatNew(LOG_TABLE.getLogTableId());
							cancelAttention.onSuccessLisenter(function(data){
								if(data==0){
									checkActionModal.modal('hide');
									TableListBlock.flashTableList();
								}
							});
							cancelAttention.launch();
						});
						checkActionModal.modal("show");
					});
					return btn;
				}

				function getOpenTableBtn(){
					var btn=DropDownItemButton.creatNew();
					btn.html("公开该日程");
					btn.onClickListener(function(){
						checkActionContent.html("您确定要公开\""+LOG_TABLE.getLogTableAnotherName()+"\"吗？(公开后将无法再设为私有)");
						checkActionBtn.unbind().bind("click",function(){
							var openTheTable=OpenTheTable.creatNew(LOG_TABLE.getLogTableId());
							openTheTable.onSuccessLisenter(function(data){
								if(data==0){
									checkActionModal.modal('hide');
									TableListBlock.flashTableList();
								}
							});
							openTheTable.launch();
						});
						checkActionModal.modal("show");
					});
					return btn;
				}

				return TableListItem;
			}
		}

		return TableListBlock;
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
						logTable.setLogTableAnotherName(item.tableName);
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



/**
 * LogTable
 * 		日程表：logTable		（数据结构）
		日程使用者ID：logTableUserId	（字段）
		日程表ID：logTableId		（字段）
		日程表创建者ID：logTableCreatorId	（字段）
		日程表别名：logTableAnotherName	（字段）
		日程表状态：logTableState	（字段）
		日程表可见性状态：logTableVisibilityState	（字段）
		
 * 
 */
var LogTable={
	creatNew:function(){
		var LogTable={};
		
		var logTableUserId;
		var logTableId;
		var logTableName;
		var logTableAnotherName;
		var logTableCreatorId;
		var logTableState;
		var logTableVisibilityState;


		LogTable.setLogTableUserId=function(LOG_TABLE_USER_ID){
			logTableUserId=LOG_TABLE_USER_ID;
		}

		LogTable.getLogTableUserId=function(){
			return logTableUserId;
		}

		LogTable.setLogTableId=function(LOG_TABLE_ID){
			logTableId=LOG_TABLE_ID;
		}

		LogTable.getLogTableId=function(){
			return Number(logTableId);
		}

		LogTable.setLogTableName=function(LOG_TABLE_NAME){
			logTableName=LOG_TABLE_NAME;
		}

		LogTable.getLogTableName=function(){
			return logTableName;
		}

		LogTable.setLogTableAnotherName=function(LOG_TABLE_ANOTHER_NAME){
			logTableAnotherName=LOG_TABLE_ANOTHER_NAME;
		}

		LogTable.getLogTableAnotherName=function(){
			return logTableAnotherName;
		}

		LogTable.setLogTableCreatorId=function(LOG_TABLE_CREATOR_ID){
			logTableCreatorId=LOG_TABLE_CREATOR_ID;
		}

		LogTable.getLogTableCreatorId=function(){
			return logTableCreatorId;
		}

		LogTable.setLogTableState=function(LOG_TABLE_STATE){
			logTableState=LOG_TABLE_STATE;
		}

		LogTable.getLogTableState=function(){
			return Number(logTableState);
		}

		LogTable.setLogTableVisibilityState=function(LOG_TABLE_VISIBILITY_STATE){
			logTableVisibilityState=LOG_TABLE_VISIBILITY_STATE
		}

		LogTable.getLogTableVisibilityState=function(){
			return Number(logTableVisibilityState);
		}

		LogTable.isMaster=function(){
			return logTableUserId==logTableCreatorId;
		}

		LogTable.isPublicTable=function(){
			return logTableVisibilityState==1;
		}


		return LogTable;
	}
}

/**
 * LogTransaction
 * 		日程事务：logTransaction	（数据结构）
 * 		日程ID：logTransactionId	（字段）
		日程内容：logTransactionContent	（字段）
		日程时间：logTransactionTime	（字段）
 */
var LogTransaction={
	creatNew:function(){
		var LogTransaction=LogTable.creatNew();

		var logTransactionContent;
		var logTransactionTime;
		var logTransactionId;

		LogTransaction.setLogTransactionId=function(LOG_TRANSACTION_ID){
			logTransactionId=LOG_TRANSACTION_ID;
		}

		LogTransaction.getLogTransactionId=function(){
			return Number(logTransactionId);
		}

		LogTransaction.setLogTransactionContent=function(LOG_TRANSACTION_CONTENT){
			logTransactionContent=LOG_TRANSACTION_CONTENT;
		}

		LogTransaction.getLogTransactionContent=function(){
			return logTransactionContent;
		}

		LogTransaction.setLogTransactionTime=function(LOG_TRANSACTION_TIME){
			logTransactionTime=LOG_TRANSACTION_TIME;
		}

		LogTransaction.getLogTransactionTime=function(){
			return Number(logTransactionTime);
		}

		return LogTransaction;
	}
}







	// var searchInput=$("#search_input");
	// var searchLoaderScope=$("#loaderScope");
	// var searchButton=$("#search_button");
	// var searchResultScope=$("#search_result");
	// $('a[data-toggle="tab"]').on('shown.bs.tab',function(e){
	// 	var target=$(e.target).attr("href");	//刚刚被打开的tab的id
	// 	if(target == "#tab_manage"){
	// 		tableListBlock.flashTableList();
	// 	}
	// });	

	// $('a[data-toggle="tab"]').on('hidden.bs.tab',function(e){
	// 	var target=$(e.target).attr("href");	//刚刚被关闭的tab的id
	// 	if(target == "#tab_manage"){
	// 		// $("#table_list").empty();
	// 	}
	// });
	// 
	// 
	// searchInput.keydown(function(e){
	// 	clearSearchScope();
	// 	if(e.keyCode == 13){
	// 		search();
	// 	}
	// });

	// searchButton.on("click",function(){
	// 	clearSearchScope();
	// 	search();
	// });

	// function clearSearchScope(){
	// 	searchLoaderScope.html("");
	// 	searchResultScope.empty();
	// }

	// function search(){
	// 	var loaderPiano=LoaderPiano.creatNew();
	// 	loaderPiano.appendTo(searchLoaderScope);
	// 	var searchTableByTableId=SearchTableByTableId.creatNew(searchInput.val());
	// 	searchTableByTableId.onSuccessLisenter(function(data){
	// 		loaderPiano.remove();
	// 		if(data==0){
	// 			searchLoaderScope.html("未搜索到该节点.");
	// 		}
	// 		else{
	// 			var searchData=SearchData.creatNew();
	// 			searchData.setLogTableId(data.id);
	// 			searchData.setLogTableCreatorId(data.creatorId);
	// 			searchData.setLogTableName(data.tableName);
	// 			searchData.setLogTableState(data.tableState);
	// 			searchData.setIsAttention(data.isAttention);
	// 			searchData.setIsMine(data.isMine == 1 ? true:false);
	// 			TableSearchBlock.creatNew(searchData).getSearchBlock().appendTo(searchResultScope);
	// 		}
	// 	});
	// 	searchTableByTableId.launch();
	// }



// var SearchData={
// 	creatNew:function(){
// 		var SearchData=LogTable.creatNew();

// 		var isAttention;
// 		var isMine;

// 		SearchData.setIsAttention=function(IS_ATTENTION){
// 			isAttention=IS_ATTENTION;
// 		}

// 		SearchData.getIsAttention=function(){
// 			return isAttention;
// 		}

// 		SearchData.setIsMine=function(IS_MINE){
// 			isMine=IS_MINE;
// 		}

// 		SearchData.isMine=function(){
// 			return isMine;
// 		}

// 		return SearchData;
// 	}
// }

// var TableSearchBlock={
// 	creatNew:function(SEARCH_DATA){
// 		var TableSearchBlock={};

// 		var logTableId;
// 		var logTableName;
// 		var logTableState;
// 		var logTableCreatorId;
// 		var isMine;
// 		var isAttention;

// 		var divBox=Div.creatNew();
// 		var divLeft=Div.creatNew();
// 		var divRight=Div.creatNew();
		
// 		init();
		
// 		TableSearchBlock.getSearchBlock=function(){
// 			return divBox;
// 		}

// 		function init(){
// 			logTableId=SEARCH_DATA.getLogTableId();
// 			logTableName=SEARCH_DATA.getLogTableName();
// 			logTableState=SEARCH_DATA.getLogTableState();
// 			logTableCreatorId=SEARCH_DATA.getLogTableCreatorId();
// 			isMine=SEARCH_DATA.isMine();
// 			isAttention=SEARCH_DATA.getIsAttention();

// 			divBox.addClass("row");
// 			divBox.setAttribute("style","background-color:#E9EBEE");
// 			divLeft.addClass("col-xs-8");
// 			divRight.addClass("col-xs-4");
// 			makeSearchResultLeftContent().appendTo(divLeft.ui);
// 			makeSearchResultRightContent().appendTo(divRight.ui);
// 			divLeft.appendTo(divBox.ui);
// 			divRight.appendTo(divBox.ui);
// 		}

// 		function makeSearchResultLeftContent(){
// 			var dl=Dl.creatNew();
// 			dl.addClass("dl-horizontal");
// 			dl.setAttribute("style","margin-top:20px");

// 			var tableIdDt=Dt.creatNew();
// 			var tableNameDt=Dt.creatNew();
// 			var tableStateDt=Dt.creatNew();
// 			setDtStyle(tableIdDt);
// 			setDtStyle(tableNameDt);
// 			setDtStyle(tableStateDt);
// 			tableIdDt.html("节点ID");
// 			tableNameDt.html("节点名称");
// 			tableStateDt.html("日程状态");

// 			var tableIdDd=Dd.creatNew();
// 			var tableNameDd=Dd.creatNew();
// 			var tableStateDd=Dd.creatNew();
// 			setDdStyle(tableIdDd);
// 			setDdStyle(tableNameDd);
// 			setDdStyle(tableStateDd);
// 			tableIdDd.html(logTableId);
// 			tableNameDd.html(logTableName);
// 			switch(logTableState){
// 				case 1:
// 					tableStateDd.addClass("text-success");
// 					tableStateDd.html("<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> 使用中");
// 					break;
// 				case 0:
// 					tableStateDd.addClass("text-danger");
// 					tableStateDd.html("<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span> 已弃用");
// 					break;
// 			}

// 			tableIdDt.appendTo(dl.ui);
// 			tableIdDd.appendTo(dl.ui);
// 			tableNameDt.appendTo(dl.ui);
// 			tableNameDd.appendTo(dl.ui);
// 			// tableStateDt.appendTo(dl.ui);
// 			// tableStateDd.appendTo(dl.ui);

// 			return dl;
// 		}

// 		function setDtStyle(DT){
// 			DT.setAttribute("style","width:80px");
// 		}

// 		function setDdStyle(DD){
// 			DD.setAttribute("style","margin-left:100px;");
// 		}

// 		function makeSearchResultRightContent(){
// 			var div=Div.creatNew();
// 			div.addClass("text-center");
// 			div.setAttribute("style","margin-top:32px;");

// 			if(!isMine){
// 				attentionButton().appendTo(div.ui);
// 			}

// 			return div;
// 		}

// 		function attentionButton(){
// 			var btn=Button.creatNew();
// 			btn.addClass("btn btn-primary");
// 			if(isAttention){
// 				btn.html("已关注");
// 			}
// 			else{
// 				btn.html("关注");
// 				btn.onClickListener(onAttentionButtonClickListener);
// 			}
// 			return btn;
// 		}

// 		function onAttentionButtonClickListener(CONTENT){
// 			var payAttentionToLogTable=PayAttentionToLogTable.creatNew(logTableId);
// 			payAttentionToLogTable.onSuccessLisenter(function(data){
// 				if(data == 1){
// 					CONTENT.html("已关注");
// 					CONTENT.unbind();
// 				}
// 			});
// 			payAttentionToLogTable.launch();
// 		}

// 		return TableSearchBlock;
// 	}
// }



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


minclude("Ui");

var Div={
	creatNew:function(){
		var Div=Ui.creatNew($("<div></div>"));

		return Div;
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












minclude("FadeDiv");
/*
父元素使用position:relative，Alerts的显示域使用position:absolute，并用top，bottom等值控制它的位置，就能实现
alerts在任意位置上显示
 */
var Alerts={
	creatNew:function(MODE,CONTENT,SCOPE){
		var div=FadeDiv.creatNew();

		if(MODE)
			div.addClass("alert alert-success");
		else
			div.addClass("alert alert-warning");

		div.addClass("correction-alerts");
		div.html(CONTENT);
		div.appendTo(SCOPE);
		div.show();
		setTimeout(function(){
			div.hide();
		}, 2000);
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

var Dl={
	creatNew:function(){
		var Dl=Ui.creatNew($("<dl></dl>"));

		return Dl;
	}
}

var Dt={
	creatNew:function(){
		var Dt=Ui.creatNew($("<dt></dt>"));

		return Dt;
	}
}

var Dd={
	creatNew:function(){
		var Dd=Ui.creatNew($("<dd></dd>"));

		return Dd;
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

var FadeDiv={
	creatNew:function(){
		var FadeDiv=Div.creatNew();

		FadeDiv.addClass("fadeIn animated correction-animated-css hide");
		
		FadeDiv.show=function(){
			FadeDiv.removeClass('hide');
		}

		FadeDiv.hide=function(){
			FadeDiv.addClass("fadeOut");
			FadeDiv.one("animationend",function(){
				FadeDiv.addClass('hide');
			});
		}

		return FadeDiv;
	}
}


minclude("Ui");

var Ul={
	creatNew:function(){
		var Ul=Ui.creatNew($("<ul></ul>"));

		return Ul;
	}
}



















