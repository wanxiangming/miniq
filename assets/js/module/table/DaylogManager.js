document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/datastructure/Table.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/datastructure/AttentionTable.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/datastructure/Transaction.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/datastructure/TransactionDataStructure.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/module/table/Daylog.js"+'">' + '</script>');
/**
 * 它维护一个TransactionDataStructure池，当一个TransactionDataStructure被add到了一个Daylog中去，这个TransactionDataStructure就从池中移除，
 * 它从网络上获取到的这些TransactionDataStructure并不一定有Daylog可以去（因为适合这个TransactionDataStructure的Daylog可能还不存在），它们会
 * 暂时待在池中，直到被某个Daylog收走
 * 
 * 它会维护一个Daylog池，用户改变scopArea的时候，它会hide掉正在显示的，然后去池中找对应的Daylog，如果没有则创建新的Daylog，然后将对应的Daylog在相应的位置show出来
 * 定时器每执行一次，获取正在显示的Daylog的dayFlag，去已加载成功dayFlag数组中查询，如果没有，说明它还没有从网络上获取数据，这时将这个dayFlag添加到needRequestAry中
 * 所有正在显示的Daylog都查询完后，发起网络请求，获取到数据后将needRequestAry中的数据添加到已加载成功dayFlag数组中
 * 
 * 它持有页面上的scopArea，由它来组织Daylog的位置
 * 
 * 它会告诉外界它需要什么数据，让外界去网络上获取
 * 
 * 当外界告诉他根据tableId过滤信息的时候，它会去遍历自己的DaylogAry，对每一个都执行过滤
 *
 * 它会在进行网络请求的时候，进入loading状态，网络请求成功后回到loadingComplete状态。（包括获取数据和onCreate，onDelete，onChange，inSimplModal)
 *
 * outSimplModal的情况下：
 * 		当日志滑动出现有数据集时，它会阻止滚动，并发起网络请求，从网络上获取足够的数据，获取结束再开启滚动，并将数据组织好显示出来
 *   	Daylog获取到数据可以根据filt的情况给它或者它里面的transaction打上visible标记
 * 
 * DaylogManager(SCOPE)
 * 		whatINeed(CALL_BACK(timeAry))	//当它请求一些数据时，你可以做一些事，返回Deferred对象，以及TransacitonDataStructure对象数组
 * 		
 * 	    //nextMonth(CALL_BACK(time))
 * 	    //lastMonth(CALL_BACK(time))
 * 	    
 * 		onCreate(CALL_BACK(tableId,content,time))		//当transaction被创建的时候，你可以做一些事情，返回Deferred对象，以及TransacitonDataStructure对象
 * 		onDelete(CALL_BACK(transactionId))				//当transaction被删除的时候，你可以做一些事情，返回Deferred对象
 * 		onChange(CALL_BACK(transactionId,content,time))	//当transaction被修改的时候，你可以做一些事情，返回Deferred对象
 *
 * 		//精简模式先放一放，以后再做！！！
 * 		inSimplModal()	//进入精简模式，也就是不显示空白日的模式，精简模式会获取过去一年以及未来一年内的所有数据，并制作成精简显示版
 * 		outSimplModal()	//退出精简模式
 * 		
 * 		filtByDay(day)					//只显示某天的信息，如每个周的星期一（星期1）
 * 		filtByDate(date)				//只显示某日期的信息，如每月的3号（3日）
 * 		filtByContent(string)			//只显示内容包含某个特定字符串的transaction
 * 		filtByTableId(tableIdAry)		//只显示特定日程的transaction
 * 		filtByTableName(tableAnotherNameAry)	//只显示特定日程的transaction
 * 		clearFilt()						//移除filt限制
 */
