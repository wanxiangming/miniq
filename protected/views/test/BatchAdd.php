
<script language="javascript" type="text/javascript" src="<?php echo JS_URL; ?>activity/test/BatchAdd.js"></script>


<?php 
  include_once("protected/models/util/TableLink.php");
  include_once("protected/models/util/TableTableManagerGroup.php");
  include_once("protected/models/util/TableTable.php");
  include_once("protected/models/util/TableUser.php");

  $openId=Yii::app()->request->cookies['openId']->value;
  $tableUser=new TableUser($openId);
  $userInfo=$tableUser->getUserInfo();
  $userId=$userInfo['id'];

  $tableLink=new TableLink();
  $linkResult=$tableLink->getAllByUserId($openId);

  $tableTable=new TableTable();
  $tableManagerGroup=new TableTableManagerGroup();
?>

<div class="container clearfix" >
  <div class="row col-xs-offset-2 col-xs-8">
      <form class="form-horizontal">

        <div class="row col-xs-12" style="margin-top: 10px">
          <label class="control-label col-xs-2">起始时间点</label>
          <div class="col-xs-10">
            <input type="" name="" class="form-control" placeholder="2016-8-29" readonly>
          </div>
        </div>

        <div class="row col-xs-12" style="margin-top: 20px">
          <label class="control-label col-xs-2">表</label>
          <div class="col-xs-10">
            <select id="tableSelect" class="form-control">
              <?php 
                if($linkResult != NULL){
                  foreach ($linkResult as $key => $value) {
                    $tableResult=$tableTable->getById($value['tableId']);
                    if($tableResult['creatorId'] == $openId){
                      echo "<option value=".$value['tableId']." >".$tableResult['tableName']."</option>";
                    }
                    else if($tableManagerGroup->isManager($userId,$value['tableId'])){
                      echo "<option value=".$value['tableId']." >".$tableResult['tableName']."</option>";
                    }
                  }
                }
              ?>
            </select>
          </div>
        </div>

        <div class="row col-xs-12" style="margin-top: 20px">
          <label class="control-label col-xs-2">开始周</label>
          <div class="col-xs-10">
            <select id="beginWeek" class="form-control">
              <?php 
                for($i=1; $i<=18; $i++){
                  echo "<option value=".$i.">第".$i."周</option>";
                }
              ?>
            </select>
          </div>
        </div>

        <div class="row col-xs-12" style="margin-top: 20px">
          <label class="control-label col-xs-2">结束周</label>
          <div class="col-xs-10">
            <select id="endWeek" class="form-control">
              <?php 
                for($i=1; $i<=18; $i++){
                  echo "<option value=".$i.">第".$i."周</option>";
                }
              ?>
            </select>
          </div>
        </div>

        <div class="row col-xs-12" style="margin-top: 20px">
          <label class="control-label col-xs-2">时间</label>
          <div class="col-xs-10">
            <select id="weekdaySelect" class="form-control">
              <?php 
                  echo "<option value=1 >星期一</option>";
                  echo "<option value=2 >星期二</option>";
                  echo "<option value=3 >星期三</option>";
                  echo "<option value=4 >星期四</option>";
                  echo "<option value=5 >星期五</option>";
                  echo "<option value=6 >星期六</option>";
                  echo "<option value=7 >星期天</option>";
              ?>
            </select>
          </div>
          <div class="col-xs-offset-2 col-xs-5" style="margin-top: 8px">
            <select id="hourSelect" class="form-control">
              <?php 
                for ($i=0; $i < 24; $i++) { 
                  if($i == 8){
                    echo "<option value=$i selected=\"selected\">$i</option>";
                  }
                  else{
                    echo "<option value=$i >$i</option>";
                  }
                }
              ?>
            </select>
          </div>
          <div class="col-xs-5" style="margin-top: 8px">
            <select id="minuteSelect" class="form-control">
              <?php 
                for ($i=0; $i < 60; $i+=10) { 
                  if($i == 20){
                    echo "<option value=$i selected=\"selected\">$i</option>";
                  }
                  else{
                    echo "<option value=$i >$i</option>";
                  }
                }
              ?>
            </select>
          </div>
        </div>

        <div class="row col-xs-12" style="margin-top: 20px">
          <label class="control-label col-xs-2">内容</label>
          <div class="col-xs-10">
            <textarea id="contentInput" type="text" style="width:260;overflow-y:visible;resize:none;font-size:15px;" rows="15" cols="65" ></textarea>
          </div>
        </div>

        <div class="row col-xs-12" style="margin-top: 20px">
          <label class="control-label col-xs-2"></label>
          <div class="col-xs-10">
            <div id="submitBtn" class="btn btn-primary col-xs-2">提交</div>
            <div id="alertScope" class="col-xs-4"></div>
          </div>
        </div>

      </form>

       <!--  <div class="col-xs-1 dropdown">
          <button class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">工作日</button>
        </div> -->
  </div>
</div>

