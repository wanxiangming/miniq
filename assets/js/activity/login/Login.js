
$(document).ready(function(){
	var login=$("#loginBtn");
	var paras = {};
	
	QC.Login({
		btnId:"loginBtn"
	});
	
	login.click(function(){
		QC.Login.showPopup();
	});

	QC.api("get_user_info",paras).success(function(s){
		window.location.href="?r=Main/Main";  
	});

});













