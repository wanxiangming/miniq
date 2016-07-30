document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/Ui.js"+'">' + '</script>');

var Button={
	creatNew:function(){
		var Button=Ui.creatNew($("<button></button"));

		Button.onClickListener=function(CALL_BACK){
			Button.ui.bind("click",function(){
				CALL_BACK($(this));
			});
		}

		return Button;
	}
}

var DropDownItemButton={
	creatNew:function(){
		var DropDownItemButton=Button.creatNew();

		DropDownItemButton.addClass("form-control btn btn-default correction-dropdown-btn-css");

		return DropDownItemButton;
	}
}











