<?php

	/**
	 * 对Miniq数据库的操作不是单一的，当你移除一条table表数据的时候，它意味着同时要移除一些link表数据，transaction表数据
	 * 		managerGroup表数据，等等。所以这个类提供了对数据库操作的统一接口
	 * 		
	 * MiniqDB()
	 * 	public methods
	 * 		changeTableName(int $tableId,String tableName)	//返回boolean
	 * 		changeTableVisibilityState(int $tableId)		//只支持从私有变为公开，返回boolean
	 *   	changeTransaction(int $transactionId,long $time,String $content)	//返回boolean
	 *   	changeUserName(String $openId,String $userName)	//返回boolean
	 * 
	 * 		insertTable(String $openId,String $tableName)	//返回tableId
	 * 		insertLink(int $tableId,String $openId)			//关注table，返回boolean
	 * 		insertInherit(int $tableId,int $parentTableId)	//返回int。[添加成功返回新继承链的id，保存失败返回-1，已存在该继承结构返回-2，循环继承返回-3]
	 * 	 	insertManager(int $tableId,int $userId)	//返回boolean
	 * 	 	insertTransaction(int $tableId,long $time,String content)	//成功放回TransactionId，失败返回-1
	 * 	 	insertUser(String $openId)				//返回boolean
	 * 	 	
	 * 		isExistTheTableLink(int $tableId,String $openId)	//检查是否存在这样的TableLink数据，返回Boolean
	 * 		isUserExist(String $openId)				//返回boolean
	 *
	 * 		deleteTable(int $tableId)				//返回boolean
	 * 		deleteLink(int $tableId,String $openId)	//取消关注，返回boolean
	 * 		deleteInherit(int $tableId,$parentTableId)	//返回boolean
	 * 		deleteManager(int $tableId,int $userId)	//返回boolean
	 * 		
	 * 		getAttentionTableAry(String $openId)	//返回AttentionTable对象数组
	 * 		getInheritLink(int $tableId)			//
	 * 		getTableInfo(int $tableId)				//返回TableInfo对象,如果不存在该table，则返回NULL
	 * 		getTableFollowerAry(int $tableId)		//返回TableFollower对象数组
	 * 		getUserInfo(String $openId)				//返回UserInfo对象
	 * 		getHistoryCountOfTransaction(array tableIdAry)		//返回int
	 * 		getHistoryTransactionAry(array tableIdAry,int page)	//return object Transaction
	 * 		getTransactionAry(array tableIdAry)		//和getHistoryTransactionAry的区别在于，这是获取未来的transaction
	 *
	 * 		linkTurnToInherit()
	 *
	 * 	private methods
	 */

	include_once("protected/models/util/TableTable.php");
	include_once("protected/models/util/TableLink.php");
	include_once("protected/models/util/TableUser.php");
	include_once("protected/models/util/TableTransaction.php");
	include_once("protected/models/util/TableTableInherit.php");
	include_once("protected/models/util/TableTableManagerGroup.php");

	include_once("protected/models/datastructure/table/Table.php");
	include_once("protected/models/datastructure/table/TableInfo.php");
	include_once("protected/models/datastructure/table/AttentionTable.php");

	include_once("protected/models/datastructure/user/User.php");
	include_once("protected/models/datastructure/user/UserInfo.php");
	include_once("protected/models/datastructure/user/TableFollower.php");

	include_once("protected/models/datastructure/transaction/Transaction.php");


	class MiniqDB{
		public function __construct(){

		}

		public function insertTable($openId,$tableName){
			$tableTable=new TableTable();
			$tableId=$tableTable->insertOneData($openId,$tableName);

			$tableLink=new TableLink();
			$tableLink->insertOneData($openId,$tableId);

			return $tableId;
		}

		public function getAttentionTableAry($openId){
			$tableUser=new TableUser($openId);
			$userInfo=$tableUser->getUserInfo();
			$userId=$userInfo['id'];

			$tableLink=new TableLink();
			$linkResult=$tableLink->getAllByUserId($openId);
			$result=array();
			if($linkResult != NULL){
				$tableTable=new TableTable();
				$tableMangerGroup=new TableTableManagerGroup();
				$tableInherit=new TableTableInherit();
				foreach ($linkResult as $key => $value) {
					$tableId=$value['tableId'];
					$tableResult=$tableTable->getById($tableId);
					if($tableResult != NULL){
						$isManager=false;
						if($tableResult['creatorId'] == $openId  ||  $tableMangerGroup->isManager($userId,$tableId)){
							$isManager=true;
						}
						else{
							$isManager=false;
						}
						$attentionTable=new AttentionTable($tableId,$tableResult['tableName'],$isManager);

						$allParentTableIdAry=$tableInherit->getAllParentTableId($tableId);
						foreach ($allParentTableIdAry as $k => $parentTableId) {
							$parentTableInfo=$tableTable->getById($parentTableId);
							$attentionTable->addInheritTable(new Table($parentTableInfo['id'],$parentTableInfo['tableName']));
						}
						$result[]=$attentionTable;
					}
				}
			}
			return $result;
		}

		public function getInheritLink($childTableId){
			$tableInherit=new TableTableInherit();
			return $this->getParentInheritLink($tableInherit,$childTableId);
		}

		private function getParentInheritLink($db,$childTableId){
			$result=$this->getParentTableId($db,$childTableId);
			foreach ($result as $key => $value) {
				$result=array_merge($result,$this->getParentInheritLink($db,$value[1]));
			}
			return $result;
		}
		
		private function getParentTableId($db,$childTableId){
			$result=$db->getParentTableId($childTableId);
			$parentTableIdAry=array();
			if(!empty($result)){
				foreach ($result as $key => $value) {
					$attentionTable=array();
					$attentionTable[]=$childTableId;
					$attentionTable[]=$value;
					$parentTableIdAry[]=$attentionTable;
				}
			}
			return $parentTableIdAry;
		}

		public function getTableInfo($tableId){
			$result=array();
			$tableTable=new TableTable();
			$tableResult=$tableTable->getById($tableId);
			if($tableResult != NULL){
				$tableInfo=new TableInfo($tableResult['id'],$tableResult['tableName'],$tableResult['creatorId'],$tableResult['visibilityState'],$tableResult['createTime']);

				$tableInherit=new TableTableInherit();
				$parentTableIdAry=$tableInherit->getParentTableId($tableId);
				foreach ($parentTableIdAry as $key => $value) {
					$parentTable=$tableTable->getById($value);
					$table=new Table($parentTable['id'],$parentTable['tableName']);
					$tableInfo->addParentTable($table);
				}

				$childTableIdAry=$tableInherit->getChildTableId($tableId);
				foreach ($childTableIdAry as $key => $value) {
					$childTable=$tableTable->getById($value);
					$table=new Table($childTable['id'],$childTable['tableName']);
					$tableInfo->addChildTable($table);
				}

				$tableMangerGroup=new TableTableManagerGroup();
				$managerAry=$tableMangerGroup->getAllManager($tableId);
				foreach ($managerAry as $key => $value) {
					$tableInfo->addManagerId($value);
				}
				return $tableInfo;
			}
			else{
				return NULL;
			}
		}

		public function isExistTheTableLink($openId,$tableId){
			$tableLink=new TableLink();
			return $tableLink->isExist($openId,$tableId);
		}

		public function getTableFollowerAry($tableId){
			$result=array();

			$tableTable=new TableTable();
			$tableResult=$tableTable->getById($tableId);
			$creatorOpenId=$tableResult['creatorId'];

			$tableManagerGroup=new TableTableManagerGroup();
			$managerList=$tableManagerGroup->getAllManager($tableId);

			$tableLink=new TableLink();
			$linkResult=$tableLink->getAllByTableId($tableId);
			foreach ($linkResult as $key => $value) {
				$openId=$value['userId'];

				$tableUser=new TableUser($openId);
				$userResult=$tableUser->getUserInfo();

				$isCreator=(($creatorOpenId==$openId) ? true:false);
				$isManager=in_array($userResult['id'],$managerList);

				$result[]=(new TableFollower($userResult['id'],$userResult['nickName'],$isManager,$isCreator));
			}

			return $result;
		}

		public function changeTableName($tableId,$tableName){
			$tableTable=new TableTable();
			return $tableTable->changeTableName($tableId,$tableName);
		}

		/**
		 *	当删除一条table时
		 *		1，将所有用户从该表的link名单中移除
		 *		2，将该表的继承链移除，包括它和父表的继承关系，以及它和子表的继承关系
		 *		3，移除该表的所有管理员
		 *  	4，将该表的Table数据移除
		 *  	5，删除该表所有transaction
		 */
		public function deleteTable($tableId){
			$tableTable=new TableTable();
			if($tableTable->deleteOneData($tableId)){
				$tableLink=new TableLink();
				$tableLink->deleteAllByTableId($tableId);
				
				$tableTableInherit=new TableTableInherit();
				$tableTableInherit->removeAllAsChildTable($tableId);
				$tableTableInherit->removeAllAsParentTable($tableId);

				$tableTableManagerGroup=new TableTableManagerGroup();
				$tableTableManagerGroup->removeAll($tableId);

				$tableTransaction=new TableTransaction();
				$tableTransaction->removeAllByTableId($tableId);

				return true;
			}
			else{
				return false;
			}
		}

		public function insertLink($tableId,$openId){
			$tableTable=new TableTable();
			$tableResult=$tableTable->getById($tableId);
			if($tableResult != NULL){
				$tableLink=new TableLink();
				if($tableLink->isExist($openId,$tableId)){
					return false;
				}
				else{
					$tableLink->insertOneData($openId,$tableId);
					return true;
				}
			}
			else{
				return false;
			}
		}

		public function deleteLink($tableId,$openId){
			$tableLink=new TableLink();
			if($tableLink->deleteOne($openId,$tableId)){
				$tableUser=new TableUser($openId);
				$userInfo=$tableUser->getUserInfo();
				$managerGroup=new TableTableManagerGroup();
				$managerGroup->remove($userInfo['id'],$tableId);
				return true;
			}
			else{
				return false;
			}
		}

		public function changeTableVisibilityState($tableId){
			$tableTable=new TableTable();
			return $tableTable->changeTableVisibilityState($tableId);
		}

		//[添加成功返回新继承链的id，保存失败返回-1，已存在该继承结构返回-2，循环继承返回-3]
		public function insertInherit($tableId,$parentTableId){
			$tableInherit=new TableTableInherit();
			return $tableInherit->add($tableId,$parentTableId);
		}

		public function deleteInherit($tableId,$parentTableId){
			$tableInherit=new TableTableInherit();
			return $tableInherit->remove($tableId,$parentTableId);
		}

		public function insertManager($tableId,$userId){
			$tableManagerGroup=new TableTableManagerGroup();
			return (boolean)$tableManagerGroup->add($userId,$tableId);
		}

		public function deleteManager($tableId,$userId){
			$tableManagerGroup=new TableTableManagerGroup();
			return $tableManagerGroup->remove($userId,$tableId);
		}

		public function insertTransaction($tableId,$time,$content){
			$tableTransaction=new TableTransaction();
			return $tableTransaction->insertOneData($tableId,$time,$content);
		}

		public function changeTransaction($transactionId,$time,$content){
			$tableTransaction=new TableTransaction();
			return $tableTransaction->changeOneData($transactionId,$time,$content);
		}

		public function isUserExist($openId){
			$tableUser=new TableUser($openId);
			return $tableUser->isUserExist();
		}

		public function insertUser($openId){
			$tableUser=new TableUser($openId);
			$tableUser->insertOneData();
			$tableTable=new TableTable();
			$tableId=$tableTable->insertOneData($openId,"我的节点");
			$tableLink=new TableLink();
			$tableLink->insertOneData($openId,$tableId);
			return true;
		}

		public function getUserInfo($openId){
			$tableUser=new TableUser($openId);
			$user=$tableUser->getUserInfo();
			return (new UserInfo($user['id'],$user['nickName'],$user['openId'],$user['email'],$user['registerTime']));
		}

		public function changeUserName($openId,$userName){
			$tableUser=new TableUser($openId);
			$tableUser->changeNickName($userName);
			return true;
		}

		public function getHistoryCountOfTransaction($tableIdAry){
			$tableTransaction=new TableTransaction();
			return $tableTransaction->getCountOfHistory($tableIdAry);
		}

		public function getHistoryTransactionAry($tableIdAry,$page){
			$tableTransaction=new TableTransaction();
			$transactionAry=array();
			$resultAry=$tableTransaction->getHistoryTransactionAry($tableIdAry,$page);
			foreach ($resultAry as $key => $value) {
				$transaction=new Transaction($value['id'],$value['tableId'],$value['content'],$value['time']);
				$transactionAry[]=$transaction;
			}
			return $transactionAry;
		}

		public function getTransactionAry($tableIdAry){
			$tableTransaction=new TableTransaction();
			$transactionAry=array();
			$resultAry=$tableTransaction->getTransactionAry($tableIdAry);
			foreach ($resultAry as $key => $value) {
				$transaction=new Transaction($value['id'],$value['tableId'],$value['content'],$value['time']);
				$transactionAry[]=$transaction;
			}
			return $transactionAry;
		}


		//	print_r(json_encode());		print_r("</br>");
		public function linkTurnToInherit(){
			$criteria=new CDbCriteria();
			$criteria->order='id asc';
			$allLinkResult=MysqlLink::model()->findAll($criteria);
			foreach ($allLinkResult as $key => $value) {
				print_r($value->id);		print_r("</br>");
				print_r($value->tableId);	print_r("</br>");
				$tableInfo=$this->getTableInfo($value->tableId);
				if($tableInfo != NULL){
					if($tableInfo->getCreatorId()==($value->userId)){
						print_r(json_encode(true));		print_r("</br>");
					}
					else{	//进入这里的是关注表
						print_r(json_encode(false));		print_r("</br>");
						// $this->insertInherit();
						print_r($tableInfo->getCreatorId());		print_r("</br>");	//这是被该用户关注的表的信息
						$tableCDB=new CDbCriteria();
						$tableCDB->order='id asc';
						$tableCDB->addCondition("creatorId="."\"".$value->userId."\"");
						$tableResult=MysqlTable::model()->find($tableCDB);
						if($tableResult != NULL){	//该用户有自己创建的表
							print_r(json_encode($tableResult->id));		print_r("</br>");	//这是该用户的第一个表
							$this->insertInherit($tableResult->id,$value->tableId);
						}
						$value->delete();
					}
				}
				else{
					//不存在这样的table，这里要删除link
					$value->delete();
				}
				
				print_r("</br>");
			}
		}
	}











