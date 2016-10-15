



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














