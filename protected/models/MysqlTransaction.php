<?php

	class MysqlTransaction extends CActiveRecord{  
	
		public static function model($className=__CLASS__){  
			return parent::model($className);  
		}  
		
		public function tableName(){  
			return '{{tabletransaction}}';  
		} 

		public function rules(){
			return array(
					array('content','length','min'=>1,'max'=>1000,'allowEmpty'=>false),
				);
		}
	} 