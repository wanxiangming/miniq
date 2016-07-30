document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');

var LoaderPiano={
	creatNew:function(){
		var LoaderPiano=Div.creatNew();

		var div1=Div.creatNew();
		var div2=Div.creatNew();
		var div3=Div.creatNew();

		LoaderPiano.addClass("cssload-piano");
		div1.addClass("cssload-rect1");
		div2.addClass("cssload-rect2");
		div3.addClass("cssload-rect3");
		div1.appendTo(LoaderPiano.ui);
		div2.appendTo(LoaderPiano.ui);
		div3.appendTo(LoaderPiano.ui);

		LoaderPiano.hide=function(){
			LoaderPiano.addClass('hide');
		}

		LoaderPiano.show=function(){
			LoaderPiano.removeClass('hide');
		}

		return LoaderPiano;
	}
}
