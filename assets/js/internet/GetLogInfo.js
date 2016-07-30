

var GetLogInfo={
	creatNew:function(){
		var GetLogInfo={};

		GetLogInfo.send=function(OPEN_ID,TODAY_TIME,CALL_BACK_SUCCESS){
			$.ajax({
				url:GET_LOG_INFO,
				dataType:"json",
				async:true,
				data:{"openId":OPEN_ID,"today":TODAY_TIME},
				type:"GET",
				cache:false,
				
				success:function(data){
					CALL_BACK_SUCCESS(data);
				},

				error:function(XMLHttpRequest, textStatus, errorThrown){
					alert(errorThrown);
				}
			});
		}

		return GetLogInfo;
	}
}
