

/**
 * FollowerDataStructure(isManager,isCreator)	//接收boolean变量
 * 		setFollowerId(id)
 * 		getFollowerId()
 *
 * 		setFollowerName(name)
 * 		getFollowerName()
 *
 * 		isManager()
 * 		isCreator()
 */
var FollowerDataStructure={
	creatNew:function(IS_MANAGER,IS_CREATOR){
		var FollowerDataStructure={};

		var isManager=IS_MANAGER;
		var isCreator=IS_CREATOR;
		var followerId;
		var followerName;

		FollowerDataStructure.setFollowerId=function(FOLLOWER_ID){
			followerId=Number(FOLLOWER_ID);
		}

		FollowerDataStructure.getFollowerId=function(){
			return followerId;
		}

		FollowerDataStructure.setFollowerName=function(FOLLWER_NAME){
			followerName=FOLLWER_NAME;
		}

		FollowerDataStructure.getFollowerName=function(){
			return followerName;
		}

		FollowerDataStructure.isManager=function(){
			return isManager;
		}

		FollowerDataStructure.isCreator=function(){
			return isCreator;
		}

		return FollowerDataStructure;
	}
}



