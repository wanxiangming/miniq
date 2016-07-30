<?php
	include_once("protected/models/util/TableTransaction.php");

	class MysqlTransactionController extends Controller{

		public function actionAddTransaction(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);

			$tableTransaction=new TableTransaction();
			$tableTransaction->insertOneData($obj->tableId,$obj->time,$obj->content);
			print_r(0);
		}
	}














