MINIQ_URL="http://www.miniq.site/?r=";

//用户登陆时，做用户检查用的url
LOGIN_CHECK=MINIQ_URL+"MysqlUser/LoginCheck";
SET_COOKIE=MINIQ_URL+"Login/SetCookie";
CHECK_COOKIE=MINIQ_URL+"Login/CheckCookie";
DEL_COOKIE=MINIQ_URL+"Login/DelCookie";
CHANGE_NICK_NAME=MINIQ_URL+"MysqlUser/ChangeNickName";

//用户相关url
ALTER_USER_INFO=MINIQ_URL+"MysqlUser/AlterUserInfo";

//日程表相关url
CREATE_LOG_TABLE=MINIQ_URL+"MysqlTable/CreateLogTable";
GET_LOG_TABLE_LIST=MINIQ_URL+"MysqlTable/GetLogTableList";
GET_ATTENTION_TBABLE_INFO=MINIQ_URL+"MysqlTable/GetAttentonTableInfo";
GET_TABLE_INFO=MINIQ_URL+"MysqlTable/GetTableInfo";
CHANGE_TABLE_NAME=MINIQ_URL+"MysqlTable/ChangeLogTableName";
CHANGE_TABLE_ANOTHER_NAME=MINIQ_URL+"MysqlTable/ChangeLogTableAnotherName";
DEPRECATED_TABLE=MINIQ_URL+"MysqlTable/DeprecatedLogTable";
CANCEL_ATTENTION=MINIQ_URL+"MysqlTable/CancelAttention";
SEARCH_TABLE_BY_TABLE_ID=MINIQ_URL+"MysqlTable/SearchTableByTableId";
PAY_ATTENTION_TO_TABLE=MINIQ_URL+"MysqlTable/PayAttention";
OPEN_THE_TABLE=MINIQ_URL+"MysqlTable/OpenTheTable";
INHERIT=MINIQ_URL+"MysqlTable/Inherit";
RELIEVE_INHERIT=MINIQ_URL+"MysqlTable/RemoveInherit";
GET_FOLLOWER_LIST=MINIQ_URL+"MysqlTable/GetFollowerList";

//管理员相关
ADD_MANAGER=MINIQ_URL+"MysqlTableManagerGroup/AddManager";
REPEAL_MANAGER=MINIQ_URL+"MysqlTableManagerGroup/RepealManager";

//日程事务相关url
GET_TRANSACTION_BY_TIMEARY=MINIQ_URL+"MysqlTransaction/GetTransactionByTimeAry";
GET_TRANSACTION=MINIQ_URL+"MysqlTransaction/GetTransaction";
CREATE_LOG_TRANSACTION=MINIQ_URL+"MysqlTransaction/AddTransaction";
CHANGE_LOG_TRANSACTION=MINIQ_URL+"MysqlTransaction/ChangeTransaction";
DELETE_LOG_TRANSACTION=MINIQ_URL+"MysqlTransaction/DeleteTransaction";

//待办事项相关url
ADD_MAIN_LINE=MINIQ_URL+"MysqlBacklog/AddMainLine";
GET_INFO_IN_USE_MAIN_LINE_AND_UNCOMPLETED_BACKLOG=MINIQ_URL+"MysqlBacklog/GetInfoInUseMainLineAndUncompletedBacklog";
ADD_BACKLOG=MINIQ_URL+"MysqlBacklog/AddBacklog";
REMOVE_BACKLOG=MINIQ_URL+"MysqlBacklog/RemoveBacklog";
CHANGE_BACKLOG=MINIQ_URL+"MysqlBacklog/ChangeBacklog";
COMPLETE_BACKLOG=MINIQ_URL+"MysqlBacklog/CompleteBacklog";



















