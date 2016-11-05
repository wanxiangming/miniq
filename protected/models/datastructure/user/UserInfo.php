<?php
	/**
	 * UserInfo(int $userId,String $userName,String $openId,String $email,long $registerTime)
	 * 		getOpenId()
	 * 		getEmail()
	 * 		getRegisterTime()
	 *
	 * 		setOpenId()
	 * 		setEmail()
	 *
	 * 		methods inherited from class User
	 * 		 	getUserId()
	 * 		  	getUserName()
	 * 		  	
	 * 		  	setUserName()
	 */

	class UserInfo extends User{
		private $openId;
		private $registerTime;
		private $email;

		public function __construct($userId,$userName,$openId,$email,$registerTime){
			parent::__construct($userId,$userName);
			$this->openId=$openId;
			$this->email=$email;
			$this->registerTime=$registerTime;
		}

		public function setOpenId($openId){
			$this->openId=$openId;
		}

		public function getOpenId(){
			return $this->openId;
		}

		public function setEmail($email){
			$this->email=$email;
		}

		public function getEmail(){
			return $this->email;
		}

		public function getRegisterTime(){
			return $this->registerTime;
		}
	}




