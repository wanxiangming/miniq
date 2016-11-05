<?php
	include_once("protected/models/util/TableUser.php");
	include_once("protected/models/util/Cookie.php");

	class LoginController extends Controller{
		const MONTH=2592000;

		public $defaultAction = 'Login';
		
		public function actionLogin(){
			$cookie=new Cookie();
			if($cookie->isSetAccount()){
				$this->redirect(array('Main/Main'));
			}
			else{
				$this->renderPartial('Login');
			}
		}
		
		public function actionQc(){
			$this->renderPartial('Qc');	
		}

		/**
		 * (1009)2291571C2A1ED1017BADF6F93BC0DA06
		 * (100000)67EB8F9DA303F184014F9268D8294156
		 *
		 */
		public function actionLocalSetCookie(){
			$cookie=new Cookie();
			$cookie->setAccount("2291571C2A1ED1017BADF6F93BC0DA06");

			print_r(1);
			
 		}

		public function actionSetCookie(){
			$openId=$_GET['openId'];
			$cookie=new Cookie();
			$cookie->setAccount($openId);
			print_r(1);
		}

		public function actionDelCookie(){
			$cookie=new Cookie();
			$cookie->unsetAccount();
			print_r(1);
		}

		public function actionCheckCookie(){
			$cookie=new Cookie();
			if($cookie->isSetAccount()){
				$openId=$cookie->getAccount();
				$tableUser=new TableUser($openId);
				if($tableUser->isUserExist()){
					$cookie->setAccount($openId);
					print_r(json_encode($tableUser->getUserInfo()));
				}
				else{
					$cookie->unsetAccount();
					print_r(0);
				}
			}
			else{
				print_r(0);
			}
		}

		public function actionGetCookie(){
			$cookie=new Cookie();
			print_r($cookie->getAccount());
		}
	}