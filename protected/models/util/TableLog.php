<?php
	class Tabletable{
		private $id;
		private $result;

		public function __construct($id){
			$this->id=$id;
			$this->findByOpenId();
		}

		public function insertOneData($creatorId,$tableName){
			$model=new MysqlTable();
			$model->creatorId=$creatorId;
			$model->tableName=$tableName;
			$model->createTime=time();
			$model->save();
		}

		private function findByOpenId(){
			$criteria=new CDbCriteria();
			$criteria->condition='id=:id';
			$criteria->params=array(':id'=>$this->id);
			$this->result=MysqlTable::model()->find($criteria);	//如果查询内容不存在，会返回NULL;
		}

	}