<?php
	include_once("protected/models/util/TableUser.php");
	include_once("protected/models/util/Cookie.php");

	class UserController extends Controller{

		public function actionAccountSetting(){
			$cookie=new Cookie();
			if($cookie->isSetAccount()){
				$openId=$cookie->getAccount();
				$mysqlUser=new TableUser($openId);
				$userInfoAry=$mysqlUser->getUserInfo();
				$this->render('AccountSetting',array('userInfoAry'=>$userInfoAry));
			}
			else{
				$this->redirect(array('Login/Login'));
			}
		}
	}











