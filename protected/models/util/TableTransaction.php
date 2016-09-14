<?php
	class TableTransaction{
		private $aDay=86400000;

		public function __construct(){

		}

		public function getInfoByTableIdAndTime($tableId,$beginTime,$dayNum){
			$result=$this->findByTableIdAndTime($tableId,$beginTime,$dayNum);
			if(!empty($result)){
				$allAry=array();
				foreach ($result as $key => $value) {
					$singleAry=array();
					$singleAry['id']=$value->id;
					$singleAry['content']=$value->content;
					$singleAry['time']=$value->time;
					$allAry[]=$singleAry;
				}
				return $allAry;
			}
			else{
				return NULL;
			}
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
			$model->save();
			return $model->attributes['id'];
		}

		public function changeOneData($id,$time,$content){
			$result=$this->findById($id);
			if($result != NULL){
				$result->time=$time;
				$result->content=$content;
				$result->save();
				return true;
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
	}























