document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/Ui.js"+'">' + '</script>');

var Input={
	creatNew:function(){
		var Input=Ui.creatNew($("<input></input>"));

		Input.setPlaceHolder=function(PLACE_HOLDER){
			Input.ui.attr("placeholder",PLACE_HOLDER);
		}

		Input.setVal=function(PROP){
			Input.ui.val(PROP);
		}

		Input.getVal=function(){
			return Input.ui.val();
		}

		return Input;
	}
}












