<?php
	include_once("protected/models/util/TableUser.php");

	class LoginController extends Controller{
		const MONTH=2592000;

		public $defaultAction = 'Login';
		
		public function actionLogin(){
			$this->renderPartial('Login');
		}

		public function actionSetCookie(){
			$openId=$_GET['openId'];

			$cookie=new CHttpCookie('openId',$openId);
			$cookie->expire=time()+self::MONTH;

			Yii::app()->request->cookies['openId']=$cookie;
			print_r(1);
		}

		public function actionDelCookie(){
			unset(Yii::app()->request->cookies['openId']);
		}

		public function actionCheckCookie(){
			if(isset(Yii::app()->request->cookies['openId'])){
				$cookie=Yii::app()->request->cookies['openId'];
				$openId=$cookie->value;
				$tableUser=new TableUser($openId);
				if($tableUser->isUserExist()){
					$cookie->expire=time()+self::MONTH;
					Yii::app()->request->cookies['openId']=$cookie;
					print_r(1);
				}
				else{
					unset(Yii::app()->request->cookies['openId']);
					print_r(0);
				}
			}
			else{
				print_r(0);
			}
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