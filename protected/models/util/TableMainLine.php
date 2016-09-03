<?php
	/**
	 * TableMainLine(userId)
	 * 		setInUse(id)
	 * 		getInUse()	取到数据返回数据形如['id'=1,'content'='内容']，未取到数据返回空数组
	 * 		add(content)	添加成功返回所添加条目的id，如果添加失败则返回-1
	 * 		remove(id)	移除成功返回true，失败返回false
	 * 		changeContent(id,content)	操作成功返回true，失败返回false
	 */
	class TableMainLine{
		const IN_USE=1;
		const NOT_USED=0;

		private $userId;

		public function __construct($userId){
			$this->userId=$userId;
		}

		public function add($content){
			$model=new MysqlMainLine();
			$model->userId=$this->userId;
			$model->content=$content;
			$model->useCondition=self::IN_USE;
			if($model->save()){		//这里可以做实验，验证一下save成功或者失败时返回的是什么
				$this->setInUse($model->id);
				return $model->id;
			}
			else{
				return -1;
			}
		}

		public function setInUse($id){
			$result=$this->findAll();
			if(empty($result)){
				;
			}
			else{
				foreach ($result as $key => $value) {
					if($value->id==$id){
						$value->useCondition=self::IN_USE;
						$value->save();
					}
					else if($value->useCondition==self::IN_USE){
						$value->useCondition=self::NOT_USED;
						$value->save();
					}
				}
			}
		}

		private function findAll(){
			$criteria=new CDbCriteria();
			$criteria->condition="userId=:userId";
			$criteria->params=array(':userId'=>$this->userId);
			return MysqlMainLine::model()->findAll($criteria);
		}

		public function getInUse(){
			$result=$this->findOneInUse();
			$ary=array();
			if($result != NULL){
				$ary['id']=$result->id;
				$ary['content']=$result->content;
			}
			return $ary;
		}

		private function findOneInUse(){
			$criteria=new CDbCriteria();
			$criteria->condition="userId=:userId && useCondition=:useCondition";
			$criteria->params=array(':userId'=>$this->userId,':useCondition'=>self::IN_USE);
			return MysqlMainLine::model()->find($criteria);
		}

		public function remove($id){
			$result=$this->findById($id);
			if($result != NULL){
				if($result->delete() == 1){
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

		public function changeContent($id,$content){
			$result=$this->findById($id);
			if($result != NULL){
				$result->content=$content;
				return $result->save();
			}
			else{
				return false;
			}
		}

		private function findById($id){			
			$criteria=new CDbCriteria();
			$criteria->condition="userId=:userId && id=:id";
			$criteria->params=array(':userId'=>$this->userId,':id'=>$id);
			return MysqlMainLine::model()->find($criteria);
		}
	}