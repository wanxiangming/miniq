<?php
	/**
	 * TableLink()
	 * 		insertOneData($userId,$tableId,$anotherName)
	 * 		getAllByUserId($userId)
	 * 		getAllUserByTableId($tableId)
	 * 		changeAnotherName($userId,$tableId,$anotherName)
	 * 		deleteOne($userId,$tableId)
	 * 		deleteAllByTableId($tableId)
	 * 		isExist($userId,$tableId)
	 * 		
	 */


	class TableLink{
		public function __construct(){

		}

		public function insertOneData($userId,$tableId,$anotherName){
			$model=new MysqlLink();
			$model->userId=$userId;
			$model->tableId=$tableId; 
			$model->anotherName=$anotherName;
			$model->save();
		}

		public function getAllByUserId($userId){
			$result=$this->findAllByUserId($userId);
			$allAry=array();
			if(empty($result)){
				return NULL;
			}
			else{
				foreach ($result as $key => $value) {
					$singleAry=array();
					$singleAry['userId']=$value->userId;
					$singleAry['tableId']=$value->tableId;
					$singleAry['anotherName']=$value->anotherName;
					$allAry[]=$singleAry;
				}
				return $allAry;
			}
		}
		
		private function findAllByUserId($userId){
			$criteria=new CDbCriteria();
			$criteria->order='id asc';
			$criteria->condition='userId=:userId';
			$criteria->params=array(':userId'=>$userId);
			return MysqlLink::model()->findAll($criteria);
		}

		public function getAllByTableId($tableId){
			$criteria=new CDbCriteria();
			$criteria->order='id asc';
			$criteria->condition='tableId=:tableId';
			$criteria->params=array(':tableId'=>$tableId);
			$result=MysqlLink::model()->findAll($criteria);
			$ary=array();
			foreach ($result as $key => $value) {
				$singleAry=array();
				$singleAry['userId']=$value->userId;
				$singleAry['tableId']=$value->tableId;
				$singleAry['anotherName']=$value->anotherName;
				$ary[]=$singleAry;
			}
			return $ary;
		}

		public function changeAnotherName($userId,$tableId,$anotherName){
			$result=$this->findByUserIdAndTableId($userId,$tableId);
			if($result == NULL){
				return false;
			}
			else{
				$result->anotherName=$anotherName;
				$result->save();
				return true;
			}
		}

		public function deleteOne($userId,$tableId){
			$result=$this->findByUserIdAndTableId($userId,$tableId);
			if($result != NULL){
				$result->delete();
				return true;
			}
			else{
				return false;
			}
		}

		public function isExist($userId,$tableId){
			$result=$this->findByUserIdAndTableId($userId,$tableId);
			if($result == NULL)
				return false;
			else
				return true;
		}

		private function findByUserIdAndTableId($userId,$tableId){
			$criteria=new CDbCriteria();
			$criteria->condition='userId=:userId && tableId=:tableId';
			$criteria->params=array(':userId'=>$userId,':tableId'=>$tableId);
			return MysqlLink::model()->find($criteria);
		} 

		public function deleteAllByTableId($tableId){
			$criteria=new CDbCriteria();
			$criteria->condition="tableId=:tableId";
			$criteria->params=array(':tableId'=>$tableId);
			MysqlLink::model()->deleteAll($criteria);
		}

	}
	












