


/**
 * FollowerItemAryIterator(FollowerItemAry)
 * 		iterate(CALL_BACK(FollowerItem))
 * 		sort()
 */
var FollowerItemAryIterator={
	creatNew:function(FOLLOWER_ITEM_ARY){
		var FollowerItemAryIterator={};

		var followerItemAry=FOLLOWER_ITEM_ARY;

		FollowerItemAryIterator.iterate=function(CALL_BACK){
			$.each(followerItemAry,function(index, el) {
				CALL_BACK(el);
			});
		}

		FollowerItemAryIterator.sort=function(){
			followerItemAry.sort(function(FOLLOWER_A,FOLLOWER_B){
				if(FOLLOWER_A.isCreator()){
					return -1;
				}
				if(FOLLOWER_A.isManager() == FOLLOWER_B.isManager()){
					if(FOLLOWER_A.getFollowerId() <= FOLLOWER_B.getFollowerId()){
						return -1;
					}
					else{
						return 1;
					}
				}
				else{
					if(FOLLOWER_A.isManager()){
						return -1;
					}
					else{
						return 1;
					}
				}
			});
		}

		return FollowerItemAryIterator;
	}
}













