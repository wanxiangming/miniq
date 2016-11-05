
<?php
	/**
	 * Table(int $tableId,String $tableName)
	 * 		getTableId()
	 * 		getTableName()
	 */
	class Table{
		protected $tableId;
		protected $tableName;

		public function __construct($tableId,$tableName){
			$this->tableId=(int)$tableId;
			$this->tableName=$tableName;
		}

		public function getTableId(){
			return $this->tableId;
		}

		public function getTableName(){
			return $this->tableName;
		}
	}