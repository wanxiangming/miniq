<?php
	class MysqlBacklog extends CActiveRecord{
		public $content;
		
		public static function model($className=__CLASS__){  
			return parent::model($className);  
		}  
		
		public function tableName(){  
			return '{{backlog}}';  
		} 
		
		public function rules(){
			return array(
					array('content','length','min'=>1,'max'=>150,'allowEmpty'=>false),
				);
		}
	}