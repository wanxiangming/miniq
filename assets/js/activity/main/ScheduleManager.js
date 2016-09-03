document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/alerts/Alerts.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/dropdown/DropDown.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/dl/Dl.js"+'">' + '</script>');

function host(){
	var logNameInpCreat=$("#log_name_inp");
	var logNameInpParentCreat=$("#create_inp_parent");
	var createBtn=$("#create_btn");
	var searchInput=$("#search_input");
	var searchLoaderScope=$("#loaderScope");
	var searchButton=$("#search_button");
	var searchResultScope=$("#search_result");
	var tableListBlock=TableListBlock.creatNew();

	$('a[data-toggle="tab"]').on('shown.bs.tab',function(e){
		var target=$(e.target).attr("href");	//刚刚被打开的tab的id
		if(target == "#tab_manage"){
			tableListBlock.flashTableList();
		}
	});	

	$('a[data-toggle="tab"]').on('hidden.bs.tab',function(e){
		var target=$(e.target).attr("href");	//刚刚被关闭的tab的id
		if(target == "#tab_manage"){
			// $("#table_list").empty();
		}
	});

	$("#create_modal").on('show.bs.modal',function(e){
		logNameInpCreat.val("");
		logNameInpParentCreat.removeClass("has-error");
		createBtn.unbind().bind("click",function(){
			if(logNameInpCreat.val().length>12 || logNameInpCreat.val().length==0){
				logNameInpParentCreat.addClass("has-error");
			}
			else{
				var createLogTable=CreateLogTable.creatNew(logNameInpCreat.val(),openId);
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

	searchInput.keydown(function(e){
		clearSearchScope();
		if(e.keyCode == 13){
			search();
		}
	});

	searchButton.on("click",function(){
		clearSearchScope();
		search();
	});

	function clearSearchScope(){
		searchLoaderScope.html("");
		searchResultScope.empty();
	}

	function search(){
		var loaderPiano=LoaderPiano.creatNew();
		loaderPiano.appendTo(searchLoaderScope);
		var searchTableByTableId=SearchTableByTableId.creatNew(openId,searchInput.val());
		searchTableByTableId.onSuccessLisenter(function(data){
			loaderPiano.remove();
			if(data==0){
				searchLoaderScope.html("未搜索到该日程表.");
			}
			else{
				var searchData=SearchData.creatNew();
				searchData.setLogTableId(data.id);
				searchData.setLogTableCreatorId(data.creatorId);
				searchData.setLogTableName(data.tableName);
				searchData.setLogTableState(data.tableState);
				searchData.setIsAttention(data.isAttention);
				TableSearchBlock.creatNew(searchData).getSearchBlock().appendTo(searchResultScope);
			}
		});
		searchTableByTableId.launch();
	}
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
		var getLogTableAryByInternet=GetLogTableAryByInternet.creatNew(openId);


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
				Alerts.creatNew(true,"更新列表完成。",$("#tab_manage_firstRow"));
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

					div.addClass("row correction-row-css deep-background-on-hover");
					div.setAttribute("style","padding-top:10px;padding-bottom:10px;");
					
					getIdBlock(LOG_TABLE.getLogTableId()).appendTo(div.ui);
					getTableNameBlock(LOG_TABLE.getLogTableAnotherName()).appendTo(div.ui);
					getTableStateBlock(LOG_TABLE.getLogTableState()).appendTo(div.ui);
					// getBelongBlock(LOG_TABLE.isMaster(LOG_TABLE)).appendTo(div.ui);
					getVisibilityStateBlock(LOG_TABLE.isMaster(),LOG_TABLE.isPublicTable()).appendTo(div.ui);
					getDropDownBlock(LOG_TABLE).appendTo(div.ui);

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
					switch(TABLE_STATE){
						case 1:
							tableStateDiv.addClass("text-success");
							tableStateDiv.html("<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> 使用中");
							break;
						case 0:
							tableStateDiv.addClass("text-danger");
							tableStateDiv.html("<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span> 已弃用");
							break;
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

				function getVisibilityStateBlock(IS_MASTER,IS_PUBLIC_TABLE){
					var visibilityState=Div.creatNew();
					visibilityState.addClass("col-xs-2 table-list-text-css");
					if(IS_MASTER){
						if(IS_PUBLIC_TABLE)
							visibilityState.html("公开的");
						else
							visibilityState.html("私有的");
					}
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
								var changeTableAnotherName=ChangeTableAnotherName.creatNew(openId,LOG_TABLE.getLogTableId(),logNameInpChangeNickName.val());
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
								var changeTableName=ChangeTableName.creatNew(openId,LOG_TABLE.getLogTableId(),logNameInpChangeNickName.val());
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
							var deprecatedTable=DeprecatedTable.creatNew(openId,LOG_TABLE.getLogTableId());
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
							var cancelAttention=CancelAttention.creatNew(openId,LOG_TABLE.getLogTableId());
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





var SearchData={
	creatNew:function(){
		var SearchData=LogTable.creatNew();

		var isAttention;

		SearchData.setIsAttention=function(IS_ATTENTION){
			isAttention=IS_ATTENTION;
		}

		SearchData.getIsAttention=function(){
			return Number(isAttention);
		}

		return SearchData;
	}
}

var TableSearchBlock={
	creatNew:function(SEARCH_DATA){
		var TableSearchBlock={};

		var logTableId;
		var logTableName;
		var logTableState;
		var logTableCreatorId;
		var isMine;
		var isAttention;

		var divBox=Div.creatNew();
		var divLeft=Div.creatNew();
		var divRight=Div.creatNew();
		
		init();
		
		TableSearchBlock.getSearchBlock=function(){
			return divBox;
		}

		function init(){
			logTableId=SEARCH_DATA.getLogTableId();
			logTableName=SEARCH_DATA.getLogTableName();
			logTableState=SEARCH_DATA.getLogTableState();
			logTableCreatorId=SEARCH_DATA.getLogTableCreatorId();
			isMine=logTableCreatorId==openId ? true:false ;
			isAttention=SEARCH_DATA.getIsAttention()==1 ? true:false;

			divBox.addClass("row");
			divBox.setAttribute("style","background-color:#E9EBEE");
			divLeft.addClass("col-xs-8");
			divRight.addClass("col-xs-4");
			makeSearchResultLeftContent().appendTo(divLeft.ui);
			makeSearchResultRightContent().appendTo(divRight.ui);
			divLeft.appendTo(divBox.ui);
			divRight.appendTo(divBox.ui);
		}

		function makeSearchResultLeftContent(){
			var dl=Dl.creatNew();
			dl.addClass("dl-horizontal");
			dl.setAttribute("style","margin-top:20px");

			var tableIdDt=Dt.creatNew();
			var tableNameDt=Dt.creatNew();
			var tableStateDt=Dt.creatNew();
			setDtStyle(tableIdDt);
			setDtStyle(tableNameDt);
			setDtStyle(tableStateDt);
			tableIdDt.html("日程ID");
			tableNameDt.html("日程名称");
			tableStateDt.html("日程状态");

			var tableIdDd=Dd.creatNew();
			var tableNameDd=Dd.creatNew();
			var tableStateDd=Dd.creatNew();
			setDdStyle(tableIdDd);
			setDdStyle(tableNameDd);
			setDdStyle(tableStateDd);
			tableIdDd.html(logTableId);
			tableNameDd.html(logTableName);
			switch(logTableState){
				case 1:
					tableStateDd.addClass("text-success");
					tableStateDd.html("<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> 使用中");
					break;
				case 0:
					tableStateDd.addClass("text-danger");
					tableStateDd.html("<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span> 已弃用");
					break;
			}

			tableIdDt.appendTo(dl.ui);
			tableIdDd.appendTo(dl.ui);
			tableNameDt.appendTo(dl.ui);
			tableNameDd.appendTo(dl.ui);
			tableStateDt.appendTo(dl.ui);
			tableStateDd.appendTo(dl.ui);

			return dl;
		}

		function setDtStyle(DT){
			DT.setAttribute("style","width:80px");
		}

		function setDdStyle(DD){
			DD.setAttribute("style","margin-left:100px;");
		}

		function makeSearchResultRightContent(){
			var div=Div.creatNew();
			div.addClass("text-center");
			div.setAttribute("style","margin-top:32px;");

			if(!isMine && logTableState==1)
				attentionButton().appendTo(div.ui);

			return div;
		}

		function attentionButton(){
			var btn=Button.creatNew();
			btn.addClass("btn btn-primary");
			if(isAttention){
				btn.html("已关注");
			}
			else{
				btn.html("关注");
				btn.onClickListener(onAttentionButtonClickListener);
			}
			return btn;
		}

		function onAttentionButtonClickListener(CONTENT){
			var payAttentionToLogTable=PayAttentionToLogTable.creatNew(openId,logTableId);
			payAttentionToLogTable.onSuccessLisenter(function(data){
				if(data == 1){
					CONTENT.html("已关注");
					CONTENT.unbind();
				}
			});
			payAttentionToLogTable.launch();
		}

		return TableSearchBlock;
	}
}









