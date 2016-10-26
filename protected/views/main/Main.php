
<script language="javascript" type="text/javascript" src="<?php echo JS_URL; ?>activity/main/Main.js"></script>

<!-- icheck -->
<link type="text/css" rel="stylesheet" href="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/icheck/skins/flat/_all.css"/>
<script language="javascript" type="text/javascript" src="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/icheck/icheck.min.js"></script>

<!-- bootstrap timepicker -->
<script language="javascript" type="text/javascript" src="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.min.js" charset="UTF-8"></script>
<script language="javascript" type="text/javascript" src="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/bootstrap-datetimepicker-master/js/locales/bootstrap-datetimepicker.zh-CN.js" charset="UTF-8"></script>
<script language="javascript" type="text/javascript" src="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/bootstrap-datetimepicker-master/js/locales/bootstrap-datetimepicker.fr.js" charset="UTF-8"></script>
<link type="text/css" rel="stylesheet" href="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.min.css"/>



<div class="container-fluid clearfix" style="">
    <div id="dynamicExpansionArea" class="container row"></div>


    <div id="backlogBoxRow" class="row form-inline col-xs-12 correction-row-css"  style="margin-top:40px;">
      
    </div> 

    <div id="table" class="row text-center col-xs-12" style="margin-top:80px;">
        <div class="col-xs-5 text-right"  style="padding-top:15px">
          <div id="loaderScope" style="position: absolute;right: 10px;padding-top: 5px;"></div>
        </div>

        <div class="form-group col-xs-2" style="padding-top:15px">
            <div style="position:relative">
              <div id="mainTimePicker" class="input-group date form_date text-center" data-date="" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" data-link-format="yyyy-mm-dd">
                <input id="timePickerInput" style="text-align: center;border: 2px solid #ccc;/*background: rgb(33, 102, 140);color: white;*/" class="form-control" size="16" type="text" value="" readonly>
                <span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>
              </div>
              <div id="tipScope" style="position:absolute;top:0px;width:100%;z-index:3"></div>
            </div>
        </div>
    </div> 
   
    <div class="row col-xs-12 correction-row-css" style="margin-bottom:100px">
        <div class="col-xs-1"></div>
        <div id="mainTable" class="row form-inline col-xs-10 correction-row-css panel panel-primary" style="height: 310px">
        
        </div>
    </div>        
</div>

<div class="modal fade" id="create_log_transaction_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">添加事务</h4>
      </div>
      <div class="modal-body">

		  <form class="form-horizontal">
		    <fieldset>
          <div class="row correction-row-css">
              <label class="control-label col-xs-2" for="input01">来源</label>
              <div class="col-xs-5 correction-clear-col-xs-padding">
                <select id="create_log_modal_tableSelect" class="form-control"></select>
              </div>
          </div>
          
          <div class="row correction-row-css form-inline">
            <div class="row correction-row-css" style="margin-top:20px">

              <div class="row correction-row-css form-inline">
                <div class="col-xs-offset-2 col-xs-2 text-center">
                  <div type="button" class="btn btn-default" id="create_log_modal_hour_up_btn"><span class="glyphicon glyphicon-chevron-up"></span></div>
                </div>
                <div class="col-xs-2 text-center">
                  <div type="button" class="btn btn-default" id="create_log_modal_minute_up_btn"><span class="glyphicon glyphicon-chevron-up"></span></div>
                </div>
              </div>
              

              <label class="control-label col-xs-2" for="input01">时间</label>
              <div class="row correction-row-css form-inline">
                <div class="col-xs-2 text-center"><strong style="font-size:20px" id="create_log_modal_hour">8</strong></div>
                <div class="col-xs-2 text-center"><strong style="font-size:20px" id="create_log_modal_minute">30</strong></div>
              </div>

              <div class="row correction-row-css form-inline ">
                <div class="col-xs-offset-2 col-xs-2 text-center ">
                  <div type="button" class="btn btn-default" id="create_log_modal_hour_down_btn"><span class="glyphicon glyphicon-chevron-down"></span></div>
                </div>
                <div class="col-xs-2 text-center">
                  <div type="button" class="btn btn-default" id="create_log_modal_minute_down_btn"><span class="glyphicon glyphicon-chevron-down"></span></div>
                </div>
              </div>
              
            </div>
          </div>

          <div id="create_transaction_content_row" class="row correction-row-css form-inline" style="margin-top:20px;position:relative;">
            <label class="control-label col-xs-2" for="input01">内容</label>
            <textarea  id="create_log_modal_content_input" type="text" class="col-xs-8"  style="width:260;overflow-y:visible;resize:none;font-size:15px;" rows="15" cols="54" ></textarea>
            <div id="transaction_create_input_length" class="col-xs-2 control-label" style="position:absolute;right:0px;bottom:0px;text-align:left;">1000字</div>
          </div>
		   		
		    </fieldset>
		  </form>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button id="create_log_modal_create_btn" type="button" class="btn btn-primary">创建</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="time_same_transaction_modal" tabindex="-1" role="dialog" aria-labelledby="checkForAction">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <fieldset>
          <div id="time_same_transaction_scope"></div>
        </fieldset>
      </div>
    </div>
  </div>
