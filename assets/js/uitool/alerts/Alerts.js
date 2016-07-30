document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
/*
父元素使用position:relative，Alerts的显示域使用position:absolute，并用top，bottom等值控制它的位置，就能实现
alerts在任意位置上显示
 */
var Alerts={
	creatNew:function(MODE,CONTENT,SCOPE){
		var div=FadeDiv.creatNew();

		if(MODE)
			div.addClass("alert alert-success");
		else
			div.addClass("alert alert-warning");

		div.addClass("correction-alerts");
		div.html(CONTENT);
		div.appendTo(SCOPE);
		div.show();
		setTimeout(function(){
			div.fadeRemove();
		}, 2000);
	}
}













