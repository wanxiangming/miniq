
var GetLogTableList={
	creatNew:function(){
		var GetLogTableList={};

		GetLogTableList.send=function(OPEN_ID,CALL_BACK_SUCCESS){
			$.ajax({
				url:"http://www.miniq.site/?r=MysqlTable/GetLogTableList",
				dataType:"json",
				async:true,
				data:{"openId":OPEN_ID},
				type:"GET",
				
				success:function(data){
					CALL_BACK_SUCCESS(data);
				},

				error:function(XMLHttpRequest, textStatus, errorThrown){
					alert(errorThrown);
				}
			});
		}

		return GetLogTableList;
	}
}












