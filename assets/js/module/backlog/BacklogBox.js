
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
/**
 * 它知道自己的大小，它不知道自己的位置。
 * 当它初次被创建时，它是背面朝上的，被点击后翻转。当然它给出了翻转接口，使得它可以被手动翻转
 * 它把接收到的每一个待办事项都制作成一个按钮，显示的时候将按钮展示出来，不显示的时候隐藏按钮
 *
 * 它接收显示它的父元素（行）
 * 
 * BacklogBox(row,backlogItemAry)
 * 		addItem(BacklogItem)	向代办事项盒子里添加数据
 * 		removeItem(ID)		告诉待办事项盒子移除某条数据
 * 		flip()	给外界的一个手动翻转它的接口,可以从正面翻到背面，从背面翻到正面。每次翻到正面的时候随机取三个待办事项
 */
var BacklogBox={
	creatNew:function(ROW,BACKLOG_ARY){
		var BacklogBox={};

		var MAX_BACKLOG_SHOW_ITEM=4;
		var ROLL_TIMES_OF_OUTSIDE_BACKLOG_ITEM_ARY=5;

		var frontItemAry=[];
		var currentItemAry=[];
		var afterItemAry=[];

		var basisDiv=Div.creatNew();
		var bottomPageControlDiv=Div.creatNew();
		var frontPageBtn=Button.creatNew();
		var afterPageBtn=Button.creatNew();
		var contentDiv=Div.creatNew();
		var flipperDiv=Div.creatNew();
		var frontDiv=Div.creatNew();
		var frontNumDiv=Div.creatNew();
		var backDiv=Div.creatNew();
		var itemOutsideBackDivAry=[];
		var itemInsideBackDivAry=[];
		var itemAreaAry=[];
		var isTransitionEnd=true;
		(function init(){
			afterItemAry=BACKLOG_ARY;
			itemOutsideBackDivAry=BACKLOG_ARY;
			basisDiv.addClass('col-lg-3 col-xs-6');
			basisDiv.appendTo(ROW);

			contentDiv.addClass('thumbnail flip-container');
			contentDiv.setAttribute("style","margin-top:20px;margin-bottom:0px;height:200px;");
			contentDiv.ui.bind("click",function(){ 
				flipContentDiv();
			});
			contentDiv.appendTo(basisDiv.ui);

			frontPageBtn.addClass('btn btn-default  btn-sm');
			frontPageBtn.html("<span class=\"glyphicon glyphicon-chevron-left\"> </span>");
			frontPageBtn.hide();
			frontPageBtn.onClickListener(function(){
				pageUp();
				changePageBtnVisibility();
			});
			frontPageBtn.appendTo(bottomPageControlDiv.ui);
			afterPageBtn.addClass('btn btn-default  btn-sm');
			afterPageBtn.html("<span class=\"glyphicon glyphicon-chevron-right\"> </span>");
			afterPageBtn.hide();
			afterPageBtn.onClickListener(function(){
				pageDown();
				changePageBtnVisibility();
			});
			afterPageBtn.appendTo(bottomPageControlDiv.ui);
			bottomPageControlDiv.addClass('col-xs-12');
			bottomPageControlDiv.setAttribute("style","height:20px;text-align: center;");
			bottomPageControlDiv.appendTo(basisDiv.ui);

			flipperDiv.appendTo(contentDiv.ui);
			flipperDiv.addClass('flipper');
			flipperDiv.ui.bind("transitionend",function(){
				isTransitionEnd=true;
				if(isBackHide()){
					frontPageBtn.ui.hide();
					afterPageBtn.ui.hide();
				}
				else{
					changePageBtnVisibility();
				}
			});

			frontDiv.addClass('front');
			frontDiv.setAttribute("style","background-color:rgb(33, 102, 140);display:table;");
			frontDiv.appendTo(flipperDiv.ui);

			frontDiv.addClass('btn');
			frontNumDiv.setAttribute("style","display:table-cell;vertical-align:middle;text-align:center;font-size:80px;font-family: sans-serif;color:#B2AFA9;");
			frontNumDiv.appendTo(frontDiv.ui);

			backDiv.addClass('back');
			backDiv.setAttribute("style","background:rgb(109, 125, 133)");
			backDiv.appendTo(flipperDiv.ui);

			var headAreaDiv=Div.creatNew();
			headAreaDiv.addClass('col-xs-12');
			headAreaDiv.setAttribute("style","margin-top:10px;height:33px");
			itemAreaAry.push(headAreaDiv);
			headAreaDiv.appendTo(backDiv.ui);

			for(var i=0; i<3; i++){
				var nullDiv=getNullDiv();
				nullDiv.appendTo(backDiv.ui);
				var areaDiv=getAreaDiv();
				areaDiv.appendTo(backDiv.ui);
				itemAreaAry.push(areaDiv);
			}
			changeFrontNum();
			pageDown();
		})();

		//上一页
		function pageUp(){
			if(frontItemAry.length > 0){
				hideAll();
				moveCurrentToAfter();
				moveFrontToCurrent();
				showAll();
			}
		}

		//下一页
		function pageDown(){
			if(afterItemAry.length > 0){
				hideAll();
				moveCurrentToFront();
				moveAfterToCurrent();
				showAll();
			}
		}

		function changePageBtnVisibility(){
			if(isBackHide()){

			}
			else{
				if(afterItemAry.length == 0){
					afterPageBtn.ui.hide();
				}
				else{
					afterPageBtn.ui.show();
				}
				if(frontItemAry.length == 0){
					frontPageBtn.ui.hide();
				}
				else{
					frontPageBtn.ui.show();
				}
			}
		}

		function hideAll(){
			$.each(currentItemAry,function(index, el) {
				el.hide();
			});
		}

		function showAll(){
			$.each(currentItemAry,function(index, el) {
				el.show().appendTo(itemAreaAry[index].ui);
			});
		}

		function moveAfterToCurrent(){
			afterItemAry=$.grep(afterItemAry,function(value,index){
				if(currentItemAryLength() < MAX_BACKLOG_SHOW_ITEM){
					currentItemAry.push(value);
					return false;
				}
				else{
					return true;
				}
			});
		}

		function moveCurrentToAfter(){
			currentItemAry.reverse();
			currentItemAry=$.grep(currentItemAry,function(value,index){
				afterItemAry.unshift(value);
				return false;
			});
		}

		function moveFrontToCurrent(){
			frontItemAry=$.grep(frontItemAry,function(value,index){
				if(currentItemAryLength() < MAX_BACKLOG_SHOW_ITEM){
					currentItemAry.unshift(value);
					return false;
				}
				else{
					return true;
				}
			});
		}

		function moveCurrentToFront(){
			currentItemAry=$.grep(currentItemAry,function(value,index){
				frontItemAry.unshift(value);
				return false;
			});
		}

		function currentItemAryLength(){
			return currentItemAry.length;
		}

		function isBackHide(){
			return contentDiv.ui.hasClass("flip") == false;
		}

		function getAreaDiv(){
			var div=Div.creatNew();
			div.addClass('col-xs-12');
			div.setAttribute("style","height:33px");
			return div;
		}

		function getNullDiv(){
			var div=Div.creatNew();
			div.addClass('col-xs-12');
			div.setAttribute("style","height:13px");
			return div;
		}

		BacklogBox.flip=function(){
			setTimeout(function() {	//如果不使用定时器，box将不会触发transitionend
				flipContentDiv();
			}, 1);
		}

		function flipContentDiv(){
			if(isTransitionEnd){
				isTransitionEnd=false;
				contentDiv.ui.toggleClass('flip');
			}
		}

		BacklogBox.addItem=function(BACKLOG_ITEM){
			if(currentItemAry.length < MAX_BACKLOG_SHOW_ITEM){
				currentItemAry.push(BACKLOG_ITEM);
				hideAll();
				showAll();
			}
			else{
				afterItemAry.push(BACKLOG_ITEM);
			}
			changeFrontNum();
			changePageBtnVisibility();
		}

		BacklogBox.removeItem=function(BACKLOG_ID){
			removeItemFromFrontItemAry(BACKLOG_ID);
			removeItemFromCurrentItemAry(BACKLOG_ID);
			removeItemFromAfterItemAry(BACKLOG_ID);
			changeFrontNum();
			changePageBtnVisibility();
		}

		function removeItemFromFrontItemAry(BACKLOG_ID){
			frontItemAry=$.grep(frontItemAry,function(el,index) {
				if(el.getId() == BACKLOG_ID){
					el.hide();
					return false;
				}
				else{
					return true;
				}
			});
		}

		function removeItemFromCurrentItemAry(BACKLOG_ID){
			currentItemAry=$.grep(currentItemAry,function(el,index) {
				if(el.getId() == BACKLOG_ID){
					el.hide();
					return false;
				}
				else{
					return true;
				}
			});
			moveAfterToCurrent();
			hideAll();
			showAll();
		}

		function removeItemFromAfterItemAry(BACKLOG_ID){
			afterItemAry=$.grep(afterItemAry,function(el,index) {
				if(el.getId() == BACKLOG_ID){
					el.hide();
					return false;
				}
				else{
					return true;
				}
			});
		}

		function changeFrontNum(){
			var num=afterItemAry.length+currentItemAry.length+frontItemAry.length;
			frontNumDiv.html(num);
		}

		return BacklogBox;
	}
}
