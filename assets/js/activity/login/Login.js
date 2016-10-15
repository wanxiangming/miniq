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
	
	login.click(function(event) {
		window.location.href="?r=Login/Qc"; 
	});

	QC.api("get_user_info",paras).success(function(s){
		//这里需要告诉服务器创建cookie，cookie创建成功后再跳转页面
		window.location.href="?r=Main/Main";  
	});

	if($.cookie('openId') != null){
		window.location.href="?r=Main/Main";
	}

});













