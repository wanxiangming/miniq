

/**
 * ContentInputController(input)
 * 		onChange(CALL_BACK(content,remainLength))
 * 		verify()	验证输入框中的内容是否符合长度要求.......，符合返回true，不符合返回false
 * 		setContent()	设置输入框内容
 * 		getContent()	
 * 		getRemainLength()	获取输入框合法输入内容所剩长度
 * 		empty()		清空输入框内容
 */
var ContentInputController={
	creatNew:function(INPUT){
		var ContentInputController={};

		var input=INPUT;
		var CONTENT_LENGTH_MAX=150;
		var CONTENT_LENGTH_MIN=1;
		var e_change=function(CONTENT,REMAIN_LENGTH){};
		(function(){
			input.bind("input propertychange",function(){
				e_change(getContent(),getRemainLength());
			});
		})();

		ContentInputController.getRemainLength=function(){
			return getRemainLength();
		}

		function getRemainLength(){
			return CONTENT_LENGTH_MAX-getLength();
		}

		ContentInputController.verify=function(){
			return thisVerify();
		}

		function thisVerify(){
			if(CONTENT_LENGTH_MIN<=getLength() && getLength()<=CONTENT_LENGTH_MAX){
				return true;
			}
			else{
				return false;
			}
		}

		function getLength(){
			return Number(getContent().length);
		}

		ContentInputController.getContent=function(){
			return getContent();
		}

		function getContent(){
			return input.val();
		}

		ContentInputController.onChange=function(CALL_BACK){
			e_change=CALL_BACK;
		}

		ContentInputController.setContent=function(CONTENT){
			input.val(CONTENT);
		}

		ContentInputController.empty=function(){
			input.val("");
		}

		return ContentInputController;
	}
}

var BacklogContentInputController={
	creatNew:function(INPUT){
		var BacklogContentInputController=ContentInputController.creatNew(INPUT);
		return BacklogContentInputController;
	}
}


/**
 * NameInputController()
 */
var NameInputController={
	creatNew:function(INPUT){
		var NameInputController=ContentInputController.creatNew(INPUT);

		var CONTENT_LENGTH_MAX=12;
		var CONTENT_LENGTH_MIN=1;

		NameInputController.verify=function(){
			return thisVerify();
		}

		function thisVerify(){
			if(CONTENT_LENGTH_MIN<=getLength() && getLength()<=CONTENT_LENGTH_MAX){
				return true;
			}
			else{
				return false;
			}
		}

		function getLength(){
			return Number(getContent().length);
		}

		function getContent(){
			return INPUT.val();
		}

		return NameInputController;
	}
}