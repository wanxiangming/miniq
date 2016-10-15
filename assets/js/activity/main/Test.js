document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/MDate.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/TextTranslator.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/PopoverButton.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/internet/Internet.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/InputController.js"+'">' + '</script>');


/**
 * 待办事项测试用例
 */

function host(){
	var div1=$("#div1");
	var div2=$("#div2");
	var btn=$("#btn");
	alert(123456789123123+"" == Number(123456789123123));
	var ary=[];
	var aryContainer=AryContainer.creatNew();

	var div3=Div.creatNew();
	div3.html(ary[0]+" "+ary[1]+" "+ary[2]);
	div3.appendTo(div1);

	var obj1=Obj.creatNew(1);
	var obj2=Obj.creatNew(2);
	var obj3=Obj.creatNew(3);
	ary.push(obj1);
	ary.push(obj2);
	ary.push(obj3);
	aryContainer.add(obj1);
	aryContainer.add(obj2);
	aryContainer.add(obj3);
	//aryContainer.alertAry();
	var string="123123125125你好12313123123吗？";

	var newAry=ary;
	ary=$.grep(ary,function(e,i){	
		if(e.getValue()==3){
			return false;
		}
		else{
			return true;
		}
	});

	btn.bind('click',function(event) {
		// obj1.setValue(4);
		// obj2.setValue(5);
		// obj3.setValue(6);
		$.each(ary,function(index, el) {
			el.setValue(1);
		});
		//aryContainer.alertAry();
		
		
		alert(string.indexOf('9'));
		// for(var i=0; i<ary.length; i++){
		// 	ary[i]=1;
		// }
		// div3.html(ary[0]+" "+ary[1]+" "+ary[2]);
		// aryContainer.alertAry();
		// div3.addClass('hide');
		// div3.appendTo(div2);
		// div1.empty();
	});
}

var AryContainer={
	creatNew:function(){
		var AryContainer={};

		var ary=[];

		AryContainer.add=function(OBJ){
			ary.push(OBJ);
		}

		AryContainer.alertAry=function(){
			alert(ary[0].getValue()+" "+ary[1].getValue()+" "+ary[2].getValue());
		}

		return AryContainer;
	}
}

var Obj={
	creatNew:function(el){
		var Obj={};

		var value=el;

		Obj.getValue=function(){
			return value;
		}

		Obj.setValue=function(VALUE){
			value=VALUE;
		}

		return Obj;
	}
}


