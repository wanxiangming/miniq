<?php
	/**
	 *	它要接收主线ID是因为待办事项是无法脱离主线的，因为我们是从重要，非重要，及时，非及时的角度分类的，所以
	 *	主线是待办事项工作的一个重要组成部分
	 * 
	 * TableBacklog(userId,inUseMainLineId)
	 * 		add(content,isMainLine,isRecent)	添加数据成功返回该条数据的ID，失败则返回-1
	 * 		remove(id)	删除成功返回true，失败返回false
	 * 		complete(id)	设置成功刚返回true，失败返回false
	 * 		getAll()	有数据返回存储了数据的数组，该数组中的数据不包括userId字段，没数据返回空数组
	 * 		getAllComplete()
	 * 		getAllUncomplete()
	 * 		change(id,content,isMainLine,isRecent)	设置成功刚返回true，失败返回false
	 * 		setContent(id,content)	设置成功刚返回true，失败返回false
	 * 		setToRecent(id)	设置成功刚返回true，失败返回false
	 * 		setToNotRecent(id)	设置成功刚返回true，失败返回false
	 * 		setToMainLine(id)	修改isMainLine字段为1，并修改mainLineId字段为指定ID，设置成功刚返回true，失败返回false
	 * 		setToNotMainLine(id)	看该待办事项是否从属于指定主线，如果从属那么把该字段修改为NULL，并修改
	 * 			isMainLine字段为0，如果该待办事项从属于其他主线，那么这里不做任何修改，设置成功刚返回true，失败返回false
	 */
	class TableBacklog{
		const MAIN_LINE=1;
		const NOT_MAIN_LINE=0;
		const RECENT=1;
		const NOT_RECENT=0;
		const COMPLETE=1;
		const UNCOMPLETE=0;

		private $userId;
		private $inUseMainLineId;

		public function __construct($userId,$inUseMainLineId){
			$this->userId=$userId;
			$this->inUseMainLineId=$inUseMainLineId;
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

		public function add($content,$isMainLine,$isRecent){
			$model=new MysqlBacklog();
			$model->userId=$this->userId;
			$model->content=$content;
			$model->createTime=$this->getCurrentTime();
			$model->isComplete=self::UNCOMPLETE;
			if($isMainLine){
				$model->isMainLine=self::MAIN_LINE;
				$model->mainLineId=$this->inUseMainLineId;
			}
			else{
				$model->isMainLine=self::NOT_MAIN_LINE;
			}

			if($isRecent){
				$model->isRecent=self::RECENT;
			}
			else{
				$model->isRecent=self::NOT_RECENT;
			}

			if($model->save()){
				return $model->id;
			}
			else{
				return -1;
			}
		}

		public function complete($id){
			$result=$this->findById($id);
			$result->isComplete=self::COMPLETE;
			$result->completeTime=$this->getCurrentTime();
			return $result->save();
		}

		private function getCurrentTime(){
			return time()*1000;
		}

		public function change($id,$content,$isMainLine,$isRecent){
			$result=$this->findById($id);
			$result=$this->changeContent($result,$content);
			$result=$this->changeMainLine($result,$isMainLine);
			$result=$this->changeIsRecent($result,$isRecent);
			return $result->save();
		}

		public function setContent($id,$content){
			$result=$this->findById($id);
			$result=$this->changeContent($result,$content);
			return $result->save();
		}

		private function changeContent($result,$content){
			$result->content=$content;
			return $result;
		}

		public function setToRecent($id){
			$result=$this->findById($id);
			$result=$this->changeIsRecent($result,true);
			return $result->save();
		}

		public function setToNotRecent($id){
			$result=$this->findById($id);
			$result=$this->changeIsRecent($result,false);
			return $result->save();
		}

		private function changeIsRecent($result,$isRecent){
			if($isRecent){
				$result->isRecent=self::RECENT;
			}
			else{
				$result->isRecent=self::NOT_RECENT;
			}
			return $result;
		}

		public function setToMainLine($id){
			$result=$this->findById($id);
			$result=$this->changeMainLine($result,true);
			return $result->save();
		}

		public function setToNotMainLine($id){
			$result=$this->findById($id);
			$result=$this->changeMainLine($result,false);
			return $result->save();
		}

		private function changeMainLine($result,$isMainLine){
			if($isMainLine){
				$result->isMainLine=self::MAIN_LINE;
				$result->mainLineId=$this->inUseMainLineId;
			}
			else{
				if($result->isMainLine==true && $result->mainLineId==$this->inUseMainLineId){
					$result->isMainLine=self::NOT_MAIN_LINE;
					$result->mainLineId=NULL;
				}
				else{
					;
				}
			}
			return $result;
		}

		private function findById($id){
			$criteria=new CDbCriteria();
			$criteria->condition="userId=:userId && id=:id";
			$criteria->params=array(':userId'=>$this->userId,':id'=>$id);
			return MysqlBacklog::model()->find($criteria);
		}

		public function getAll(){
			$result=$this->findAll();
			return $this->encodeFindAllResultToArray($result);
		}

		private function findAll(){
			$criteria=new CDbCriteria();
			$criteria->condition="userId=:userId";
			$criteria->params=array(':userId'=>$this->userId);
			return MysqlBacklog::model()->findAll($criteria);
		}

		public function getAllUncomplete(){
			$result=$this->findAllUncomplete();
			return $this->encodeFindAllResultToArray($result);
		}

		private function findAllUncomplete(){
			$criteria=new CDbCriteria();
			$criteria->condition="userId=:userId && isComplete=:isComplete";
			$criteria->params=array(':userId'=>$this->userId,':isComplete'=>self::UNCOMPLETE);
			return MysqlBacklog::model()->findAll($criteria);
		}

		public function getAllComplete(){
			$result=$this->findAllComplete();
			return $this->encodeFindAllResultToArray($result);
		}

		private function findAllComplete(){
			$criteria=new CDbCriteria();
			$criteria->condition="userId=:userId && isComplete=:isComplete";
			$criteria->params=array(':userId'=>$this->userId,':isComplete'=>self::COMPLETE);
			return MysqlBacklog::model()->findAll($criteria);
		}

		private function encodeFindAllResultToArray($result){
			$backlogAry=array();
			if(empty($result)){

			}
			else{
				foreach ($result as $key => $value) {
					$backlog=array();
					$backlog['id']=$value->id;
					$backlog['content']=$value->content;
					$backlog['isMainLine']=($value->isMainLine == self::MAIN_LINE) ? true:false;
					$backlog['mainLineId']=$value->mainLineId;
					$backlog['isRecent']=($value->isRecent == self::RECENT) ? true:false;
					$backlog['isComplete']=($value->isComplete == self::COMPLETE) ? true:false;
					$backlog['createTime']=$value->createTime;
					$backlog['completeTime']=$value->completeTime;
					$backlogAry[]=$backlog;
				}
			}
			return $backlogAry;
		}
	}