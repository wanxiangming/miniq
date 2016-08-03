document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/MDate.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/TextTranslator.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');


function host(){
	alert(typeof(true)=="boolean");
	
}


/**
 * BacklogBox
 * 		addItem(Backlog)	向代办事项盒子里添加数据
 * 		removeItem(ID)		告诉待办事项盒子移除某条数据
 * 		onRemoveItem(CALL_BACK(ID))	当代办事项盒子要移除某条数据时，你可以进行某些操作，当且仅当你的操作
 * 										返回true时，待办事项盒子才去真正的移除数据
 */
var BacklogBox={
	creatNew:function(){
		var BacklogBox={};


		return BacklogBox;
	}
}


/**
 * Backlog
 * 		setId(ID)
 * 		getId()
 * 		
 * 		setContent(CONTENT)
 * 		getContent()
 *
 * 		setIsMainQuest()	设置主线相关性	
 * 		isMain()	是否与主线相关
 *
 * 		setIsRecent()	设置时间紧迫性
 * 		isRecent()	是否是近期事务 
 */
var Backlog={
	creatNew:function(){
		var Backlog={};

		var id;
		var content;
		var isMainQuest;
		var isRecent;

		Backlog.setId=function(ID){
			id=Number(ID);
		}

		Backlog.getId=function(){
			return id;
		}

		Backlog.setContent=function(CONTENT){
			content=CONTENT;
		}

		Backlog.getContent=function(){
			return content;
		}

		Backlog.setIsMainQuest=function(ISMAINQUEST){
			isMainQuest=verifyBoolean(ISMAINQUEST);
		}

		function verifyBoolean(DATA){
			if(typeof(DATA) == "number"){
				if(DATA==0 || DATA<0){
					return false;
				}
				else{
					return true;
				}
			}
			else if(typeof(DATA) == "boolean"){
				return DATA;
			}
			else{
				alert("Backlog接收数据类型错误");
				return false;
			}
		}


		Backlog.isMainQuest=function(){
			return isMainQuest;
		}

		Backlog.setIsRecent=function(ISRECENT){
			isRecent=verifyBoolean(ISRECENT);
		}

		Backlog.isRecent=function(){
			return isRecent;
		}

		return Backlog;
	}
}



