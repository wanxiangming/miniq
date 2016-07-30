<?php
	include_once("protected/models/util/TableTable.php");
	include_once("protected/models/util/TableLink.php");

	class MysqlTableController extends Controller{

		public function actionCreateLogTable(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);

			$tableLog=new TableTable(0);
			$tableLog->insertOneData($obj->creatorId,$obj->logTableName);
			print_r(0);	
		}
	}

	