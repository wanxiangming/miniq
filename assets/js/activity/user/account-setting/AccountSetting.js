


function host(){
	var nickNameInput=$("#user-name");
	var nickNameErrorTip=$("#nickName-error-tip");
	var submitBtn=$("#submit-btn");
	var logOutBtn=$("#logout-btn");

	logOutBtn.click(function(){
		var delCookie=DelCookie.creatNew();
		delCookie.onSuccessLisenter(function(data){
			if(data == 1){
				window.location.href="?r=Login/Login";
			}
		});
		delCookie.launch();
	});

	submitBtn.bind("click",function(){
		var nickName=nickNameInput.val();
		if(nickName.length == 0){
			nickNameErrorTip.removeClass('hide');
		}
		else{
			var alterUserInfoNET=AlterUserInfo.creatNew(nickName);
			alterUserInfoNET.onSuccessLisenter(function(data){
				if(data == 0){
					location.reload(true);
				}
			});
			alterUserInfoNET.launch();
		}
	});
}
