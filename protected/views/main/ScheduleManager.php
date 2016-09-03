<script language="javascript" type="text/javascript" src="<?php echo JS_URL; ?>activity/main/ScheduleManager.js"></script>



<div class="container">
	<div class="row" style="margin-top:10px">
		<div class="span12 ">
			<div class="tabbable tabs-left" id="tabs-854197">
				<ul class="nav nav-tabs" data-tabs="tabs" role="tablist">
					<li class="active">
						<a href="#tab_search" data-toggle="tab">搜索</a>
					</li>
					<li >
						<a href="#tab_manage" data-toggle="tab">管理</a>
					</li>
				</ul>
				<div class="tab-content ">
					<div class="tab-pane fade in active" id="tab_search">
						<div class="row" style="padding-top:3%;">
							<div class="col-xs-offset-3 col-xs-6">
								<div class="row" >
						            <div class="col-xs-11 correction-clear-col-xs-padding">
						              <input  id="search_input" class="form-control" placeholder=""type="text">
						            </div>
						            <div class="col-xs-1 correction-clear-col-xs-padding">
						            	<button id="search_button" class="btn btn-defalt" style="font-size: 19px;"><span class="glyphicon glyphicon-search"></span></button>
						            </div>
								</div>
								<div class="row text-center">
									<div id="loaderScope" style="padding-top:10px"></div>
								</div>
                                <div id="search_result">
                                </div>
							</div>
							<div class="col-xs-3"></div>
						</div>
					</div>

					<div class="tab-pane fade in" id="tab_manage">
						<div class="row correction-row-css" id="tab_manage_firstRow">
							<button type="button" class="col-xs-1 pull-right btn btn-primary" data-toggle="modal" data-target="#create_modal">创建</button>
						</div>
						<div class="row correction-row-css" style="padding-top:10px;padding-bottom:10px;margin-top:5px;background-color:#F3F3F3;color:#A2A2A2">
							<div class="col-xs-1">ID</div>
							<div class="col-xs-2">日程名称</div>
							<div class="col-xs-2">状态</div>
                            <div class="col-xs-2">可见性</div>
							<div class="col-xs-offset-4 col-xs-1">操作</div>
						</div>
                        <div class="row correction-row-css">
                        	<div class="col-xs-12" style="background:#d0d5da"></div>
                        </div>
                        <div id="table_list">
                        	<div id="table_list_mine"></div>
                        	<div id="table_list_another"></div>
                        </div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="create_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">日程创建</h4>
      </div>
      <div class="modal-body">

		  <form class="form-horizontal">
		    <fieldset>
		   		<div id="create_inp_parent" class="control-group row ">
		          <label class="control-label col-xs-2" for="input01">日程名称</label>
		          <div class="controls col-xs-10">
		            <input id="log_name_inp" type="text" placeholder="1-12个字符长度！" class="input-xlarge form-control">
		          </div>
                  <input type="text" style="display:none" />
		        </div>
		    </fieldset>
		  </form>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button id="create_btn" type="button" class="btn btn-primary">创建</button>
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






