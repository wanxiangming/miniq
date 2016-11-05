<?php

	/**
	 * MysqlTableController()
	 * 		actionCreateLogTable()
	 * 		
	 * 		actionGetLogTableList()	
	 * 		actionGetAttentonTableInfo()
	 * 		actionGetFollowerList()
	 * 		actionGetTableInfo()
	 * 		
	 * 		actionChangeLogTableName()
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


	include_once("protected/models/database/MiniqDB.php");
	include_once("protected/models/util/Cookie.php");

	class MysqlTableController extends Controller{

		public function actionCreateLogTable(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);
			$tableName=$obj->logTableName;
			$cookie=new Cookie();
			$openId=$cookie->getAccount();

			$miniqDB=new MiniqDB();
			$miniqDB->insertTable($openId,$tableName);
			print_r(0);		//表示创建成功
		}

		/**
			--------------------------------------TODO------------------------------------------------
			这个不要了，重写前端代码，换用actionGetAttentonTableInfo
			[
			  {
			    "userId": "67EB8F9DA303F184014F9268D8294156", 
			    "tableId": "100009", 
			    "tableName": "34070202班", 
			    "creatorId": "67EB8F9DA303F184014F9268D8294156", 
			    "tableState": "1"
			  },
			  {
		
			  }
			]
		 */
		public function actionGetLogTableList(){
			$cookie=new Cookie();
			$openId=$cookie->getAccount();
			
			$attentionTable=array();
			$tableLink=new TableLink();
			$linkResult=$tableLink->getAllByUserId($openId);
			if($linkResult != NULL){
				$tableTable=new TableTable();
				foreach ($linkResult as $key => $value) {
					$tableId=$value['tableId'];
					$tableResult=$tableTable->getById($tableId);
					if($tableResult != NULL){
						$value['tableName']=$tableResult['tableName'];
						$value['creatorId']=$tableResult['creatorId'];
						$value['tableState']=$tableResult['tableState'];
						$value['visibilityState']=$tableResult['visibilityState'];
					}
					$attentionTable[]=$value;
				}
				print_r(json_encode($attentionTable));
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
			$cookie=new Cookie();
			$openId=$cookie->getAccount();
			$attentionTableAry=array();
			$miniqDB=new MiniqDB();
			foreach ($miniqDB->getAttentionTableAry($openId) as $key => $value) {
				$attentionTable=array();
				$attentionTable['tableId']=$value->getTableId();
				$attentionTable['tableName']=$value->getTableName();
				$attentionTable['isManager']=$value->isManager();

				$inheritTableAry=array();
				foreach ($value->getInheritTableAry() as $key => $value) {
					$inheritTable=array();
					$inheritTable['tableId']=$value->getTableId();
					$inheritTable['tableName']=$value->getTableName();
					$inheritTableAry[]=$inheritTable;
				}
				$attentionTable['inheritTableAry']=$inheritTableAry;
				$attentionTableAry[]=$attentionTable;
			}
			print_r(json_encode($attentionTableAry));
		}

		/**
		 * {
			  "tableId": "", 
			  "tableName": "", 
			  "isCreator": , 
			  "isPublic": "", 
			  "isAttention": , 
			  "parentTableAry": [
			    {
			      "tableId": "", 
			      "tableName": ""
			    }
			  ], 
			  "childTableAry": [ ]
			}
		 */
		public function actionGetTableInfo(){
			$cookie=new Cookie();
			$openId=$cookie->getAccount();
			$tableId=$_GET['tableId'];

			$miniqDB=new MiniqDB();
			$tableInfo=$miniqDB->getTableInfo($tableId);

			if($tableInfo != NULL){
				$result=array();
				$result['tableId']=$tableInfo->getTableId();
				$result['tableName']=$tableInfo->getTableName();
				$result['isCreator']=($openId == $tableInfo->getCreatorId() ? true:false);
				$result['isPublic']=$tableInfo->isPublic();

				if($result['isCreator']){
					$result['isAttention']=true;
				}
				else{
					$result['isAttention']=$miniqDB->isExistTheTableLink($openId,$tableId);
				}

				$parentTableInfoAry=array();
				$parentTableAry=$tableInfo->getParentTableAry();
				foreach ($parentTableAry as $key => $value) {
					$parentTableInfo=array();
					$parentTableInfo['tableId']=$value->getTableId();
					$parentTableInfo['tableName']=$value->getTableName();
					$parentTableInfoAry[]=$parentTableInfo;
				}
				$result['parentTableAry']=$parentTableInfoAry;

				$childTableInfoAry=array();
				$childTableAry=$tableInfo->getChildTableAry();
				foreach ($childTableAry as $key => $value) {
					$childTableInfo=array();
					$childTableInfo['tableId']=$value->getTableId();
					$childTableInfo['tableName']=$value->getTableName();
					$childTableInfoAry[]=$childTableInfo;
				}
				$result['childTableAry']=$childTableInfoAry;

				print_r(json_encode($result));
			}
			else{
				print_r(0);
			}
		}

		/**
		 *  [
			  {
			    "followerName": "万相明", 
			    "followerId": "100000", 
			    "isManager": false, 
			    "isCreator": true
			  }
			]
		 */

		public function actionGetFollowerList(){
			$tableId=$_GET['tableId'];
			$result=array();

			$miniqDB=new MiniqDB();
			$tableFollowerAry=$miniqDB->getTableFollowerAry($tableId);

			foreach ($tableFollowerAry as $key => $value) {
				$followerInfo=array();
				$followerInfo['followerName']=$value->getUserName();
				$followerInfo['followerId']=$value->getUserId();
				$followerInfo['isManager']=$value->isManager();
				$followerInfo['isCreator']=$value->isCreator();
				$result[]=$followerInfo;
			}

			print_r(json_encode($result));
		}

		public function actionChangeLogTableName(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);

			$miniqDB=new MiniqDB();
			$miniqDB->changeTableName($obj->tableId,$obj->nickName);
			print_r(0);
		}

		public function actionDeprecatedLogTable(){
			$cookie=new Cookie();
			$openId=$cookie->getAccount();
			$tableId=$_GET['tableId'];

			$miniqDB=new MiniqDB();
			$miniqDB->deleteTable($tableId);

			print_r(1);
		}

		public function actionCancelAttention(){
			$cookie=new Cookie();
			$openId=$cookie->getAccount();
			$tableId=$_GET['tableId'];

			$miniqDB=new MiniqDB();
			$miniqDB->deleteLink($tableId,$openId);
			
			print_r(1);
		}

		public function actionPayAttention(){
			$cookie=new Cookie();
			$openId=$cookie->getAccount();
			$tableId=$_GET['tableId'];

			$miniqDB=new MiniqDB();
			if($miniqDB->insertLink($tableId,$openId)){
				print_r(1);
			}
			else{
				print_r(0);
			}
		}

		public function actionSearchTableByTableId(){
			$tableId=$_GET['tableId'];
			$cookie=new Cookie();
			$openId=$cookie->getAccount();

			$miniqDB=new MiniqDB();
			$tableInfo=$miniqDB->getTableInfo($tableId);
			if($tableInfo != NULL  &&  $tableInfo->isPublic()){
				$result=array();
				$result['id']=$tableInfo->getTableId();
				$result['creatorId']=$tableInfo->getCreatorId();
				$result['createTime']=$tableInfo->getCreateTime();
				$result['tableName']=$tableInfo->getTableName();
				$result['isMine']=($tableInfo->getCreatorId()==$openId) ? true:false;
				if($result['isMine']){
					$result['isAttention']=true;
				}
				else{
					if($miniqDB->isExistTheTableLink($tableId,$openId)){
						$result['isAttention']=true;
					}
					else{
						$result['isAttention']=false;
					}
				}
				print_r(json_encode($result));
			}
			else{
				print_r(0);
			}	
		}

		public function actionOpenTheTable(){
			$tableId=$_GET['tableId'];

			$miniqDB=new MiniqDB();
			$miniqDB->changeTableVisibilityState($tableId);
			print_r(0);
		}

		/**
		 * actionInherit()
		 * 添加新的继承关系
		 * @return [int] [添加成功返回新继承链的id，保存失败返回-1，已存在该继承结构返回-2，循环继承返回-3]
		 */
		public function actionInherit(){
			$tableId=$_GET['tableId'];
			$parentTableId=$_GET['parentTableId'];

			$miniqDB=new MiniqDB();
			print_r($miniqDB->insertInherit($tableId,$parentTableId));
		}

		/**
		 * actionRemoveInherit() 
		 * 移除特定一个继承关系
		 * @return [int] [成功返回真，失败返回假]
		 */
		public function actionRemoveInherit(){
			$tableId=$_GET['tableId'];
			$parentTableId=$_GET['parentTableId'];

			$miniqDB=new MiniqDB();
			if($miniqDB->deleteInherit($tableId,$parentTableId)){
				print_r(1);
			}
			else{
				print_r(0);
			}
		}



//--------------------------------------------------------测试用--------------------------------------------------------------------
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
				$result=array_merge($result,$this->getParentInheritLink($db,$value[1]));
			}
			return $result;
		}

		//查询某子表的父表
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
			// print_r(json_encode($parentTableIdAry));
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
