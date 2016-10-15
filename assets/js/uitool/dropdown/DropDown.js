document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/ul/Ul.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/dropdown/DropDownItemButton.js"+'">' + '</script>');



/**
 * DropDown(Html)
 * 		setHtml()
 * 		//setMouseLeaveHideMenu()
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

		// DropDown.setMouseLeaveHideMenu=function(){
		// 	ul.ui.mouseleave(function(event) {
		// 		closeMenu();
		// 	});
		// }

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
























