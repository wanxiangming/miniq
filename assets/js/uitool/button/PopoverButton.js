document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');

/**
 * 这个按钮可以显示弹出框
 *
 * 它接收触发器选择，参数内容和bootstrap所要求的一致
 * 接收标题（title）
 * 接收内容（content）
 * 
 * PopoverButton(trigger,html,title,content)
 * 		changeTitle(title)
 * 		changeContent(content)
 * 		changeHtml(html)
 * 		changePosition(Position)	//指的是popver弹出的位置，上下左右
 * 		showPopover()
 * 		hidePopover()
 * 		destroyPopover()
 */

var PopoverButton={
	creatNew:function(TRIGGER,HTML,TITLE,CONTENT){
		var PopoverButton=Button.creatNew();

		(function(){
			PopoverButton.addClass("btn btn-default text-center col-xs-12 ");
			PopoverButton.setAttribute("style","text-overflow:ellipsis;overflow:hidden");
			PopoverButton.setAttribute("data-toggle","popover");
			PopoverButton.setAttribute("data-container","body");
			PopoverButton.html(HTML);
			PopoverButton.setAttribute("data-trigger",TRIGGER);
			PopoverButton.setAttribute("data-original-title",TITLE);
			PopoverButton.setAttribute("data-content",CONTENT);
			PopoverButton.setAttribute("data-html","true");
			PopoverButton.ui.popover();
		})();

		PopoverButton.changeHtml=function(Html){
			PopoverButton.html(Html);
		}

		PopoverButton.changeTitle=function(Title){
			PopoverButton.setAttribute("data-original-title",Title);
		}

		PopoverButton.changeContent=function(CONTENT){
			PopoverButton.setAttribute("data-content",CONTENT);
		}

		PopoverButton.changePosition=function(Position){
			PopoverButton.setAttribute("data-placement",Position);
		}

		PopoverButton.destroyPopover=function(){
			destroyPop();
		}

		function destroyPop(){
			PopoverButton.ui.popover('destroy');
		}

		PopoverButton.hidePopover=function(){
			hidePop();
		}

		function hidePop(){
			PopoverButton.ui.popover('hide');
		}

		PopoverButton.showPopover=function(){
			showPop();
		}

		function showPop(){
			PopoverButton.ui.popover('show');
		}

		return PopoverButton;
	}
}


























