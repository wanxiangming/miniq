document.write('<script' + ' type="text/javascript" src="'+"assets/js/util/MDate.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/button/Button.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/modal/CreateTransactionModal.js"+'">' + '</script>');
/**
 * 有两种显示模式，一种是显示年月日，一种是星期和日期
 * 它会根据日期自动调整自己的样式（也就是显示“今天”）
 * 
 * DateItem(dayFlag)
 * 		show()
 * 		hide()
 * 		onCreate(CALL_BACK(tableId,content,time))	//当transaction被创建的时候，你可以做一些事情，返回Deferred对象
 * 		changeUiToYMD()
 * 		changeUiToDD()
 */
var DateItem={
	creatNew:function(DAY_FLAG){
		var DateItem={};

		var dayFlag=DAY_FLAG;
		var theMDate=MDate.creatNew(DAY_FLAG);
		var scope=Div.creatNew();
		var dateBtn=Button.creatNew();
		var createTransactionModal=CreateTransactionModal.creatNew();
		var e_create=function(TABLE_ID,CONTENT,TIME){return $.Deferred();};
		var e_modalClose=function(){};
		(function(){
			initDateBtn();
			createTransactionModal.bindModal(dateBtn.ui);
			createTransactionModal.onCreate(function(TABLE_ID,CONTENT,TIME){
				var def=e_create(TABLE_ID,CONTENT,TIME);
				def.done(function(){
					createTransactionModal.hide();
				});
				return def;
			});
			dateBtn.onClickListener(function(){
				createTransactionModal.initBeforeShow(dayFlag);
			});
		})();

		function initDateBtn(){
			dateBtn.addClass("btn text-center col-xs-12");
			dateBtn.appendTo(scope.ui);
			if(isToday()){
				dateBtn.addClass("btn-primary");
			}
			else{
				dateBtn.addClass("btn-activity-main-dateBtn");
			}
			changeUiToDD();
		}

		function isToday(){
			var todayFlag=MDate.creatNew(new Date()).getDayFlag();
			return dayFlag == todayFlag;
		}

		DateItem.onCreate=function(CALL_BACK){
			e_create=CALL_BACK;
		}

		DateItem.changeUiToDD=function(){
			changeUiToDD();
		}

		function changeUiToDD(){
			dateBtn.html(theMDate.getChineseDay()+"&nbsp;&nbsp;&nbsp;"+theMDate.getDate());
		}

		DateItem.changeUiToYMD=function(){
			changeUiToYMD();
		}

		function changeUiToYMD(){
			dateBtn.html(theMDate.getFullYear()+"年"+theMDate.getDate()+"月"+theMDate.getDay()+"日");
		}

		DateItem.show=function(){
			show();
			return scope.ui;
		}

		function show(){
			scope.removeClass('hide');
		}

		DateItem.hide=function(){
			hide();
		}

		function hide(){
			scope.addClass('hide');
		}

		DateItem.onModalClose=function(CALL_BACK){
			e_modalClose=CALL_BACK;
		}
		

		return DateItem;
	}
}
