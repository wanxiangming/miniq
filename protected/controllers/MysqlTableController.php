<?php
	include_once("protected/models/util/TableTable.php");
	include_once("protected/models/util/TableLink.php");
	include_once("protected/models/util/TableUser.php");
	include_once("protected/models/util/TableTransaction.php");

	class MysqlTableController extends Controller{

		public function actionCreateLogTable(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);

			$tableTable=new TableTable();
			$tableId=$tableTable->insertOneData($obj->creatorId,$obj->logTableName);

			$tableLink=new TableLink();
			$tableLink->insertOneData($obj->creatorId,$tableId,$obj->logTableName);
			print_r(0);		//表示创建成功
		}

		/*
		[
		  {
		    "userId": "67EB8F9DA303F184014F9268D8294156", 
		    "tableId": "100009", 
		    "anotherName": "34070202班", 
		    "creatorId": "67EB8F9DA303F184014F9268D8294156", 
		    "tableState": "1"
		  }
		]
		 */
		public function actionGetLogTableList(){
			$openId=$_GET['openId'];
			
			$ary=array();
			$tableLink=new TableLink();
			$linkResult=$tableLink->getAllByUserId($openId);
			if($linkResult != NULL){
				$tableTable=new TableTable();
				foreach ($linkResult as $key => $value) {
					$tableId=$value['tableId'];
					$tableResult=$tableTable->getById($tableId);
					if($tableResult != NULL){
						$value['creatorId']=$tableResult['creatorId'];
						$value['tableState']=$tableResult['tableState'];
						$value['visibilityState']=$tableResult['visibilityState'];
					}
					$ary[]=$value;
				}
				print_r(json_encode($ary));
			}
			else{
				print_r(0);	//0表示该用户未使用任何日程表
			}
		}

		public function actionChangeLogTableName(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);

			$tableTable=new TableTable();
			if($tableTable->changeTableName($obj->tableId,$obj->nickName)){
				$tableLink=new TableLink();
				if($tableLink->changeAnotherName($obj->openId,$obj->tableId,$obj->nickName)){
					print_r(0);	//0表示数据操作成功
				}
				else{
					print_r(1);	//1表示anotherName修改失败
				}
			}
			else{
				print_r(2);	//2表示tableName修改失败
			}
		}

		public function actionChangeLogTableAnotherName(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);

			$tableLink=new TableLink();
			if($tableLink->changeAnotherName($obj->openId,$obj->tableId,$obj->nickName)){
				print_r(0);	//0表示数据操作成功
			}
			else{
				print_r(1);	//1表示anotherName修改失败
			}
		}

		public function actionDeprecatedLogTable(){
			$openId=$_GET['openId'];
			$tableId=$_GET['tableId'];

			$tableTable=new TableTable();
			if($tableTable->changeTableState($tableId)){
				$tableLink=new TableLink();
				if($tableLink->deleteOne($openId,$tableId)){
					print_r(0);	//0表示操作成功
				}
				else{
					print_r(1);	//1表示tablelink数据删除失败
				}
			}
			else{
				print_r(2);//2表示tablestate修改失败
			}
		}

		public function actionCancelAttention(){
			$openId=$_GET['openId'];
			$tableId=$_GET['tableId'];

			$tableLink=new TableLink();
			if($tableLink->deleteOne($openId,$tableId)){
				print_r(0);	//0表示操作成功
			}
			else{
				print_r(1);	//1表示tablelink数据删除失败
			}
		}

		public function actionPayAttention(){
			$openId=$_GET['openId'];
			$tableId=$_GET['tableId'];

			$tableTable=new TableTable();
			$tableResult=$tableTable->getById($tableId);
			if($tableResult != NULL){
				$tableLink=new TableLink();
				$tableLink->insertOneData($openId,$tableId,$tableResult['tableName']);
				print_r(1);	//1表示关注成功
			}
			else{
				print_r(0);	//2表示关注失败，不存在该日程表
			}
		}

		public function actionSearchTableByTableId(){
			$tableId=$_GET['tableId'];
			$openId=$_GET['openId'];

			$tableTable=new TableTable();
			$tableResult=$tableTable->getById($tableId);
			if($tableResult!=NULL && $tableResult['visibilityState']!=0){
				$tableLink=new TableLink();
				if($tableLink->isExist($openId,$tableId))
					$tableResult['isAttention']=1;	//已关注
				else
					$tableResult['isAttention']=0;
				
				print_r(json_encode($tableResult));
			}
			else{
				print_r(0);	//没有这张日程表或者该日程表是私有的，都返回0
			}
		}

		public function actionOpenTheTable(){
			$tableId=$_GET['tableId'];

			$tableTable=new TableTable();
			if($tableTable->changeTableVisibilityState($tableId)){
				print_r(0);	//修改成功返回0
			}
			else{
				print_r(1);
			}
		}
	}

	