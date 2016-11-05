<?php
	class TableTransaction{
		private $aDay=86400000;

		public function __construct(){

		}

		public function getInfoByTableIdAndTime($tableId,$beginTime,$dayNum){
			$result=$this->findByTableIdAndTime($tableId,$beginTime,$dayNum);
			$allAry=array();
			if(!empty($result)){
				foreach ($result as $key => $value) {
					$singleAry=array();
					$singleAry['id']=$value->id;
					$singleAry['content']=$value->content;
					$singleAry['time']=$value->time;
					$singleAry['tableId']=$tableId;
					$allAry[]=$singleAry;
				}
			}
			return $allAry;
		}

		private function findByTableIdAndTime($tableId,$beginTime,$dayNum){
			$timeInterval=$this->aDay*$dayNum;
			$criteria=new CDbCriteria();
			$criteria->order='id asc';
			$criteria->condition='tableId=:id && time<=:finishTime && time>=:beginTime';
			$criteria->params=array(':id'=>$tableId,':finishTime'=>$beginTime+$timeInterval,':beginTime'=>$beginTime);
			return MysqlTransaction::model()->findAll($criteria);
		}

		public function insertOneData($tableId,$time,$content){
			$model=new MysqlTransaction();
			$model->tableId=$tableId;
			$model->time=$time;
			$model->content=$content;
			if($model->save()){
				return $model->attributes['id'];
			}
			else{
				return -1;
			}
		}

		public function changeOneData($id,$time,$content){
			$result=$this->findById($id);
			if($result != NULL){
				$result->time=$time;
				$result->content=$content;
				if($result->save()){
					return true;
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
		}

		public function deleteOneData($id){
			$result=$this->findById($id);
			$result->delete();
		}

		private function findById($id){
			$criteria=new CDbCriteria();
			$criteria->condition='id=:id';
			$criteria->params=array(':id'=>$id);
			return MysqlTransaction::model()->find($criteria);
		}

		public function removeAllByTableId($tableId){
			$criteria=new CDbCriteria();
			$criteria->condition='tableId=:tableId';
			$criteria->params=array(':tableId'=>$tableId);
			MysqlTransaction::model()->deleteAll($criteria);
		}

		public function getCountOfHistory($tableIdAry){
			return MysqlTransaction::model()->count($this->historyCDbCriteria($tableIdAry));
		}

		public function getHistoryTransactionAry($tableIdAry,$page){
			$criteria=$this->historyCDbCriteria($tableIdAry);
			$count=MysqlTransaction::model()->count($criteria);
			$pages=new CPagination($count);
			$pages->pageSize=20;
			$pages->CurrentPage=($page-1);
			$pages->applyLimit($criteria);
			$result=MysqlTransaction::model()->findAll($criteria);
			return $this->encodeDataToTransactionAry($result);
		}

		private function historyCDbCriteria($tableIdAry){
			$time=$this->todayBeginTimestamp();
			$criteria=new CDbCriteria();
			$criteria->order="time DESC";
			$criteria->addCondition("time<".$time);
			$criteria->addInCondition("tableId",$tableIdAry);
			return $criteria;
		}

		public function getTransactionAry($tableIdAry){
			$criteria=$this->futureCDbCriteria($tableIdAry);
			$result=MysqlTransaction::model()->findAll($criteria);
			return $this->encodeDataToTransactionAry($result);
		}

		private function encodeDataToTransactionAry($result){
			$transactionAry=array();
			foreach ($result as $key => $value) {
				$transaction=array();
				$transaction['id']=$value->id;
				$transaction['content']=$value->content;
				$transaction['time']=$value->time;
				$transaction['tableId']=$value->tableId;
				$transactionAry[]=$transaction;
			}
			return $transactionAry;
		}

		private function futureCDbCriteria($tableIdAry){
			$time=$this->todayBeginTimestamp();
			$criteria=new CDbCriteria();
			// $criteria->order="time DESC";
			$criteria->addCondition("time>".$time);
			$criteria->addInCondition("tableId",$tableIdAry);
			return $criteria;
		}

		private function todayBeginTimestamp(){
			$dateTime=new DateTime();
			$dateTime=$dateTime->setTime(0,0,0);
			return ($dateTime->getTimestamp())*1000;
		}
	}























