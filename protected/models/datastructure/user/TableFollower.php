<?php
	/**
	 * TableFollower(int $userId,String $userName,boolean $isManager,boolean $isCreator)
	 * 		isManager()
	 * 		isCreator()
	 *
	 * 		methods inherited from class User
	 * 			getUserId()
	 * 		 	getUserName()
	 */

	class TableFollower extends User{
		private $isManager;
		private $isCreator;

		public function __construct($userId,$userName,$isManager,$isCreator){
			parent::__construct($userId,$userName);
			$this->isManager=(boolean)$isManager;
			$this->isCreator=(boolean)$isCreator;
		}

		public function isManager(){
			return $this->isManager;
		}

		public function isCreator(){
			return $this->isCreator;
		}
	}



