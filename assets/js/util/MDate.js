
var MDate={
	creatNew:function(DATE){
		var MDate=new Date(DATE);

		MDate.getTimeSeconds=function(){
			return secondsTime(MDate);
		}

		//该函数已弃用
		MDate.getTheDayBeginingTimeSeconds=function(){
			return secondsTime(MDate.getTheDayBeginingTime());
		}

		MDate.getTheDayBeginingTime=function(){
			var newDate=new Date(DATE);
			newDate.setHours(0);
			newDate.setMinutes(0);
			newDate.setSeconds(0);
			newDate.setMilliseconds(0);
			return newDate;
		}

		MDate.getChineseDay=function(){
			return turnToChineseDay(MDate.getDay());
		}

		MDate.getDayFlag=function(){
			return MDate.getTheDayBeginingTime().getTime();
		}

		function secondsTime(D){
			return Math.floor(D.getTime()/1000);
		}

		function turnToChineseDay(DAY){
			switch(DAY){
				case 1:
					return "星期一";

				case 2:
					return "星期二";

				case 3:
					return "星期三";

				case 4:
					return "星期四";

				case 5:
					return "星期五";

				case 6:
					return "星期六";

				case 0:
					return "星期天";
			}
		}

		return MDate;
	}
}
