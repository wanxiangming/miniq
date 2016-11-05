<?php
	/**
	 * 1，取消关注的时候要自动从其管理员名单中移除
	 * 2，表被弃用的时候要自动移除其所有管理员
	 * 
	 * TableTableManagerGroup()
	 * 		add($managerId,$tableId)	//添加管理员，返回int，-1表示保存失败，-2表示该管理员已经存在，保存成功返回新添加数据的ID
	 * 		remove($managerId,$tableId)	//移除管理员，返回boolean
	 * 		removeAll($tableId)			//移除某表的所有管理员
	 * 		isManager($managerId,$tableId)	//查询某用户是否是某表的管理员，返回boolean
	 * 		getAllManager($tableId)		//取得某表所有管理员名单，返回的是该表managerId字段组成的数组，没有数据返回空数组
	 */
	class TableTableManagerGroup{

		public function __construct(){

		}

		public function add($managerId,$tableId){
			$result=$this->find($managerId,$tableId);
			if($result == NULL){
				$model=new MysqlTableManagerGroup();
				$model->managerId=$managerId;
				$model->tableId=$tableId;
				if($model->save()){
					return $model->id;
				}
				else{
					return -1;
				}
			}
			else{
				return -2;
			}
		}

		public function remove($managerId,$tableId){
			$result=$this->find($managerId,$tableId);
			if($result != NULL){
				if($result->delete() == 1){
					return true;
				}
				else{
					return false;
				}
			}
			else{
				return true;
			}
		}

		public function isManager($managerId,$tableId){
			if($this->find($managerId,$tableId) == NULL){
				return false;
			}
			else{
				return true;
			}
		}

		private function find($managerId,$tableId){
			$criteria=new CDbCriteria();
			$criteria->condition="managerId=:managerId && tableId=:tableId";
			$criteria->params=array(':managerId'=>$managerId,':tableId'=>$tableId);
			return MysqlTableManagerGroup::model()->find($criteria);
		}

		public function removeAll($tableId){
			$criteria=new CDbCriteria();
			$criteria->condition="tableId=:tableId";
			$criteria->params=array(':tableId'=>$tableId);
			MysqlTableManagerGroup::model()->deleteAll($criteria);
			return true;
		}

		public function getAllManager($tableId){
			$criteria=new CDbCriteria();
			$criteria->condition="tableId=:tableId";
			$criteria->params=array(':tableId'=>$tableId);
			$result=MysqlTableManagerGroup::model()->findAll($criteria);
			$ary=array();
			foreach ($result as $key => $value) {
				$ary[]=$value->managerId;
			}
			return $ary;
		}
	}