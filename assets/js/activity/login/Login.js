document.write('<script' + ' type="text/javascript" src="'+"assets/opensource/jquery/jquery.cookie.js"+'">' + '</script>');

$(document).ready(function(){
	var login=$("#loginBtn");
	var paras = {};
	
	// QC.Login({
	// 	btnId:"loginBtn"
	// });
	
	// login.click(function(){
	// 	QC.Login.showPopup();
	// });
	if(IsPC()){
		login.click(function(){
			// QC.Login.showPopup({
			// 	appId:"101305771",
			// 	redirectURI:"http://www.miniq.site/"
			// });
			QC.Login.showPopup();
		});
	}
	else{
		login.click(function() {
			window.location.href="?r=Login/Qc"; 
		});
	}

	QC.api("get_user_info",paras).success(function(s){
		//这里需要告诉服务器创建cookie，cookie创建成功后再跳转页面
		window.location.href="?r=Main/Main";  
	});

	if($.cookie('openId') != null){
		window.location.href="?r=Main/Main";
	}

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










