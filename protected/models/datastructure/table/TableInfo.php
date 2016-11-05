<?php
	/**
	 * TableInfo(int $tableId,String $tableName,String $creatorId,boolean $isPublic,int $createTime)
	 * 		isPublic()
	 *
	 * 		getCreatorId()
	 * 		getCreateTime()
	 * 		getManagerIdAry()
	 * 		getParentTableAry()
	 * 		getChildTableAry()
	 * 		
	 * 		addManagerId(int managerId)
	 * 		addParentTable(Table $table)
	 * 		addChildTable(Table $table)
	 *
	 * 		methods inherited form class Table
	 * 			getTableId()
	 * 		 	getTableName()
	 * 			
	 */

	class TableInfo extends Table{
		private $creatorId;
		private $createTime;
		private $isPublic;
		private $managerIdAry=array();
		private $parentTableAry=array();
		private $childTableAry=array();

		public function __construct($tableId,$tableName,$creatorId,$isPublic,$createTime){
			parent::__construct($tableId,$tableName);
			$this->creatorId=$creatorId;
			$this->isPublic=(boolean)$isPublic;
			$this->createTime=$createTime;
		}

		//这种普通数组的isExist判断只需要使用in_array()就行
		public function addManagerId($managerId){
			$this->managerIdAry[]=$managerId;
		}

		public function getManagerIdAry(){
			return $this->managerIdAry;
		}

		public function getCreatorId(){
			return $this->creatorId;
		}

		public function getCreateTime(){
			return $this->createTime;
		}

		public function isPublic(){
			return $this->isPublic;
		}

		//假如需要在添加前判断该Table是否已经存在，这时就需要Iterator了
		//但是这种判断会浪费大量的计算时间，考虑一下，是否真的有必要确认无重复
		public function addParentTable($table){
			$this->parentTableAry[]=$table;
			
		}

		public function getParentTableAry(){
			return $this->parentTableAry;
		}

		public function addChildTable($table){
			$this->childTableAry[]=$table;
		}

		public function getChildTableAry(){
			return $this->childTableAry;
		}
	}