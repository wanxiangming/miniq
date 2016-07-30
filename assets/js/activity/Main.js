
openId="";
accessToken="";


$(document).ready(function(){
	var paras={};
	var nickNameDiv=$("#nickName");
	var logOutBtn=$("#logoutBtn");

	$("[data-toggle='popover']").popover();
	$('[data-toggle="tooltip"]').tooltip();

	logOutBtn.click(function(){
		QC.Login.signOut();
		window.location.href="?r=Login/Login";
	});

	if(QC.Login.check()){
		QC.Login.getMe(function(OPENG_ID,ACCESS_TOKEN){
			openId=OPENG_ID;
			accessToken=ACCESS_TOKEN;
			var loginCheck=LoginCheck.creatNew(OPENG_ID);
			loginCheck.onSuccessLisenter(function(data){
				if(data == 300){	//用户首次注册的返回值
					QC.api("get_user_info",paras).success(function(s){
						// nickNameDiv.html(s.data.nickname);
						nickNameDiv.attr("data-original-title",s.data.nickName);
						var changeNickName=ChangeNickName.creatNew(OPENG_ID,s.data.nickname);
						changeNickName.onSuccessLisenter(function(data){});
						changeNickName.launch();
					});
				}
				else{	//用户已经注册过的返回值
					// nickNameDiv.html(data.nickName);
					nickNameDiv.attr("data-original-title",data.nickName);
				}
				host();	//非常重要！！我们是从这里开始调用各个页面自己的js内容的
			});
			loginCheck.launch();
		});
	}
	else{
		window.location.href="?r=Login/Login";
	}
});


