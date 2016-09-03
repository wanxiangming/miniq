<script language="javascript" type="text/javascript" src="<?php echo JS_URL; ?>activity/main/Test.js"></script>
<link type="text/css" rel="stylesheet" href="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/icheck/skins/flat/_all.css"/>
<script language="javascript" type="text/javascript" src="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/icheck/icheck.min.js"></script>

<div class="container-fluid clearfix" >
	<!-- <div class="col-xs-offset-1 col-xs-10"> -->
		<div id="backlogBoxRow" class="row form-inline" >
			
		</div>
	<!-- </div> -->
</div>


<div class="modal fade" id="backlog_edit_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">修改待办事项</h4>
      </div>
      <div class="modal-body">

      <form class="form-horizontal">
        <fieldset>

          <div id="backlog_edit_modal_content_row" class="row correction-row-css" style="margin-top:20px;position:relative;">
            <label class="control-label col-xs-2" for="input01">事务内容</label>
            <div class="col-xs-8">
                <textarea  id="backlog_edit_modal_content_textarea" type="text" class="form-control"  style="overflow-y:visible;resize:none;font-size:15px;" rows="7" ></textarea>
            </div>
            <div id="backlog_edit_modal_content_length" class="col-xs-2 control-label" style="position:absolute;right:0px;bottom:0px;text-align:left;">150字</div>
          </div>

          <div class="row correction-row-css form-inline" style="margin-top:10px;margin-left:24px">
            <input type="checkbox" id="isMainQuestCheck_checkbox">
            <label class="control-label" style="padding-top:0px" for="input01">与&nbsp;&quot;<span class="mainQuestContent_span">xxx</span>&quot;&nbsp;相关</label>
          </div>

          <div class="row correction-row-css form-inline" style="margin-top:7px;margin-left:24px">
            <input type="checkbox" id="isRecentCheck_checkbox">
            <label class="control-label" style="padding-top:0px" for="input01">近期完成</label>
          </div>
          
        </fieldset>
      </form>

      </div>
      <div id="btnArea" class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button id="backlog_edit_modal_delete_btn" type="button" class="btn btn-danger" data-toggle="modal" data-target="#checkAction_Modal">删除</button>
        <button id="backlog_edit_modal_complete_btn" type="button" class="btn btn-success" data-toggle="modal" data-target="#checkAction_Modal">完成</button>
        <button id="backlog_edit_modal_save_btn" type="button" class="btn btn-primary">保存</button>
      </div>
    </div>
  </div>
</div>



<div class="modal fade" id="backlog_add_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">添加待办事项</h4>
      </div>
      <div class="modal-body">

      <form class="form-horizontal">
        <fieldset>

          <div id="backlog_add_modal_content_row" class="row correction-row-css" style="margin-top:20px;position:relative;">
            <label class="control-label col-xs-2" for="input01">事务内容</label>
            <div class="col-xs-8">
                <textarea  id="backlog_add_modal_content_textarea" type="text" class="form-control"  style="overflow-y:visible;resize:none;font-size:15px;" rows="7" ></textarea>
            </div>
            <div id="backlog_add_modal_content_length" class="col-xs-2 control-label" style="position:absolute;right:0px;bottom:0px;text-align:left;">150字</div>
          </div>

          <div class="row correction-row-css form-inline" style="margin-top:10px;margin-left:24px">
            <input type="checkbox" id="backlog_add_modal_isMainQuestCheck_checkbox">
            <label class="control-label" style="padding-top:0px" for="input01">与&nbsp;&quot;<span class="mainQuestContent_span">xxx</span>&quot;&nbsp;相关</label>
          </div>

          <div class="row correction-row-css form-inline" style="margin-top:7px;margin-left:24px">
            <input type="checkbox" id="backlog_add_modal_isRecentCheck_checkbox">
            <label class="control-label" style="padding-top:0px" for="input01">近期完成</label>
          </div>
          
        </fieldset>
      </form>

      </div>
      <div id="btnArea" class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button id="backlog_add_modal_save_btn" type="button" class="btn btn-primary">添加</button>
      </div>
    </div>
  </div>
</div>


<div class="modal fade" id="set_mianQuest_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">设置主线</h4>
      </div>
      <div class="modal-body">

      <form class="form-horizontal">
        <fieldset>

          <div class="row correction-row-css form-inline">
            <label class="col-xs-offset-1 col-xs-10" for="input01">为你的生活设置一条主线吧</label>
          </div>
          <div class="row correction-row-css form-inline">
            <label class="col-xs-offset-1 col-xs-10" for="input01">就像西天取经之于唐僧</label>
          </div>
          <div class="row correction-row-css form-inline">
            <label class="col-xs-offset-1 col-xs-10" for="input01">奥斯卡影帝之于小李子</label>
          </div>
          <div id="set_mianQuest_modal_content_row" class="row correction-row-css" style="margin-top:20px">
            <label class="control-label col-xs-2" for="input01">主线</label>
            <div class="col-xs-7">
              <input  id="set_mianQuest_modal_input" type="text" class="form-control" placeholder="1-12个字符长度"  style="width:260;overflow-y:visible;resize:none;font-size:15px;"></input>
            </div>
          </div>
          
        </fieldset>
      </form>

      </div>
      <div id="btnArea" class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button id="set_mianQuest_modal_save_btn" type="button" class="btn btn-primary">保存</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="backlog_check_action_modal" tabindex="-1" role="dialog" aria-labelledby="checkForAction">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">操作确认</h4>
      </div>
      <div class="modal-body">
      <form class="form-horizontal">
        <fieldset>
          <div  class="control-group row ">
              <label id="backlog_check_action_modal_content" class="col-xs-12" for="input01"></label>
            </div>
        </fieldset>
      </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
        <button id="backlog_check_action_modal_confirm_btn" type="button" class="btn btn-primary">确定</button>
      </div>
    </div>
  </div>
</div>
