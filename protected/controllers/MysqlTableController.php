<?php

	/**
	 * MysqlTableController()
	 * 		actionCreateLogTable()
	 * 		
	 * 		actionGetLogTableList()		//弃用
	 * 		actionGetAttentonTableInfo()
	 * 		actionGetFollowerList()
	 * 		actionGetTableInfo()
	 * 		
	 * 		actionChangeLogTableName()
	 * 		actionChangeLogTableAnotherName()	//弃用
	 * 		
	 * 		actionDeprecatedLogTable()
	 * 		actionCancelAttention()
	 * 		
	 * 		actionPayAttention()
	 * 		actionSearchTableByTableId()
	 * 		actionOpenTheTable()
	 * 		actionInherit()
	 * 		actionRemoveInherit()
	 *
	 * 		//测试用
	 * 		actionGetParentInheritLink()
	 * 		actionGetAllParentTableId()
	 * 		actionGetAllChildTableId()
			actionRemoveAll()

	 */

	include_once("protected/models/util/TableTable.php");
	include_once("protected/models/util/TableLink.php");
	include_once("protected/models/util/TableUser.php");
	include_once("protected/models/util/TableTransaction.php");
	include_once("protected/models/util/TableTableInherit.php");
	include_once("protected/models/util/TableTableManagerGroup.php");

	class MysqlTableController extends Controller{

		public function actionCreateLogTable(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);
			$creatorId=Yii::app()->request->cookies['openId']->value;

			$tableTable=new TableTable();
			$tableId=$tableTable->insertOneData($creatorId,$obj->logTableName);

			$tableLink=new TableLink();
			$tableLink->insertOneData($creatorId,$tableId,$obj->logTableName);
			print_r(0);		//表示创建成功
		}

		/*
		[
		  {
		    "userId": "67EB8F9DA303F184014F9268D8294156", 
		    "tableId": "100009", 
		    "anotherName": "34070202班", 
		    "creatorId": "67EB8F9DA303F184014F9268D8294156", 
		    "tableState": "1"
		  }
		]
		 */
		public function actionGetLogTableList(){
			$openId=Yii::app()->request->cookies['openId']->value;
			
			$ary=array();
			$tableLink=new TableLink();
			$linkResult=$tableLink->getAllByUserId($openId);
			if($linkResult != NULL){
				$tableTable=new TableTable();
				foreach ($linkResult as $key => $value) {
					$tableId=$value['tableId'];
					$tableResult=$tableTable->getById($tableId);
					if($tableResult != NULL){
						$value['creatorId']=$tableResult['creatorId'];
						$value['tableState']=$tableResult['tableState'];
						$value['visibilityState']=$tableResult['visibilityState'];
					}
					$ary[]=$value;
				}
				print_r(json_encode($ary));
			}
			else{
				print_r(0);	//0表示该用户未使用任何日程表
			}
		}

		/**
			$tableInherit=new TableTableInherit();
			print_r($tableInherit->getAllParentTableId($childTableId));

		 *	查询该用户的所有关注表，及这些表的所有父表
		 *	tableId
		 *	tableName
		 *	isManager
		 *	inheritTableAry
		 *		tableId
		 *		tableName
		 *	
		 * actionGetAttentonTableInfo()	//需要openId
		 * 
		 */
		public function actionGetAttentonTableInfo(){
			$openId=Yii::app()->request->cookies['openId']->value;

			$tableUser=new TableUser($openId);
			$userInfo=$tableUser->getUserInfo();
			$userId=$userInfo['id'];

			$tableLink=new TableLink();
			$linkResult=$tableLink->getAllByUserId($openId);
			if($linkResult != NULL){
				$result=array();
				$tableTable=new TableTable();
				$tableMangerGroup=new TableTableManagerGroup();
				$tableInherit=new TableTableInherit();

				foreach ($linkResult as $key => $value) {
					$info=array();
					$tableId=$value['tableId'];

					$tableResult=$tableTable->getById($tableId);
					if($tableResult != NULL){

						$info['tableId']=$tableId;
						$info['tableName']=$tableResult['tableName'];

						if($tableResult['creatorId'] == $openId  ||  $tableMangerGroup->isManager($userId,$tableId)){
							$info['isManager']=true;
						}
						else{
							$info['isManager']=false;
						}

						$allParentTableIdAry=$tableInherit->getAllParentTableId($tableId);
						$parentTableInfoAry=array();
						foreach ($allParentTableIdAry as $k => $parentTableId) {
							$ary=array();
							$parentTableInfo=$tableTable->getById($parentTableId);
							$ary['tableId']=$parentTableInfo['id'];
							$ary['tableName']=$parentTableInfo['tableName'];
							$parentTableInfoAry[]=$ary;
						}
						$info['parentTableInfoAry']=$parentTableInfoAry;
					}
					$result[]=$info;
				}

				print_r(json_encode($result));
			}
			else{
				print_r(0);
			}
		}

		public function actionGetTableInfo(){
			$openId=Yii::app()->request->cookies['openId']->value;
			$tableId=$_GET['tableId'];

			$result=array();
			$parentTableInfoAry=array();
			$childTableInfoAry=array();
			$tableTable=new TableTable();
			$tableInherit=new TableTableInherit();
			$tableResult=$tableTable->getById($tableId);
			if($tableResult != NULL){
				$result['tableId']=$tableResult['id'];
				$result['tableName']=$tableResult['tableName'];
				$result['isCreator']=($openId == $tableResult['creatorId'] ? 1:0);
				$result['isPublic']=$tableResult['visibilityState'];

				if($result['isCreator']){
					$result['isAttention']=1;
				}
				else{
					$tableLink=new TableLink();
					if($tableLink->isExist($openId,$tableId)){
						$result['isAttention']=1;
					}
					else{
						$result['isAttention']=0;
					}
				}

				$parentTableIdAry=$tableInherit->getParentTableId($tableId);
				foreach ($parentTableIdAry as $key => $value) {
					$parentTableInfo=array();
					$parentTable=$tableTable->getById($value);
					$parentTableInfo['tableId']=$parentTable['id'];
					$parentTableInfo['tableName']=$parentTable['tableName'];
					$parentTableInfoAry[]=$parentTableInfo;
				}
				$result['parentTableAry']=$parentTableInfoAry;

				$childTableIdAry=$tableInherit->getChildTableId($tableId);
				foreach ($childTableIdAry as $key => $value) {
					$childTableInfo=array();
					$childTable=$tableTable->getById($value);
					$childTableInfo['tableId']=$childTable['id'];
					$childTableInfo['tableName']=$childTable['tableName'];
					$childTableInfoAry[]=$childTableInfo;
				}
				$result['childTableAry']=$childTableInfoAry;

				print_r(json_encode($result));
			}
			else{
				print_r(0);
			}
		}

		public function actionGetFollowerList(){
			$tableId=$_GET['tableId'];
			$result=array();

			$tableTable=new TableTable();
			$tableResult=$tableTable->getById($tableId);
			$creatorId=$tableResult['creatorId'];

			$tableLink=new TableLink();
			$linkResult=$tableLink->getAllByTableId($tableId);

			$tableManagerGroup=new TableTableManagerGroup();
			$managerList=$tableManagerGroup->getAllManager($tableId);

			foreach ($linkResult as $key => $value) {
				$userId=$value['userId'];

				$tableUser=new TableUser($userId);
				$userResult=$tableUser->getUserInfo();

				$userName=$userResult['nickName'];
				$userId=$userResult['id'];
				$openId=$userResult['openId'];
				$isCreator=($creatorId==$openId);
				$isManager=in_array($userId,$managerList);

				$userInfo=array();
				$userInfo['followerName']=$userName;
				$userInfo['followerId']=$userId;
				$userInfo['isManager']=$isManager;
				$userInfo['isCreator']=$isCreator;
				$result[]=$userInfo;
			}
			print_r(json_encode($result));
		}

		public function actionChangeLogTableName(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);
			$openId=Yii::app()->request->cookies['openId']->value;

			$tableTable=new TableTable();
			if($tableTable->changeTableName($obj->tableId,$obj->nickName)){
				$tableLink=new TableLink();
				if($tableLink->changeAnotherName($openId,$obj->tableId,$obj->nickName)){
					print_r(0);	//0表示数据操作成功
				}
				else{
					print_r(1);	//1表示anotherName修改失败
				}
			}
			else{
				print_r(2);	//2表示tableName修改失败
			}
		}


		//弃用了！！！！！！！！！！！！！！！！！！！！！！！！！！
		public function actionChangeLogTableAnotherName(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);
			$openId=Yii::app()->request->cookies['openId']->value;

			$tableLink=new TableLink();
			if($tableLink->changeAnotherName($openId,$obj->tableId,$obj->nickName)){
				print_r(0);	//0表示数据操作成功
			}
			else{
				print_r(1);	//1表示anotherName修改失败
			}
		}

		/**
		 *	当用户弃用某表的时候
		 *		1，将所有用户从该表的link名单中移除
		 *		2，将该表的继承链移除，包括它和父表的继承关系，以及它和子表的继承关系
		 *		3，移除该表的所有管理员
		 *  	4，将该表的Table数据移除
		 * 
		 * actionDeprecatedLogTable()
		 * @return [type] [description]
		 */
		public function actionDeprecatedLogTable(){
			$openId=Yii::app()->request->cookies['openId']->value;
			$tableId=$_GET['tableId'];

			$tableTable=new TableTable();
			if($tableTable->deleteOneData($tableId)){
				$tableLink=new TableLink();
				$tableLink->deleteAllByTableId($tableId);
				
				$tableTableInherit=new TableTableInherit();
				$tableTableInherit->removeAllAsChildTable($tableId);
				$tableTableInherit->removeAllAsParentTable($tableId);

				$tableTableManagerGroup=new TableTableManagerGroup();
				$tableTableManagerGroup->removeAll($tableId);
			}
			print_r(1);
		}

		public function actionCancelAttention(){
			$openId=Yii::app()->request->cookies['openId']->value;
			$tableId=$_GET['tableId'];

			$tableLink=new TableLink();
			$tableLink->deleteOne($openId,$tableId);

			$tableUser=new TableUser($openId);
			$userInfo=$tableUser->getUserInfo();

			$managerGroup=new TableTableManagerGroup();
			$managerGroup->remove($userInfo['id'],$tableId);
			
			print_r(1);
		}

		public function actionPayAttention(){
			$openId=Yii::app()->request->cookies['openId']->value;
			$tableId=$_GET['tableId'];

			$tableTable=new TableTable();
			$tableResult=$tableTable->getById($tableId);
			if($tableResult != NULL){
				$tableLink=new TableLink();
				$tableLink->insertOneData($openId,$tableId,$tableResult['tableName']);
				print_r(1);	//1表示关注成功
			}
			else{
				print_r(0);	//2表示关注失败，不存在该日程表
			}
		}

		public function actionSearchTableByTableId(){
			$tableId=$_GET['tableId'];
			$openId=Yii::app()->request->cookies['openId']->value;

			$tableTable=new TableTable();
			$tableResult=$tableTable->getById($tableId);
			if($tableResult!=NULL && $tableResult['visibilityState']!=0){
				$tableLink=new TableLink();
				if($tableLink->isExist($openId,$tableId)){
					$tableResult['isAttention']=1;	//已关注
				}
				else{
					$tableResult['isAttention']=0;
				}
				
				if($tableResult['creatorId'] == $openId){
					$tableResult['isMine']=1;
				}
				else{
					$tableResult['isMine']=0;
				}
				print_r(json_encode($tableResult));
			}
			else{
				print_r(0);	//没有这张日程表或者该日程表是私有的，都返回0
			}
		}

		public function actionOpenTheTable(){
			$tableId=$_GET['tableId'];

			$tableTable=new TableTable();
			if($tableTable->changeTableVisibilityState($tableId)){
				print_r(0);	//修改成功返回0
			}
			else{
				print_r(1);
			}
		}

		/**
		 * actionInherit()
		 * 添加新的继承关系
		 * @return [int] [添加成功返回新继承链的id，保存失败返回-1，已存在该继承结构返回-2，循环继承返回-3]
		 */
		public function actionInherit(){
			$tableId=$_GET['tableId'];
			$parentTableId=$_GET['parentTableId'];

			$tableInherit=new TableTableInherit();
			print_r($tableInherit->add($tableId,$parentTableId));
		}

		/**
		 * actionRemoveInherit() 
		 * 移除特定一个继承关系
		 * @return [int] [成功返回真，失败返回假]
		 */
		public function actionRemoveInherit(){
			$tableId=$_GET['tableId'];
			$parentTableId=$_GET['parentTableId'];

			$tableInherit=new TableTableInherit();
			if($tableInherit->remove($tableId,$parentTableId)){
				print_r(1);
			}
			else{
				print_r(0);
			}
		}

		/**
		 * actionGetParentInheritLink()
		 * @return [type] [description]
		 */
		public function actionGetParentInheritLink(){
			$childTableId=$_GET['childTableId'];

			$tableInherit=new TableTableInherit();
			$result=$this->getParentInheritLink($tableInherit,$childTableId);

			print_r(json_encode($result));
		}

		private function getParentInheritLink($db,$childTableId){
			$result=$this->getParentTableId($db,$childTableId);
			foreach ($result as $key => $value) {
				$result=array_merge($result,$this->getParentInheritLink($db,$value[$childTableId]));
			}
			return $result;
		}

		//查询某子表的父表
		private function getParentTableId($db,$childTableId){
			$result=$db->getParentTableId($childTableId);
			$parentTableIdAry=array();
			if(!empty($result)){
				foreach ($result as $key => $value) {
					$ary=array();
					$ary[$childTableId]=$value;
					$parentTableIdAry[]=$ary;
				}
			}
			return $parentTableIdAry;
		}

		public function actionGetAllParentTableId(){
			$childTableId=$_GET['childTableId'];

			$tableInherit=new TableTableInherit();
			print_r($tableInherit->getAllParentTableId($childTableId));
		}

		public function actionGetAllChildTableId(){
			$parentTableId=$_GET['parentTableId'];

			$tableInherit=new TableTableInherit();
			print_r($tableInherit->getAllChildTableId($parentTableId));
		}

		public function actionRemoveAll(){
			$parentTableId=$_GET['parentTableId'];

			$tableInherit=new TableTableInherit();
			$tableInherit->removeAllAsChildTable($parentTableId);
		}
	}
