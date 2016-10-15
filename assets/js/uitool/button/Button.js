document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/Ui.js"+'">' + '</script>');

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











