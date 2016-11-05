<?php
	class TableUser{
		private $openId;
		private $result;

		public function __construct($openId){
			$this->openId=$openId;
			$this->findByOpenId();
		}

		public function isUserExist(){
			if($this->result != NULL)
				return true;
			else
				return false;
		} 

		public function getUserInfo(){
			$infoAry=array();
			$infoAry['id']=$this->result->id;
			$infoAry['openId']=$this->result->openId;
			$infoAry['nickName']=$this->result->nickName;
			$infoAry['email']=$this->result->email;
			$infoAry['registerTime']=$this->result->registerTime;
			return $infoAry;
		}

		public function insertOneData(){
			$model=new MysqlUser();
			$model->openId=$this->openId;
			$model->nickName=substr($this->openId,0,6);
			$model->registerTime=time();
			$model->save();
		}

		public function changeNickName($nickName){
			if($this->result != NULL){
				$this->result->nickName=$nickName;
				return $this->result->save();
			}
			else
				return false;
		}

		private function findByOpenId(){
			$criteria=new CDbCriteria();
			$criteria->condition='openId=:openId';
			$criteria->params=array(':openId'=>$this->openId);
			$this->result=MysqlUser::model()->find($criteria);	//如果查询内容不存在，会返回NULL;
		}
	}















