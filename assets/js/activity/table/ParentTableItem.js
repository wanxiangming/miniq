
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/listitem/DropDownListItem.js"+'">' + '</script>');

/**
 *	它有两种形态，一种是正常的继承关系展示，还有一种是编辑模式,两个模式只需要一个隐藏，一个显示，就能实现切换功能
 * 
 * ParentTableItem(childTable,parentTable,editPermission)
 * 		show()
 * 		hide()
 * 		getUI()
 * 		onRelieveInherit()
 */
var ParentTableItem={
	creatNew:function(CHILD_TABLE,PARENT_TABLE,EDIT_PERMISSION){
		var ParentTableItem={};

		var childTable=CHILD_TABLE;
		var parentTable=PARENT_TABLE;
		var div=Div.creatNew();
		var parentTableItemDisplay=ParentTableItemDisplay.creatNew(childTable.getTableName(),parentTable.getTableId(),parentTable.getTableName(),EDIT_PERMISSION);
		var e_relieveInherit=function(){};
		(function(){
			parentTableItemDisplay.getUI().appendTo(div.ui);
			parentTableItemDisplay.show();
			parentTableItemDisplay.onRelieveInherit(function(PARENT_TABLE_ID){
				e_relieveInherit(PARENT_TABLE_ID);
			});
		})();

		ParentTableItem.getUI=function(){
			return div.ui;
		}

		ParentTableItem.show=function(){
			div.removeClass('hide');
		}

		ParentTableItem.hide=function(){
			div.addClass('hide');
		}

		ParentTableItem.onRelieveInherit=function(CALL_BACK){
			e_relieveInherit=CALL_BACK;
		}

		return ParentTableItem;
	}
}



/**
 * href=http://www.miniq.site/?r=Table/TableInfo&tableId=
 * 
 * ParentTableItemDisplay(tableName,parentTableId,parentTableName,editPermission)
 * 		show()
 * 		hide()
 * 		getUI()
 * 		onRelieveInherit(CALL_BACK(parentTableId))
 */
var ParentTableItemDisplay={
	creatNew:function(TABLE_NAME,PARENT_TABLE_ID,PARENT_TABLE_NAME,EDIT_PERMISSION){
		var ParentTableItemDisplay={};


		var checkActionBtn=$("#checkAction_btn");
		var checkActionModal=$("#checkAction_Modal");
		var checkActionContent=$("#checkAction_Content");
		var div=Div.creatNew();
		var settingBtnDiv=Div.creatNew();
		var settingBtn=DropDown.creatNew("<span class=\"glyphicon glyphicon-cog\"></span>");
		var e_relieveInherit=function(parentTableId){};
		(function(){
			var tableNameDiv=Div.creatNew();
			tableNameDiv.html(TABLE_NAME+"  <<  "+"<a href=\""+MINIQ_URL+"Table/TableInfo&tableId="+PARENT_TABLE_ID+"\">"+PARENT_TABLE_NAME+" ("+PARENT_TABLE_ID+")</a>");

			if(EDIT_PERMISSION){
				settingBtnDiv.appendTo(div.ui);
			}
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

		ParentTableItemDisplay.onRelieveInherit=function(CALL_BACK){
			e_relieveInherit=CALL_BACK;
		}

		ParentTableItemDisplay.getUI=function(){
			return div.ui;
		}

		ParentTableItemDisplay.show=function(){
			div.removeClass('hide');
		}

		ParentTableItemDisplay.hide=function(){
			div.addClass('hide');
		}

		return ParentTableItemDisplay;
	}
}



