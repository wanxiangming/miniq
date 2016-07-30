<?php
	class TableTable{
		public function __construct(){
			
		}

		public function insertOneData($creatorId,$tableName){
			$model=new MysqlTable();
			$model->creatorId=$creatorId;
			$model->tableName=$tableName;
			$model->createTime=time();
			$model->save();
			return $model->attributes['id'];
		}

		public function getById($id){
			$result=$this->findById($id);
			
			if($result == NULL){
				return NULL;
			}
			else{
				$ary=array();
				$ary['id']=$result->id;
				$ary['creatorId']=$result->creatorId;
				$ary['createTime']=$result->createTime;
				$ary['tableName']=$result->tableName;
				$ary['tableState']=$result->tableState;
				$ary['visibilityState']=$result->visibilityState;
				return $ary;
			}
		}

		public function changeTableName($id,$tableName){
			$result=$this->findById($id);
			if($result == NULL){
				return false;
			}
			else{
				$result->tableName=$tableName;
				$result->save();
				return true;
			}
		}

		public function changeTableState($id){
			$result=$this->findById($id);
			if($result != NULL){
				$result->tableState=0;
				$result->save();
				return true;
			}
			else{
				return false;
			}
		}

		public function changeTableVisibilityState($id){
			$result=$this->findById($id);
			if($result != NULL){
				$result->visibilityState=1;
				$result->save();
				return true;
			}
			else{
				return false;
			}
		}

		private function findById($id){
			$criteria=new CDbCriteria();
			$criteria->condition='id=:id';
			$criteria->params=array(':id'=>$id);
			return MysqlTable::model()->find($criteria);	//如果查询内容不存在，会返回NULL;
		}

	}