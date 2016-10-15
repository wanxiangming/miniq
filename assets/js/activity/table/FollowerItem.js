
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/div/Div.js"+'">' + '</script>');
document.write('<script' + ' type="text/javascript" src="'+"assets/js/uitool/listitem/DropDownListItem.js"+'">' + '</script>');


/**
 * FollowerItem(FollowerDataStructure)
 * 		getUI()
 * 		show()
 * 		hide()
 * 		getFollowerId()
 * 		getFollowerName()
 * 		isManager()
 * 		isCreator()
 * 		onSetToManager(CALL_BACK(followerId))
 * 		onRepealManager(CALL_BACK(followerId))
 */
var FollowerItem={
	creatNew:function(FOLLOWER_DATA_STRUCTURE){
		var FollowerItem={};

		var followerDataStructure=FOLLOWER_DATA_STRUCTURE;
		var div=Div.creatNew();
		var e_setToManager=function(){};
		var e_repealManager=function(){};

		(function(){
			var userInfoDiv=Div.creatNew();
			userInfoDiv.html(followerDataStructure.getFollowerName()+" ("+followerDataStructure.getFollowerId()+") ");

			var dropDownListItem=null;
			if(followerDataStructure.isCreator()){
				dropDownListItem=DropDownListItem.creatNew(false,"<span class=\"glyphicon glyphicon-cog\"></span>","mousein");
			}
			else{
				dropDownListItem=DropDownListItem.creatNew(true,"<span class=\"glyphicon glyphicon-cog\"></span>","mousein");
			}
			
			dropDownListItem.appendContent(userInfoDiv.ui);
			dropDownListItem.appendTo(div.ui);

			if(followerDataStructure.isManager()){
				getManagerSpan().appendTo(userInfoDiv.ui);
				dropDownListItem.addDropDownMenu(dropDownMenuRepealManager());
			}
			else{
				dropDownListItem.addDropDownMenu(dropDownMenuSetManager());
			}
		})();

		function dropDownMenuSetManager(){
			var setManager=DropDownItemButton.creatNew();
			setManager.html("提升为管理员");
			setManager.ui.bind("click",function(){
				e_setToManager(followerDataStructure.getFollowerId());
			});
			return setManager;
		}

		function dropDownMenuRepealManager(){
			var repealManager=DropDownItemButton.creatNew();
			repealManager.html("撤销此管理员");
			repealManager.ui.bind("click",function(){
				e_repealManager(followerDataStructure.getFollowerId());
			});
			return repealManager;
		}

		function getManagerSpan(){
			var span=Span.creatNew();
			span.setAttribute("aria-hidden",true);
			span.setAttribute("data-toggle","tooltip");
			span.setAttribute("data-placement","right");
			span.addClass('glyphicon glyphicon-tag');
			span.setAttribute("data-original-title","管理员");
			span.ui.tooltip();
			return span.ui;
		}

		FollowerItem.getUI=function(){
			return div.ui;
		}

		FollowerItem.show=function(){
			div.removeClass('hide');
		}

		FollowerItem.hide=function(){
			div.addClass('hide');
		}

		FollowerItem.getFollowerId=function(){
			return followerDataStructure.getFollowerId();
		}

		FollowerItem.getFollowerName=function(){
			return followerDataStructure.getFollowerName();
		}

		FollowerItem.isManager=function(){
			return followerDataStructure.isManager();
		}

		FollowerItem.isCreator=function(){
			return followerDataStructure.isCreator();
		}

		FollowerItem.onSetToManager=function(CALL_BACK){
			e_setToManager=CALL_BACK;
		}

		FollowerItem.onRepealManager=function(CALL_BACK){
			e_repealManager=CALL_BACK;
		}

		return FollowerItem;
	}
}











