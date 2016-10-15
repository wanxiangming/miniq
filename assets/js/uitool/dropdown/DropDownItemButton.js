
// var DropDownItemButton={
// 	creatNew:function(){
// 		var DropDownItemButton=Button.creatNew();

// 		DropDownItemButton.addClass("form-control btn btn-default correction-dropdown-btn-css");

// 		return DropDownItemButton;
// 	}
// }




document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/li/Li.js"+'">' + '</script>');


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






