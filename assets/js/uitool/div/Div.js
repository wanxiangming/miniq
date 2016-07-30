document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/Ui.js"+'">' + '</script>');

var Div={
	creatNew:function(){
		var Div=Ui.creatNew($("<div></div>"));

		return Div;
	}	
}

var HorizontalSlipDiv={
	creatNew:function(){
		var HorizontalSlipDiv=Div.creatNew();

		HorizontalSlipDiv.addClass("animated bounceInRight hide");

		HorizontalSlipDiv.show=function(){
			HorizontalSlipDiv.removeClass('hide');
		}

		HorizontalSlipDiv.slipRemove=function(){
			HorizontalSlipDiv.addClass("bounceOutLeft");
			HorizontalSlipDiv.one('animationend',function(){
				HorizontalSlipDiv.remove();
			});
		}

		return HorizontalSlipDiv;
	}
}

var FlipYDiv={
	creatNew:function(){
		var FlipYDiv=Div.creatNew();

		FlipYDiv.addClass("animated flipInY hide");

		FlipYDiv.show=function(){
			FlipYDiv.removeClass('hide');
		}

		FlipYDiv.flipRemove=function(){
			FlipYDiv.addClass("flipOutY");
			FlipYDiv.one('animationend',function(){
				FlipYDiv.remove();
			});
		}

		return FlipYDiv;
	}
}

var FadeDiv={
	creatNew:function(){
		var FadeDiv=Div.creatNew();

		FadeDiv.addClass("fadeIn animated correction-animated-css hide");
		
		FadeDiv.show=function(){
			FadeDiv.removeClass('hide');
		}

		FadeDiv.fadeRemove=function(){
			FadeDiv.addClass("fadeOut");
			FadeDiv.one("animationend",function(){
				FadeDiv.remove();
			});
		}

		return FadeDiv;
	}
}













