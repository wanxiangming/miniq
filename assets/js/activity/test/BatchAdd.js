
minclude("InputController");
minclude("Alerts");
minclude("LoaderPiano");

function host(){
	var tableSelect=$("#tableSelect");
	var beginWeekSelect=$("#beginWeek");
	var endWeekSelect=$("#endWeek");
	var weekdaySelect=$("#weekdaySelect");
	var hourSelect=$("#hourSelect");
	var minuteSelect=$("#minuteSelect");
	var contentInput=$("#contentInput");
	var submitBtn=$("#submitBtn");
	var alertScope=$("#alertScope");

	var loaderPiano=LoaderPiano.creatNew();
	loaderPiano.hide();
	loaderPiano.appendTo(alertScope);

	var inputController=InputController.creatNew(contentInput,1000);

	tableSelect.bind("change",function(){
		console.log(getSelectedVal($(this)));
	});

	beginWeekSelect.bind("change",function(event) {
		console.log(getSelectedVal($(this)));
	});

	endWeekSelect.bind("change",function(event) {
		console.log(getSelectedVal($(this)));
	});

	weekdaySelect.bind("change",function(){
		console.log(getSelectedVal($(this)));
	});

	hourSelect.bind("change",function(){
		console.log(getSelectedVal($(this)));
	});

	minuteSelect.bind("change",function(){
		console.log(getSelectedVal($(this)));
	});

	//这里做好一个关于transaction的数组，发送到服务器，服务器遍历数组将数据插入数据库
	submitBtn.bind("click",submitBtnAbled);

	function submitBtnAbled(){
		if(getSelectedVal(beginWeekSelect) <= getSelectedVal(endWeekSelect)  &&  inputController.verify()){
			var date=new Date();
			date.setFullYear(2016,7,29);
			date.setHours(getSelectedVal(hourSelect));
			date.setMinutes(getSelectedVal(minuteSelect));
			date.setSeconds(0);
			date.setMilliseconds(0);
			date.setDate(date.getDate()+(getSelectedVal(weekdaySelect)-1)+(getSelectedVal(beginWeekSelect)-1)*7);

			var transactionAry=[];
			for(var i=0; i<(getSelectedVal(endWeekSelect)-getSelectedVal(beginWeekSelect)+1); i++){
				//设置transaction数据
				console.log(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" 星期"+date.getDay()+" 时间"+date.getHours()+":"+date.getMinutes());
				var time=date.getTime();
				var content=inputController.getContent();
				var tableId=getSelectedVal(tableSelect);
				transactionAry.push({
					"tableId":tableId,
					"content":content,
					"time":time
				});

				date.setDate(date.getDate()+7);
			}
			console.log(transactionAry);
			var batchAddNET=BatchAddTransaction.creatNew(transactionAry);
			batchAddNET.onSuccessLisenter(function(data){
				loaderPiano.hide();
				Alerts.creatNew(true,"数据提交成功",alertScope);
				submitBtn.unbind().bind("click",submitBtnAbled);
				submitBtn.removeClass("disabled");
			});
			batchAddNET.launch();
			submitBtn.addClass("disabled");
			submitBtn.unbind().bind("click",function(){});
			loaderPiano.show();
		}
		else{
			//结束周比开始周小，无效的数据
		}
	}

	function setSelectedVal(SELECTOR,VAL){
		SELECTOR.children("option[value="+VAL+"]").attr("selected",true);
	}

	function getSelectedVal(SELECTOR){
		return Number(SELECTOR.children('option:selected').val());
	}
}


/**
 * InputController(input,maxLength)
 * 		onChange(CALL_BACK())
 * 		verify()	验证输入框中的内容是否符合长度要求.......，符合返回true，不符合返回false
 * 		setContent()	设置输入框内容
 * 		getContent()	
 * 		getRemainLength()	获取输入框合法输入内容所剩长度
 * 		empty()		清空输入框内容
 */
var InputController={
	creatNew:function(INPUT,MAX_LENGTH){
		var InputController={};

		var input=INPUT;
		var CONTENT_LENGTH_MAX=MAX_LENGTH;
		var CONTENT_LENGTH_MIN=1;
		var e_change=function(CONTENT,REMAIN_LENGTH){};
		(function(){
			input.bind("input propertychange",function(){
				e_change(getContent(),getRemainLength());
			});
		})();

		InputController.getRemainLength=function(){
			return getRemainLength();
		}

		function getRemainLength(){
			return CONTENT_LENGTH_MAX-getLength();
		}

		InputController.verify=function(){
			return thisVerify();
		}

		function thisVerify(){
			if(CONTENT_LENGTH_MIN<=getLength() && getLength()<=CONTENT_LENGTH_MAX){
				return true;
			}
			else{
				return false;
			}
		}

		function getLength(){
			return Number(getContent().length);
		}

		InputController.getContent=function(){
			return getContent();
		}

		function getContent(){
			return input.val();
		}

		InputController.onChange=function(CALL_BACK){
			e_change=CALL_BACK;
		}

		InputController.setContent=function(CONTENT){
			input.val(CONTENT);
		}

		InputController.empty=function(){
			input.val("");
		}

		return InputController;
	}
}


minclude("FadeDiv");
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
			div.hide();
		}, 2000);
	}
}



minclude("Div");

var LoaderPiano={
	creatNew:function(){
		var LoaderPiano=Div.creatNew();

		var div1=Div.creatNew();
		var div2=Div.creatNew();
		var div3=Div.creatNew();

		LoaderPiano.addClass("cssload-piano hide");
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

minclude("Div");

var FadeDiv={
	creatNew:function(){
		var FadeDiv=Div.creatNew();

		FadeDiv.addClass("fadeIn animated correction-animated-css hide");
		
		FadeDiv.show=function(){
			FadeDiv.removeClass('hide');
		}

		FadeDiv.hide=function(){
			FadeDiv.addClass("fadeOut");
			FadeDiv.one("animationend",function(){
				FadeDiv.addClass('hide');
			});
		}

		return FadeDiv;
	}
}


minclude("Ui");

var Div={
	creatNew:function(){
		var Div=Ui.creatNew($("<div></div>"));

		return Div;
	}	
}



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
		
		Ui.hide=function(){
			Ui.ui.hide();
		}

		return Ui;
	}	
}

