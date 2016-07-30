<?php
	include_once("protected/models/util/TableUser.php");
	include_once("protected/models/util/TableTable.php");
	include_once("protected/models/util/TableLink.php");
	
	class MysqlUserController extends Controller{
		
		public function actionLoginCheck(){
			$openId=$_GET['openId'];

			$tableUser=new TableUser($openId);
			if($tableUser->isUserExist()){
				print_r(json_encode($tableUser->getUserInfo()));
			}
			else{
				$tableUser->insertOneData();	
				$tableTable=new TableTable();
				$tableId=$tableTable->insertOneData($openId,"我的日程");
				$tableLink=new TableLink();
				$tableLink->insertOneData($openId,$tableId,"我的日程");
				print_r(300);	//如果该用户是第一次注册，则向前端发送300
			}
		}

		public function actionChangeNickName(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);

			$tableUser=new TableUser($obj->openId);
			if($tableUser->changeNickName($obj->nickName))
				print_r(0);		//修改昵称成功
			else
				print_r(301);	//修改昵称失败，该用户不存在
		}
	}
