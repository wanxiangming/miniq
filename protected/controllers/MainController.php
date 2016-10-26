<?php

	class MainController extends Controller{
		public $defaultAction = 'Main';
		public function actionMain(){
			$this->render('Main');
		}
	}