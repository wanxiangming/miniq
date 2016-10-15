

/**
 * ChildTableItem(table,childTable,editPermission)
 * 		getUI()
 * 		show()
 * 		hide()
 * 		onRelieve()
 */
var ChildTableItem={
	creatNew:function(TABLE,CHILD_TABLE,EDIT_PERMISSION){
		var ChildTableItem={};

		var table=TABLE;
		var childTable=CHILD_TABLE;
		var editPermission=EDIT_PERMISSION;
		var div=Div.creatNew();
		var childTableItemDisplay=ChildTableItemDisplay.creatNew(table.getTableName(),childTable.getTableId(),childTable.getTableName(),editPermission);

		(function(){
			childTableItemDisplay.getUI().appendTo(div.ui);

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

		ChildTableItem.onRelieve=function(){

		}

		return ChildTableItem;
	}
}


/**
 * ChildTableItemDisplay()
 * 		getUI()
 * 		show()
 * 		hide()
 * 		onClickSettingBtn()
 */
var ChildTableItemDisplay={
	creatNew:function(TABLE_NAME,CHILD_TABLE_ID,CHILD_TABLE_NAME,EDIT_PERMISSION){
		var ChildTableItemDisplay={};

		var div=Div.creatNew();
		var settingBtn=Div.creatNew();
		var e_clickSettingBtn=function(){};

		(function(){
			div.addClass("row correction-row-css deep-background-on-hover col-xs-12");
			div.setAttribute("style","padding-top:6px;padding-bottom:6px;");
			div.ui.mouseenter(function(event) {
				settingBtn.removeClass('hide');
			});
			div.ui.mouseleave(function(event) {
				settingBtn.addClass('hide');
			});

			var tableNameDiv=Div.creatNew();
			tableNameDiv.addClass('col-xs-11');
			tableNameDiv.html("<a href=\""+MINIQ_URL+"Table/TableInfo&tableId="+CHILD_TABLE_ID+"\">"+CHILD_TABLE_NAME+" ("+CHILD_TABLE_ID+")</a>"+"  <<  "+TABLE_NAME);
			tableNameDiv.appendTo(div.ui);



			settingBtn.addClass('col-xs-1 btn hide');
			settingBtn.setAttribute("style","padding-top:0px;padding-bottom:0px;");
			settingBtn.html("<span class=\"glyphicon glyphicon-cog\"></span>");
			settingBtn.ui.bind("click",function(){
				e_clickSettingBtn();
			});
			if(EDIT_PERMISSION){
				//解除子表的继承，先放一放，以后再做，这个操作应该仅对私有表有用，因为公开表是任何人都可以继承的，它的解除继承操作没有意义
				// settingBtn.appendTo(div.ui);
			}		
		})();

		ChildTableItemDisplay.getUI=function(){
			return div;
		}

		ChildTableItemDisplay.show=function(){
			div.removeClass('hide');
		}

		ChildTableItemDisplay.hide=function(){
			div.addClass('hide');
		}

		ChildTableItemDisplay.onClickSettingBtn=function(CALL_BACK){
			e_clickSettingBtn=CALL_BACK;
		}

		return ChildTableItemDisplay;
	}
}


/**
 * ChildTableItemSetting()
 * 		getUI()
 * 		show()
 * 		hide()
 * 		onRelieve()
 */















