<?php
	/**
	 * MysqlBacklogController
	 * 		actionAddMainLine()		post,
	 * 			{"openId": "67EB8F9DA303F184014F9268D8294156","content":"测试001"},
	 * 			添加成功返回主线ID，失败返回-1
	 * 		actionGetInUseMainLineInfo() get,
	 * 			openId=67EB8F9DA303F184014F9268D8294156,
	 * 			返回数据数组
	 * 		actionGetInfoInUseMainLineAndUncompletedBacklog()	get,
	 * 			openId=67EB8F9DA303F184014F9268D8294156,
	 * 			返回数据数组
	 * 		actionAddBacklog()	post,
	 * 			{"openId": "67EB8F9DA303F184014F9268D8294156","inUseMainLineId":"1","content":"内容","isMainLine":0,"isRecent":1}
	 * 			成功返回新添加的这个待办事项的ID，失败返回-1
	 * 		actionRemoveBacklog() get,
	 * 			openId=67EB8F9DA303F184014F9268D8294156&backlogId=2,
	 * 			移除成功返回1，失败返回0
	 * 		actionChangeBacklog()	post,
	 * 			{"openId": "","inUseMainLineId":"","backlogId":"","content":"","isMainLine":true,"isRecent":false}
	 * 			修改成功返回1，失败返回0
	 * 		actionCompleteBacklog()	get,
	 * 			openId=67EB8F9DA303F184014F9268D8294156&backlogId=2,
	 * 			操作成功返回1，失败返回0
	 */
	
	include_once("protected/models/util/TableMainLine.php");
	include_once("protected/models/util/TableBacklog.php");

	class MysqlBacklogController extends Controller{

		/**
		 * actionAddMainLine()
		 * @return [int] [添加成功返回该主线的ID，添加失败返回-1]
		 */
		public function actionAddMainLine(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);
			$openId=Yii::app()->request->cookies['openId']->value;

			$tableMainLine=new TableMainLine($openId);
			print_r($tableMainLine->add($obj->content));
		}

		/**
		 * actionGetInfoInUseMainLineAndUncompletedBacklog()
		 * @return [ary] [<description>]
		 * 例如下
		 * [
		 *  "mainLine": {"id":"8","content":"\u6d4b\u8bd5001"},
		 * 	"backlogAry": [
		 * 		{"id":"2",
		 * 		"content":"\u5185\u5bb9\u6d4b\u8bd5--\u5df2\u6539\u53d82",
		 * 		"isMainLine":1,
		 * 		"mainLineId":"8",
		 * 		"isRecent":0,
		 * 		"isComplete":0,
		 * 		"createTime":"1471876702000",
		 * 		"completeTime":null
		 * 		},
		 * 		{},
		 * 		{}
		 * 	]
		 * ]
		 */
		public function actionGetInfoInUseMainLineAndUncompletedBacklog(){
			//$openId=$_GET['openId'];
			$openId=Yii::app()->request->cookies['openId']->value;
			
			$tableMainLine=new TableMainLine($openId);
			$mainLineResult=$tableMainLine->getInUse();
			$returnResult=array();
			if(empty($mainLineResult)){
				$returnResult['mainLine']=array();
				$returnResult['backlogAry']=array();
			}
			else{
				$tableBacklog=new TableBacklog($openId,$mainLineResult['id']);
				$backlogResult=$tableBacklog->getAllUncomplete();
				if(empty($backlogResult)){
					
				}
				else{
					foreach ($backlogResult as &$value) {
						$value['isMainLine']=$this->transformBooleanToNum($value['isMainLine']);
						$value['isRecent']=$this->transformBooleanToNum($value['isRecent']);
						$value['isComplete']=$this->transformBooleanToNum($value['isComplete']);
					}
				}
				$returnResult['mainLine']=$mainLineResult;
				$returnResult['backlogAry']=$backlogResult;
			}
			return print_r(json_encode($returnResult));
		}

		private function transformBooleanToNum($boolean){
			return $boolean==true ? 1:0;
		}

		/**
		 * actionGetInUseMainLineInfo()
		 * @return [ary] [获取成功返回有数据的数组，获取失败返回空数组] 
		 * 例如下
		 * {"id":"8","content":"\u6d4b\u8bd5001"}
		 */
		public function actionGetInUseMainLineInfo(){
			//$openId=$_GET['openId'];
			$openId=Yii::app()->request->cookies['openId']->value;
			print_r(json_encode($this->getInUseMainLine($openId)));
		}

		private function getInUseMainLine($openId){
			$tableMainLine=new TableMainLine($openId);
			return $tableMainLine->getInUse();
		}

		/**
		 * actionChangeBacklog()
		 * @return [int] [修改成功返回1，失败返回0]
		 */
		public function actionChangeBacklog(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);

			//$openId=$obj->openId;
			$openId=Yii::app()->request->cookies['openId']->value;
			$inUseMainLineId=$obj->inUseMainLineId;
			$backlogId=$obj->backlogId;
			$isMainLine=$this->transformNumToBoolean($obj->isMainLine);
			$isRecent=$this->transformNumToBoolean($obj->isRecent);
			$content=$obj->content;

			$tableBacklog=new TableBacklog($openId,$inUseMainLineId);
			if($tableBacklog->change($backlogId,$content,$isMainLine,$isRecent)){
				print_r(1);
			}
			else{
				print_r(0);
			}
		}

		/**
		 * actionAddBacklog()
		 * @return [int] [成功返回新添加的这个待办事项的ID，失败返回-1]
		 */
		public function actionAddBacklog(){
			$json=file_get_contents("php://input");
			$obj=json_decode($json);

			//$openId=$obj->openId;
			$openId=Yii::app()->request->cookies['openId']->value;
			$inUseMainLineId=$obj->inUseMainLineId;
			$content=$obj->content;
			$isMainLine=$this->transformNumToBoolean($obj->isMainLine);
			$isRecent=$this->transformNumToBoolean($obj->isRecent);
			$tableBacklog=new TableBacklog($openId,$inUseMainLineId);
			print_r(json_encode($tableBacklog->add($content,$isMainLine,$isRecent)));
		}

		private function transformNumToBoolean($num){
			if($num == 1){
				return true;
			}
			else if($num == 0){
				return false;
			}
		}

		/**
		 * actionRemoveBacklog()
		 * @return [int] [移除成功返回1，失败返回0]
		 */
		public function actionRemoveBacklog(){
			//$openId=$_GET['openId'];
			$openId=Yii::app()->request->cookies['openId']->value;
			$backlogId=$_GET['backlogId'];

			$tableBacklog=new TableBacklog($openId,"");
			if($tableBacklog->remove($backlogId)){
				print_r(1);
			}
			else{
				print_r(0);
			}
		}

		/**
		 * actionCompleteBacklog()
		 * @return [int] [操作成功返回1，失败返回0]
		 */
		public function actionCompleteBacklog(){
			//$openId=$_GET['openId'];
			$openId=Yii::app()->request->cookies['openId']->value;
			$backlogId=$_GET['backlogId'];

			$tableBacklog=new TableBacklog($openId,"");
			if($tableBacklog->complete($backlogId)){
				print_r(1);
			}
			else{
				print_r(0);
			}
		}
	}