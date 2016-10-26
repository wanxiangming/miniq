<?php
	class TableController extends Controller{
		
		public function actionTableInfo(){
			$this->render('TableInfo');
		}

		public function actionTableManage(){
			$this->render('TableManage');
		}
	}