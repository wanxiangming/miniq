<?php
	
	include_once("protected/models/database/MiniqDB.php");

	class TestController extends Controller{
		
		public function actionBatchAdd(){
			$this->render('BatchAdd');
		}

		public function actionPaging(){
			$criteria=new CDbCriteria();
			$criteria->condition='tableId=:tableId';
			$criteria->params=array(':tableId'=>1040);
			$count=MysqlTransaction::model()->count($criteria);
			$pages=new CPagination($count);
			$pages->pageSize=3;
			// $pages->CurrentPage=2;
			$pages->applyLimit($criteria);
			$categoryInfo=MysqlTransaction::model()->findAll($criteria);
			foreach ($categoryInfo as $key => $value) {
				print_r($value->content);
			}
			//print_r(json_encode($categoryInfo));
			$this->render('Paging',array('pages'=>$pages,'categoryInfo'=>$categoryInfo));
		}

		public function actionLinkTurn(){
			$miniqDB=new MiniqDB();
			$miniqDB->linkTurnToInherit();
		}

	}