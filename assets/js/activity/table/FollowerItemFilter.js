
document.write('<script' + ' type="text/javascript" src="'+"assets/js/activity/table/FollowerItemAryIterator.js"+'">' + '</script>');

/**
 * FollowerItemFilter(FollowerItemAry)
 * 		filt(string)		//FollowerItem数组
 */
var FollowerItemFilter={
	creatNew:function(FOLLOWER_ITEM_ARY){
		var FollowerItemFilter={};

		var followerItemAry=FOLLOWER_ITEM_ARY;
		var followerItemAryIterator=FollowerItemAryIterator.creatNew(followerItemAry);

		(function(){
			followerItemAryIterator.sort();
		})();

		FollowerItemFilter.filt=function(STRING){
			var resultA=filtByFollowerId(STRING);
			var resultB=filtByFollowerName(STRING);
			var isExist=false;
			$.each(resultB,function(index, elB) {
				isExist=false;
				$.each(resultA,function(index, elA) {
					if(elB.getFollowerId() == elA.getFollowerId()){
						isExist=true;
					}
				});
				if(!isExist){
					resultA.push(elB);
				}
			});
			return resultA;
		}

		function filtByFollowerId(FOLLOWER_ID){
			var resultAry=[];
			var goalFollowerId=FOLLOWER_ID.toString();
			var goalFollowerIdLength=goalFollowerId.length;
			followerItemAryIterator.iterate(function(FOLLOWER_ITEM){
				followerId=FOLLOWER_ITEM.getFollowerId().toString();
				if(followerId.substring(0,goalFollowerIdLength) == goalFollowerId){
					resultAry.push(FOLLOWER_ITEM);
				}
			});
			return resultAry;
		}

		function filtByFollowerName(FOLLOWER_NAME){
			var resultAry=[];
			var goalFollowerName=FOLLOWER_NAME;
			var reg=new RegExp(goalFollowerName);
			followerItemAryIterator.iterate(function(FOLLOWER_ITEM){
				var followerName=FOLLOWER_ITEM.getFollowerName();
				if(reg.test(followerName)){
					resultAry.push(FOLLOWER_ITEM);
				}
			});
			return resultAry;
		}

		return FollowerItemFilter;
	}
}







