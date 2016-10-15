<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head> 
	<title>MiniQ</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
	<meta name="language" content="en" />
    <meta property="qc:admins" content="1422662147651611631457" />
   
    <script type="text/javascript" src="http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js" data-appid="101305771" data-redirecturi="http://www.miniq.site/" charset="utf-8"></script>
<!--    <script type="text/javascript" src="http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js" charset="utf-8" data-callback="true"></script>
-->    
    <script language="javascript" type="text/javascript" src="<?php echo FRONT_OPEN_SOURCE_URL; ?>jquery/jquery-2.1.4.js"></script>
    <script language="javascript" type="text/javascript" src="<?php echo FRONT_OPEN_SOURCE_URL; ?>jquery/jquery.json-2.4.js"></script>
    <script language="javascript" type="text/javascript" src="<?php echo FRONT_OPEN_SOURCE_URL; ?>jquery/jquery.mousewheel.min.js"></script>
    <script language="javascript" type="text/javascript" src="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/bootstrap-3.3.5-dist/js/bootstrap.min.js" ></script>
    <script language="javascript" type="text/javascript" src="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.min.js" charset="UTF-8"></script>
    <script language="javascript" type="text/javascript" src="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/bootstrap-datetimepicker-master/js/locales/bootstrap-datetimepicker.zh-CN.js" charset="UTF-8"></script>
    <script language="javascript" type="text/javascript" src="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/bootstrap-datetimepicker-master/js/locales/bootstrap-datetimepicker.fr.js" charset="UTF-8"></script>
    
    <script language="javascript" type="text/javascript" src="<?php echo JS_URL; ?>internet/url/Url.js"></script> 
    <script language="javascript" type="text/javascript" src="<?php echo JS_URL; ?>internet/Internet.js"></script>
	<script language="javascript" type="text/javascript" src="<?php echo JS_URL; ?>uitool/loader/LoaderPiano.js"></script> 
    <script language="javascript" type="text/javascript" src="<?php echo JS_URL; ?>util/DataStructure.js"></script> 
	<script language="javascript" type="text/javascript" src="<?php echo JS_URL; ?>activity/Main.js"></script> 
    
    <!-- <link type="text/css" rel="stylesheet" href="<?php echo FRONT_OPEN_SOURCE_URL; ?>dialog/common.css"/> -->
    <link type="text/css" rel="stylesheet" href="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/bootstrap-3.3.5-dist/css/bootstrap.min.css"/>
    <link type="text/css" rel="stylesheet" href="<?php echo FRONT_OPEN_SOURCE_URL; ?>bootstrap/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.min.css"/>
    <link type="text/css" rel="stylesheet" href="<?php echo FRONT_OPEN_SOURCE_URL; ?>animate/animate.min.css"/>
    <link type="text/css" rel="stylesheet" href="<?php echo CSS_URL; ?>loader_piano.css"/>
    <link type="text/css" rel="stylesheet" href="<?php echo CSS_URL; ?>main.css"/>
</head>

<body text-align:center ">
    
    
<div class="row correction-row-css" style="background:rgb(33, 102, 140)">
    <div class="col-xs-offset-3 col-xs-1 text-center" style="font-size:24px;color:#FFFFFF;">MiniQueue</div>

    <div class="col-xs-offset-4 col-xs-4 text-left row form-inline" id="userInfo">
    	<a href="<?php echo SITE_URL;?>?r=Main/Main" class="btn btn-defualt white"><span class="glyphicon glyphicon-home"></span></a>
        <a id="nickName" type="button" href="<?php echo SITE_URL;?>?r=User/AccountSetting" data-toggle="tooltip" data-placement="bottom" title="加载中……" class="btn btn-defualt white"><span class="glyphicon glyphicon-user"></span></a>
        <a id="scheduleManagerBtn" href="<?php echo SITE_URL;?>?r=Main/ScheduleManager" data-toggle="tooltip" data-placement="bottom" title="表管理" class="btn btn-defualt white" ><span class="glyphicon glyphicon-th"></span></a>
    </div>  
</div>

<?php 
header("Content-Type:text/html;   charset=utf-8");
echo $content; 
?>


</body>
</html>
