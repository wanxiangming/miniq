<script language="javascript" type="text/javascript" src="<?php echo JS_URL; ?>activity/user/account-setting/AccountSetting.js"></script>

<div class="container">
	<div class="col-xs-12 row" style="margin-top: 10px">
		<div class="col-xs-8">
			<form class="form-horizontal">
				<div class="row col-xs-12 form-group">
					<label class="control-label col-xs-2">账号ID</label>
					<div class="col-xs-8">
						<input type="text" class="form-control " placeholder=<?php echo $userInfoAry['id'];?> readonly>
					</div>
				</div>
				<div class="row col-xs-12 form-group">
					<label class="control-label col-xs-2">昵称</label>
					<div class="col-xs-8">
						<input id="user-name" type="text" class="form-control " maxlength="12" placeholder="1-12个字符长度" value=<?php echo $userInfoAry['nickName'];?>>
					</div>
					<div id="nickName-error-tip" class="col-xs-offset-2 col-xs-8 hide text-danger">昵称长度不能为0</div>
				</div>
				<!-- <div class="row col-xs-12 form-group">
					
				</div> -->
				<div class="row col-xs-12 form-group">
					<div class="col-xs-6 col-xs-offset-2">
						<div id="submit-btn" type="submit" class="btn btn-primary">提交</div>
						<div id="logout-btn" class="btn btn-danger">退出登陆</div>
					</div>
				</div>
			</form>
		</div>
		<div class="col-xs-4">
			<ul class="nav nav-pills nav-stacked" role="tablist">
				<li role="presentation" class="active"><a href="#">个人资料设置</a></li>
			</ul>
		</div>
	</div>
</div>


















