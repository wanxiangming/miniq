<?php

	class LoginController extends Controller{
		public $defaultAction = 'Login';
		
		public function actionLogin(){
			$this->renderPartial('Login');
		}
		
		// public function actionLoginCheck(){
		// 	$openId=$_GET['openId'];

		// 	$tableUser=new TableUser();
		// 	if($tableUser->isUserExist($openId))
		// 		print_r(0);
		// 	else{
		// 		$tableUser->insertOneData($openId);	
		// 		print_r(300);	//如果该用户是第一次注册，则向前端发送300
		// 	}
		// }
	}