<?php
	/**
	 * Cookie()
	 * 		isSetAccount()
	 * 		setAccount(String account)
	 * 		unsetAccount()
	 * 		getAccount()	//return String account(cookie value) or NULL
	 * 		
	 */

	class Cookie{
		const MONTH=2592000;	//30天 30*24*60*60
		const C_ACCOUNT='account';
		
		private $cookie=NULL;

		public function __construct(){
			$this->cookie=Yii::app()->request->getCookies();
		}

		public function isSetAccount(){
			return $this->cookie->contains(self::C_ACCOUNT);
		}

		public function setAccount($account){
			$cookie=new CHttpCookie(self::C_ACCOUNT,$account);
			$cookie->expire=time()+self::MONTH;
			$cookie->httpOnly=true;
			$this->cookie->add(self::C_ACCOUNT,$cookie);
		}

		public function getAccount(){
			if($this->isSetAccount()){
				return $this->cookie->itemAt(self::C_ACCOUNT)->value;
			}
			else{
				return NULL;
			}
		}

		public function unsetAccount(){
			if($this->isSetAccount()){
				$this->cookie->remove(self::C_ACCOUNT);
			}
		}
	}


