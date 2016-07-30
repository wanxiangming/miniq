document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/Ui.js"+'">' + '</script>');

var Select={
	creatNew:function(){
		var Select=Ui.creatNew($("<select></select>"));

		Select.deleteCurrent=function(){
			Select.ui.find("option:selected").remove();
		}

		Select.getCurrentVal=function(){
			return Select.ui.find("option:selected").val();
		}

		Select.clear=function(){
			Select.ui.empty();
		}

		return Select;
	}
}




















