<?php
	
	class MainController extends Controller{
		public function actionMain(){
			$this->render('Main');
		}
		
		public function actionTest(){
			$this->render('Test');
		}
		
		public function actionScheduleManager(){
			$this->render('ScheduleManager');
		}
	}