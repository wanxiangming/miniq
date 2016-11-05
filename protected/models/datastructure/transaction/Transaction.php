<?php
	/**
	 * Transaction(int id,int tableId,String content,long time)
	 * 		getId()			//return int transactionId
	 * 		getTableId()	//return int tableId
	 * 		getContent()	//return String content
	 * 		getTime()		//return long time
	 */

	class Transaction{
		protected $id;
		protected $tableId;
		protected $content;
		protected $time; 

		public function __construct($id,$tableId,$content,$time){
			$this->id=$id;
			$this->tableId=$tableId;
			$this->content=$content;
			$this->time=$time;
		}

		public function getId(){
			return $this->id;
		}

		public function getTableId(){
			return $this->tableId;
		}

		public function getContent(){
			return $this->content;
		}

		public function getTime(){
			return $this->time;
		}
	}

