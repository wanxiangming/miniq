<?php
	class MysqlMainLine extends CActiveRecord{
		public $content;

		public static function model($className=__CLASS__){  
			return parent::model($className);  
		}  
		
		public function tableName(){  
			return '{{mainLine}}';  
		} 

		public function rules(){
			return array(
					array('content','length','min'=>1,'max'=>12,'allowEmpty'=>false),
				);
		}
	}