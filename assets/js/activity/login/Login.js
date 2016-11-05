

$(document).ready(function(){
	var login=$("#loginBtn");
	var paras = {};
	
	// QC.Login({
	// 	btnId:"loginBtn"
	// });
	
	// login.click(function(){
	// 	QC.Login.showPopup();
	// });
	// 
	// QC.Login.showPopup({
	// 	appId:"101305771",
	// 	redirectURI:"http://www.miniq.site/"
	// });

	if(IsPC()){
		//方式一
		login.click(function(){
			QC.Login.showPopup();
		});
	}
	else{
		//方式二
		login.click(function() {
			window.location.href="?r=Login/Qc"; 
		});
	}

	QC.api("get_user_info",paras).success(function(s){
		//方式一：用户登陆成功后，这个页面不会刷新，但这个方法会被执行！
		//方式二：用户登陆成功后，这个页面会刷新，并执行这个方法！
		// window.location.href="?r=Main/Main";  
		// console.log("QC api");
		QC.Login.getMe(function(OPENG_ID,ACCESS_TOKEN){
			//loginCheck，如果没有该用户，创建用户，并设置cookie
			//如果已经存在该用户，则设置cookie
			var loginCheck=LoginCheck.creatNew(OPENG_ID);
			loginCheck.onSuccessLisenter(function(data){
				QC.Login.signOut();						//退出Qc
				window.location.href="?r=Main/Main"; 	//跳转主页
			});
			loginCheck.launch();
		});
	});

	// 如果用户已经有cookie了，那就直接跳转主页
	// if($.cookie('account') != null){
	// 	window.location.href="?r=Main/Main";
	// }

});


function IsPC(){    
	var userAgentInfo = navigator.userAgent;  
	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");    
	var flag = true;    
	for (var v = 0; v < Agents.length; v++) {    
	 if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }    
	}    
	return flag;    
} 
