<script language="javascript" type="text/javascript" src="<?php echo JS_URL; ?>activity/table/TableInfo.js"></script>




<div class="container">
	<div class="col-xs-offset-2 col-xs-8">
		<div class="row correction-row-css" style="margin-top:20px;position:relative;">
			<label class="control-label col-xs-2" style="padding-top: 12px;" for="input01">表名称</label>
			<div id="table" class="row col-xs-10"></div>
			<div id="inheritSearch" class="row col-xs-offset-3 col-xs-9 hide" style="margin-top: 30px;margin-bottom: 30px">
				<div class="col-xs-5 correction-clear-col-xs-padding">
	              <input  id="search_input" class="col-xs-12" placeholder="输入表ID" type="text">
	            </div>
	            <div class="correction-clear-col-xs-padding">
	            	<div id="search_button" class="btn correction-clear-col-xs-padding" style="font-size: 19px;"><span class="glyphicon glyphicon-search"></span></div>
	            </div>
	            <div id="searchResult"></div>
			</div>
		</div>
		<div class="row correction-row-css" style="margin-top:20px;position:relative;">
			<label class="control-label col-xs-2" style="padding-top: 6px;" for="input01">父表列表</label>
			<div id="parentTable" class="row col-xs-10"></div>
		</div>
		<div class="row correction-row-css" style="margin-top:20px;position:relative;">
			<label class="control-label col-xs-2" style="padding-top: 6px;" for="input01">子表列表</label>
			<div id="childTable" class="row col-xs-10"></div>
		</div>
		<div id="follower" class="row correction-row-css hide" style="margin-top:20px;position:relative;">
			<label class="control-label col-xs-2 " style="padding-top: 6px;font-size: 13px" for="input01">关注者&管理员</label>
			<div class="row col-xs-10">
				<div class="col-xs-12 text-center">
					<input id="filt_follower_input" type="text" placeholder="搜索">
					<div id="loaderScope"></div>
				</div>
				<div id="follower_list_scope" class="col-xs-12"></div>
			</div>
		</div>
	</div>

</div>


<div class="modal fade" id="changeNickName_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel_changeNickName">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel_changeNickName">名称修改</h4>
      </div>
      <div class="modal-body">
		  <form class="form-horizontal">
		    <fieldset>
		   		<div id="create_inp_parent_changeNickName" class="control-group row ">
		          <label class="control-label col-xs-2" for="input01">日程名称</label>
		          <div class="controls col-xs-10">
		            <input id="log_name_inp_changeNickName" type="text" placeholder="1-12个字符长度！" class="input-xlarge form-control"/>
		          </div>
                  <input type="text" style="display:none" />
		        </div>
		    </fieldset>
		  </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button id="changeNickName_save_btn" type="button" class="btn btn-primary">保存</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="checkAction_Modal" tabindex="-1" role="dialog" aria-labelledby="checkForAction">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel_changeNickName">操作确认</h4>
      </div>
      <div class="modal-body">
		  <form class="form-horizontal">
		    <fieldset>
		   		<div  class="control-group row ">
		          <label id="checkAction_Content" class="col-xs-12" for="input01"></label>
		        </div>
		    </fieldset>
		  </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
        <button id="checkAction_btn" type="button" class="btn btn-primary">确定</button>
      </div>
    </div>
  </div>
</div>