</div>


<div class="modal fade" id="change_log_transaction_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">修改事务</h4>
      </div>
      <div class="modal-body">

      <form class="form-horizontal">
        <fieldset>
          <div class="row correction-row-css">
              <label class="control-label col-xs-2" for="input01">来源</label>
              <div class="col-xs-5 correction-clear-col-xs-padding">
                <input id="change_log_transaction_modal_tableName" class="form-control" readonly></input>
              </div>
          </div>
          
          <div class="row correction-row-css form-inline">
            <div class="row correction-row-css" style="margin-top:20px">
              <div class="row correction-row-css form-inline">
                <div class="col-xs-offset-2 col-xs-2 text-center">
                  <div type="button" class="btn btn-default" id="change_log_modal_hour_up_btn"><span class="glyphicon glyphicon-chevron-up"></span></div>
                </div>
                <div class="col-xs-2 text-center">
                  <div type="button" class="btn btn-default" id="change_log_modal_minute_up_btn"><span class="glyphicon glyphicon-chevron-up"></span></div>
                </div>
              </div>
              

              <label class="control-label col-xs-2" for="input01">时间</label>
              <div class="row correction-row-css form-inline">
                <div class="col-xs-2 text-center"><strong style="font-size:20px" id="change_log_modal_hour">8</strong></div>
                <div class="col-xs-2 text-center"><strong style="font-size:20px" id="change_log_modal_minute">30</strong></div>
              </div>

              <div class="row correction-row-css form-inline ">
                <div class="col-xs-offset-2 col-xs-2 text-center ">
                  <div type="button" class="btn btn-default" id="change_log_modal_hour_down_btn"><span class="glyphicon glyphicon-chevron-down"></span></div>
                </div>
                <div class="col-xs-2 text-center">
                  <div type="button" class="btn btn-default" id="change_log_modal_minute_down_btn"><span class="glyphicon glyphicon-chevron-down"></span></div>
                </div>
              </div>
            </div>
          </div>

          <div id="change_transaction_content_row" class="row correction-row-css form-inline" style="margin-top:20px;position:relative;">
            <label class="control-label col-xs-2" for="input01">内容</label>
            <textarea  id="change_log_modal_content_input" type="text" class="col-xs-8"  style="width:260;overflow-y:visible;resize:none;font-size:15px;" rows="15" cols="54" ></textarea>
          </div>
          <div id="transaction_change_input_length" class="col-xs-2 control-label" style="position:absolute;right:0px;bottom:0px;text-align:left;">1000字</div>
        </fieldset>
      </form>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button id="change_log_modal_delete_btn" type="button" class="btn btn-danger" data-toggle="modal" data-target="#checkAction_Modal">删除</button>
        <button id="change_log_modal_change_btn" type="button" class="btn btn-primary">保存</button>
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
		   		<div id="create_inp_parent_changeNickName" class="control-group row ">
		          <label class="control-label col-xs-4" for="input01">您确定要删除该事务吗？</label>
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

