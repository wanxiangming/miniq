<?php
	/**
	 * AttentionTable(int $tableId,String $tableName,boolean $isManager)
	 * 		isManager()
	 *
	 * 		addInheritTable(Table $table)
	 * 		getInheritTableAry()	//返回Table对象数组
	 * 
	 * 		methods inherited form class Table
	 * 			getTableId()
	 * 		 	getTableName()
	 */

	class AttentionTable extends Table{
		private $isManager=false;
		private $inheritTableAry=array();

		public function __construct($tableId,$tableName,$isManager){
			parent::__construct($tableId,$tableName);
			$this->isManager=(boolean)$isManager;
		}

		public function isManager(){
			return $this->isManager;
		}

		public function addInheritTable($Obj_Table){
			$this->inheritTableAry[]=$Obj_Table;
		}

		public function getInheritTableAry(){
			return $this->inheritTableAry;
		}
	}