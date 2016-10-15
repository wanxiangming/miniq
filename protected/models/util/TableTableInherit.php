<?php
	/**
	 * TableTableInherit()
	 * 		add(childTableId,parentTableId)	向继承表中添加一条数据,插入成功返回新数据ID，保存失败返回-1，已存在返回-2，循环继承错误返回-3,
	 * 		remove(childTableId,parentTableId)	从继承表中移除一条数据，成功返回true，失败返回false
	 * 		removeAllAsParentTable(parentTableId)	移除所有以此表为父表的数据，成功放回true，失败返回false
	 * 		removeAllAsChildTable(childTableId)		移除所有以此表为子表的数据，成功返回true，失败返回false
	 * 		getParentTableId(childTableId)	查询某个表是否具有父表，如果有返回其所有父表的ID组成的数组，没有返回空数组
	 * 		getAllParentTableId(childTableId)	查询某个表是否具有父表，如果有返回其所有"继承结构上层"的ID组成的数组，没有返回空数组
	 * 		getChildTableId(parentTableId)	查询某个表是否具有子表，如果有返回其所有子表的ID组成的数组，没有返回空数组
	 * 		getAllChildTableId(parentTableId)	查询某个表是否具有子表，如果有返回其所有"继承结构下层"的ID组成的数组，没有返回空数组
	 */
	class TableTableInherit{

		public function __construct(){

		}

		public function add($childTableId,$parentTableId){
			if($this->find($childTableId,$parentTableId) == NULL){
				if($this->inheritChildErrorCheck($childTableId,$parentTableId)  &&  $childTableId != $parentTableId){
					$model=new MysqlTableInherit();
					$model->childTableId=$childTableId;
					$model->parentTableId=$parentTableId;
					if($model->save()){
						return $model->id;
					}
					else{
						return -1;
					}
				}
				else{
					return -3;
				}
			}
			else{
				return -2;
			}
		}

		private function inheritChildErrorCheck($who,$inheritGoal){
			$result=$this->getAllChildTableId($who);
			foreach ($result as $key => $value) {
				if($value == $inheritGoal){
					return false;
				}
			}
			return true;
		}

		public function remove($childTableId,$parentTableId){
			$result=$this->find($childTableId,$parentTableId);
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

		private function find($childTableId,$parentTableId){
			$criteria=new CDbCriteria();
			$criteria->condition="childTableId=:childTableId && parentTableId=:parentTableId";
			$criteria->params=array(':childTableId'=>$childTableId,':parentTableId'=>$parentTableId);
			return MysqlTableInherit::model()->find($criteria);
		}

		public function getAllChildTableId($parentTableId){
			$result=$this->getChildTableId($parentTableId);
			foreach ($result as $key => $value) {
				$result=array_merge($result,$this->getAllChildTableId($value));
			}
			return array_unique($result);
		}

		public function getChildTableId($parentTableId){
			$result=$this->findAllByParentTableId($parentTableId);
			$ary=array();
			foreach ($result as $key => $value) {
				$ary[]=$value->childTableId;
			}
			return $ary;
		}

		private function findAllByParentTableId($parentTableId){
			$criteria=new CDbCriteria();
			$criteria->select="childTableId";
			$criteria->condition="parentTableId=:parentTableId";
			$criteria->params=array(':parentTableId'=>$parentTableId);
			return MysqlTableInherit::model()->findAll($criteria);
		}

		public function getAllParentTableId($childTableId){
			$result=$this->getParentTableId($childTableId);
			foreach ($result as $key => $value) {
				$result=array_merge($result,$this->getAllParentTableId($value));
			}
			return array_unique($result);
		}

		public function getParentTableId($childTableId){
			$result=$this->findAllByChildTableId($childTableId);
			$ary=array();
			foreach ($result as $key => $value) {
				$ary[]=$value->parentTableId;
			}
			return $ary;
		}

		private function findAllByChildTableId($childTableId){
			$criteria=new CDbCriteria();
			$criteria->select="parentTableId";
			$criteria->condition="childTableId=:childTableId";
			$criteria->params=array(':childTableId'=>$childTableId);
			return MysqlTableInherit::model()->findAll($criteria);
		}

		public function removeAllAsParentTable($parentTableId){
			$criteria=new CDbCriteria();
			$criteria->condition="parentTableId=:parentTableId";
			$criteria->params=array(':parentTableId'=>$parentTableId);
			MysqlTableInherit::model()->deleteAll($criteria);
			// if(MysqlTableInherit::model()->deleteAll($criteria) > 0 ){
				return true;
			// }
			// else{
			// 	return false;
			// }
		}

		public function removeAllAsChildTable($childTableId){
			$criteria=new CDbCriteria();
			$criteria->condition="childTableId=:childTableId";
			$criteria->params=array(':childTableId'=>$childTableId);
			MysqlTableInherit::model()->deleteAll($criteria);
			// if(MysqlTableInherit::model()->deleteAll($criteria) > 0 ){
				return true;
			// }
			// else{
			// 	return false;
			// }
		}
	}