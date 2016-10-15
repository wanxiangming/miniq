
/**
 * Backlog()
 * 		setId(ID)
 * 		getId()
 * 
 * 		setContent(content)
 * 		getContent()
 *
 * 		setIsMainLine(isMainLine)
 * 		isMainLine()
 *
 * 		setIsRecent(isRecent)
 * 		isRecent()
 */
var Backlog={
	creatNew:function(){
		var Backlog={};

		var id;
		var content;
		var isMainLine;
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

		Backlog.setIsMainLine=function(IS_MAIN_LINE){
			isMainLine=verifyBoolean(IS_MAIN_LINE);
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

		Backlog.isMainLine=function(){
			return isMainLine;
		}

		Backlog.setIsRecent=function(IS_RECENT){
			isRecent=verifyBoolean(IS_RECENT);
		}

		Backlog.isRecent=function(){
			return isRecent;
		}

		return Backlog;
	}
}
