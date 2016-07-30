var Ui={
	creatNew:function(UI){
		var Ui={};

		Ui.ui=UI;

		Ui.addClass=function(PROP){
			Ui.ui.addClass(PROP);
		}

		Ui.removeClass=function(PROP){
			Ui.ui.removeClass(PROP);
		}

		Ui.html=function(HTML){
			Ui.ui.html(HTML);
		}
		
		Ui.addHtml=function(HTML){
			var html=Ui.ui.html();
			Ui.ui.html(html+HTML)
		}

		Ui.appendTo=function(SCOPE){
			Ui.ui.appendTo(SCOPE);
		}

		Ui.remove=function(){
			Ui.ui.remove();
		}

		Ui.setAttribute=function(NAME,VALUE){
			Ui.ui.attr(NAME,VALUE);
		}
		
		Ui.getAttribute=function(NAME){
			return Ui.ui.attr(NAME);
		}

		Ui.one=function(ACTION,CALL_BACK){
			Ui.ui.one(ACTION,CALL_BACK);
		}

		return Ui;
	}	
}