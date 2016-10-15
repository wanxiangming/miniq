<?php

	/**
	 * actionAddManager()
	 * actionRepealManager()
	 */
	
	include_once("protected/models/util/TableTableManagerGroup.php");

	class MysqlTableManagerGroupController extends Controller{


		public function actionAddManager(){
			$tableId=$_GET['tableId'];
			$followerId=$_GET['followerId'];

			$tableManagerGroup=new TableTableManagerGroup();
			$tableManagerGroup->add($followerId,$tableId);
			print_r(1);
		}

		public function actionRepealManager(){
			$tableId=$_GET['tableId'];
			$followerId=$_GET['followerId'];

			$tableManagerGroup=new TableTableManagerGroup();
			$tableManagerGroup->remove($followerId,$tableId);
			print_r(1);
		}

	}


















