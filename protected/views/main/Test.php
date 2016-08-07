<script language="javascript" type="text/javascript" src="<?php echo JS_URL; ?>activity/main/Test.js"></script>

<div class="container-fluid clearfix" >
	<div class="col-xs-offset-1 col-xs-10">
		<div id="backlogBoxRow" class="row form-inline" >
			
		</div>
	</div>
</div>



<div class="modal fade" id="backlog_edit_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">修改事务</h4>
      </div>
      <div class="modal-body">

      <form class="form-horizontal">
        <fieldset>

          <div class="row correction-row-css form-inline" style="margin-top:20px">
            <label class="control-label col-xs-2" for="input01">事务内容</label>
            <textarea  id="backlog_modal_content_textarea" type="text" class=""  style="width:260;overflow-y:visible;resize:none;font-size:15px;" rows="7" cols="54" ></textarea>
          </div>
          
        </fieldset>
      </form>

      </div>
      <div id="btnArea" class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button id="change_log_modal_delete_btn" type="button" class="btn btn-danger" data-toggle="modal" data-target="#checkAction_Modal">删除</button>
        <button id="change_log_modal_change_btn" type="button" class="btn btn-primary">保存</button>
      </div>
    </div>
  </div>
</div>


