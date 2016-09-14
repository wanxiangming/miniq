<?php
	include_once("protected/models/util/TableTransaction.php");
	include_once("protected/models/util/TableLink.php");
	include_once("protected/models/util/TableTable.php");

	class MysqlTransactionController extends Controller{

		public function actionGetTransactionByTimeAry(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);
			$openId=Yii::app()->request->cookies['openId']->value;

			$intervalDay=1;
			$tableAry=array();
			$tableResult=$this->getTableInfo($openId);
			$tableTransaction=new TableTransaction();
			
			if($tableResult != NULL){
				foreach ($tableResult as $tableKey => $tableValue) {
					$transactionAry=array();
					foreach ($obj->time as $timeKey => $timeValue) {
						$transactionResult=$tableTransaction->getInfoByTableIdAndTime($tableValue['tableId'],$timeValue,$intervalDay);
						if($transactionResult != NULL){
							$transactionAry[]=$transactionResult;
						}
					}
					$tableValue['transactionInfo']=$transactionAry;
					$tableAry[]=$tableValue;
				}
				print_r(json_encode($tableAry));
			}
			else{
				print_r(0);	//该用户tableLink没有记录
			}
			
		}

		public function actionAddTransaction(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);

			$tableTransaction=new TableTransaction();
			print_r($tableTransaction->insertOneData($obj->tableId,$obj->time,$obj->content));
		}

		public function actionChangeTransaction(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);

			$tableTransaction=new TableTransaction();
			$tableTransaction->changeOneData($obj->transactionId,$obj->time,$obj->content);
			print_r(0);
		}

		public function actionDeleteTransaction(){
			$logTransactionId=$_GET['logTransactionId'];

			$tableTransaction=new TableTransaction();
			$tableTransaction->deleteOneData($logTransactionId);
			print_r(0);
		}

		private function getTableInfo($openId){
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
					}
					$ary[]=$value;
				}
				return $ary;
			}
			else{
				return NULL;	//该用户没有关注任何日志时返回NULL
			}
		}
	}