var DaylogManager={
	creatNew:function(SCOPE){
		var DaylogManager={};

		var div=Div.creatNew();
		var daylogScopeList=[];
		var loadCompleteDayFlagAry=[];
		var daylogAry=[];
		var dayNum=6;
		var oneDayMS=Number(86400000);
		var timePicker=$("#mainTimePicker");
		var timePickerInput=$("#timePickerInput");

		var e_internetQuest=function(dayFlagAry){return $.Deferred();};
		var e_change=function(transactionId,content,time){return $.Deferred();};
		var e_create=function(tableId,content,time){return $.Deferred();};
		var e_delete=function(transactionId){return $.Deferred();};
		(function(){
			setDaylogScope();
			onScopeChangeRefreshUI()
			timePicker.datetimepicker({
				language:'zh-CN',
				weekStart: 1,
		        todayBtn:  1,
				autoclose: 1,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				forceParse: 0,
				initialDate:new Date()
		    }).on('changeDate',function(ev){
		    	refreshDayFlag(ev.date);
		    	onScopeChangeRefreshUI(ev.date);
		    });
		    timePicker.datetimepicker('update',new Date());

	    	SCOPE.bind('mousewheel',scrollMainTable);
			timePicker.bind('mousewheel',scrollMainTable);

			var isInternetQuestEnd=true;
			setInterval(function(){
				if(isInternetQuestEnd){
					var currentDayFlagAry=[];
					var questDayFlagAry=[];
					daylogScopeIterator(function(index,el){
						currentDayFlagAry.push(Number(el.getAttribute("dayFlag")));
					});
					$.each(currentDayFlagAry,function(index, el) {
						if($.inArray(el,loadCompleteDayFlagAry) < 0){
							questDayFlagAry.push(el);
						}
					});
					if(questDayFlagAry.length > 0){
						var def=e_internetQuest(questDayFlagAry);
						isInternetQuestEnd=false;
						def.done(function(TRANSACTION_DATA_STRUCTURE_ARY){
							$.each(TRANSACTION_DATA_STRUCTURE_ARY,function(index, el) {
								$.each(daylogAry,function(index, daylogel) {
									if(daylogel.getDayFlag() <= el.getTime()  &&  el.getTime() <= (daylogel.getDayFlag()+oneDayMS)){
										daylogel.addTransaction(el);
									}
								});
							});
							loadCompleteDayFlagAry=loadCompleteDayFlagAry.concat(questDayFlagAry);
							isInternetQuestEnd=true;
						});
					} 
				}
			},800);
			// div.setAttribute("style","height:310px;");
			div.addClass('panel-body');
			div.appendTo(SCOPE);
		})();
		
		function scrollMainTable(event,delta){
			var dl=delta > 0 ? false:true;
			if(dl){
				nextDay();
			}
			else{
				lastDay();
			}
			timePicker.datetimepicker('update',new Date(Number(daylogScopeList[0].getAttribute("dayFlag"))));
			onScopeChangeRefreshUI();
			return false;
		}

		function nextDay(){
			daylogScopeIterator(function(index,el){
				mDate=MDate.creatNew(Number(el.getAttribute("dayFlag")));
				mDate.setDate(Number(mDate.getDate())+1);
				el.setAttribute("dayFlag",mDate.getDayFlag());
			});
		}

		function lastDay(){
			daylogScopeIterator(function(index,el){
				mDate=MDate.creatNew(Number(el.getAttribute("dayFlag")));
				mDate.setDate(Number(mDate.getDate())-1);
				el.setAttribute("dayFlag",mDate.getDayFlag());
			});
		}

		function onScopeChangeRefreshUI(){
			$.each(daylogAry,function(index,value) {
				value.hide();
			});

			daylogScopeIterator(function(ind,el){
				var dayFlag=Number(el.getAttribute("dayFlag"));
				var isExist=false;
				$.each(daylogAry,function(index, daylogel) {
					if(daylogel.getDayFlag() == dayFlag){
						daylogel.show().appendTo(el.ui);
						isExist=true;
					}
				});
				if(!isExist){
					var daylog=creatDaylog(dayFlag);
					daylog.show().appendTo(el.ui);
					daylogAry.push(daylog);
				}
			});
		}

		function creatDaylog(DAY_FLAG){
			var daylog=Daylog.creatNew(DAY_FLAG);
			daylog.onCreate(function(TABLE_ID,CONTENT,TIME){
				var def=e_create(TABLE_ID,CONTENT,TIME);
				def.done(function(TRANSACTION_DATA_STRUCTURE){
					// daylog.addTransaction(TRANSACTION_DATA_STRUCTURE);逻辑上不通，都已经是daylog告诉你它创建了一个新的transaction了
					// 你怎么还给它再添加一次？
				});
				return def;
			});
			daylog.onDelete(function(TRANSACTION_ID){
				var def=e_delete(TRANSACTION_ID);
				def.done(function(){

				});
				return def;
			});
			daylog.onChange(function(TRANSACTION_ID,CONTENT,TIME){
				var def=e_change(TRANSACTION_ID,CONTENT,TIME);
				def.done(function(){

				});
				return def;
			});
			return daylog;
		}

		function refreshDayFlag(TIME){
			var mDate=MDate.creatNew(TIME);
			daylogScopeIterator(function(ind,el){
				el.setAttribute("dayFlag",mDate.getDayFlag());
				mDate.setDate(Number(mDate.getDate())+1);
			});
		}

		function daylogScopeIterator(CALL_BACK){
			$.each(daylogScopeList,function(index, el) {
				CALL_BACK(index,el);
			});
		}

		function setDaylogScope(THE_BEGINING_DATE){
			var mDate=MDate.creatNew(new Date());
			for(i=0; i<dayNum; i++){
				var logScope=Div.creatNew();
				logScope.setAttribute("style","height:280px;overflow-y: auto;");
				logScope.setAttribute("dayFlag",mDate.getDayFlag());
				logScope.addClass("col-xs-2");
				logScope.appendTo(div.ui);
				daylogScopeList.push(logScope);
				mDate.setDate(Number(mDate.getDate())+1);
			}
		}

		DaylogManager.onCreate=function(CALL_BACK){
			e_create=CALL_BACK;
		}

		DaylogManager.onChange=function(CALL_BACK){
			e_change=CALL_BACK;
		}

		DaylogManager.onDelete=function(CALL_BACK){
			e_delete=CALL_BACK;
		}

		DaylogManager.whatINeed=function(CALL_BACK){
			e_internetQuest=CALL_BACK;
		}

		return DaylogManager;
	}
}