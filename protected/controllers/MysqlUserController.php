<?php
	include_once("protected/models/database/MiniqDB.php");
	include_once("protected/models/util/Cookie.php");

	class MysqlUserController extends Controller{
		
		//没有用户新建用户 并建立cookie
		public function actionLoginCheck(){
			$openId=$_GET['openId'];

			$miniqDB=new MiniqDB();
			if($miniqDB->isUserExist($openId)){	
				//该用户已经注册过了	
				$userInfo=$miniqDB->getUserInfo($openId);
				$result=array();
				$result['id']=$userInfo->getUserId();
				$result['nickName']=$userInfo->getUserName();
				$result['openId']=$userInfo->getOpenId();
				$result['email']=$userInfo->getEmail();
				$result['registerTime']=$userInfo->getRegisterTime();
				print_r(json_encode($result));
			}
			else{
				//该用户还没有注册，添加新的用户数据								
				$miniqDB->insertUser($openId);
				print_r(300);	//如果该用户是第一次注册，则向前端发送300
			}

			//无论是新用户还是已存在的用户，我们都给前端设置cookie
			$cookie=new Cookie();
			$cookie->setAccount($openId);
		}

		public function actionChangeNickName(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);
			$nickName=$obj->nickName;
			$openId=$obj->openId;

			$miniqDB=new MiniqDB();
			$miniqDB->changeUserName($openId,$nickName);

			print_r(0);
		}

		public function actionAlterUserInfo(){
			$cookie=new Cookie();
			$openId=$cookie->getAccount();
			$json=file_get_contents("php://input");
			$obj=json_decode($json);

			$miniqDB=new MiniqDB();
			$miniqDB->changeUserName($openId,$obj->nickName);

			print_r(0);
		}
	}
