<?php

	/**
	 * actionAddManager()
	 * actionRepealManager()
	 */
	
	include_once("protected/models/database/MiniqDB.php");
	include_once("protected/models/util/Cookie.php");

	class MysqlTableManagerGroupController extends Controller{


		public function actionAddManager(){
			$tableId=$_GET['tableId'];
			$followerId=$_GET['followerId'];

			$miniqDB=new MiniqDB();
			$miniqDB->insertManager($tableId,$followerId);
			print_r(1);
		}

		public function actionRepealManager(){
			$tableId=$_GET['tableId'];
			$followerId=$_GET['followerId'];

			$miniqDB=new MiniqDB();
			$miniqDB->deleteManager($tableId,$followerId);
			print_r(1);
		}

	}


















