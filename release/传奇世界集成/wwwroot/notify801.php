<?php

session_start();
date_default_timezone_set('PRC');

//充值系统签名等于out_sign
$outSign = 'MIIBIjANBgkqhkiG';

// ip 账号 密码 账号库名
$db = array('127.0.0.1','longwen','KA5a5JX8fDGNx43H','longwen','/data/sbin/logs/TLog/Tlog.801.0_');

//验证
$sign = $_SERVER['HTTP_SIGN'];

//分区ID
$appId = isset($_REQUEST['appId']) ? $_REQUEST['appId']:'';

//用户ID （账户）
$userId = isset($_REQUEST['userId']) ? $_REQUEST['userId']:'';

//用户名称（角色名称）
$userName = isset($_REQUEST['userName']) ? $_REQUEST['userName']:'';

//订单号
$outTradeNo = isset($_REQUEST['outTradeNo']) ? $_REQUEST['outTradeNo']:'';

//总金额
$totalAmount = isset($_REQUEST['totalAmount']) ? $_REQUEST['totalAmount']:'0';

//支付渠道
$payChannel = isset($_REQUEST['payChannel']) ? $_REQUEST['payChannel'] :"未知渠道";

$text = $outSign.$appId.$userId.$outTradeNo.$totalAmount;
$md5 = md5($text);

if($md5 == $sign){
    
    $so8=so8($db[0],$db[1],$db[2],$db[4]);
    
    //充值比例  5元=5000元宝
    $gameCurrency = $totalAmount * 1000;
    
    $payCodeEntity='222222-'.$gameCurrency.'-0;';
    
    $sql="SELECT `RoleID` FROM player WHERE `Name`='$userName'";
    
    $result=mysql_query($sql,$so8);
    
    if($result&&mysql_num_rows($result)>0){
        
        $dN = mysql_fetch_array($result,MYSQL_NUM);
        
        $roleId = $dN[0];
        
        echo "\n角色ID:" .$roleId;
        
        $it0=explode(';',rtrim($payCodeEntity,';'));
        $it='';
        foreach($it0 as $it1){
            
            $it2 = explode('-',$it1);
            
            $t = $userName.'｜充值｜元宝｜'.$outTradeNo;
            
            echo "\n描述:" .$t;
     
            $sql1="SELECT `a1` FROM paylog WHERE `a2`='$t'";
            
            $result1 = mysql_query($sql1,$so8);
            if($result1 && mysql_num_rows($result1)>0){
                echo '订单已存在';
                exit;
            }
            
            $it1=item($it2[0]);
            $it3=str_pad(itemnum($it2[1],$it2[2]),2,'0',STR_PAD_LEFT);
            $it2=item($it2[1]);
            
            echo "\n插入数据到paylog表\n";
            
            mysql_query("INSERT INTO `paylog` (`order_id`,`role_id`,`title`, `description`, `num`) VALUES ('$outTradeNo','$roleId','$payChannel','$totalAmount','$gameCurrency')");
            
            $it='52'.$it3.'08'.$it1.'10'.$it2.'2801'.$it;
        }
        
        $it1='3018'.$it;
        
        echo "发放Email\n";
        
        mysql_query("INSERT INTO `email` (`roleID`, `emailIndex`, `datas`) VALUES ('$roleId',CONCAT('00',HEX(UNIX_TIMESTAMP()),'43820C'), CAST(UNHEX('$it1') AS CHAR))") or die(mysql_error());
        
        
        echo "success";
        exit;
    }else{
        echo "角色 not found";
    }
}else{
    echo "sign error:" . $md5;
    echo "\n";
    echo "sign error:" . $sign;
}

function sign($data,$key) {
    ksort($data);
    $sign = strtoupper(md5(urldecode(http_build_query($data)).'&key='.$key));
    return $sign;
}

function so8($a,$b,$c,$d){
    $so8 = @mysql_pconnect($a,$b,$c);
    mysql_query("set names latin1"); 
    mysql_select_db($d, $so8);
    return $so8;
}
function c86($a){return intval(floor($a/128));}
function b86($a,$b){return $a%128+$b;}
function item($a){
	$a1='';
	$a2='';
	$a3='';
	$a4='';
	if($a>=128){
        $a1=c86($a);
        $a0=b86($a,128);
        if($a1>=128){$a2=c86($a1);$a1=b86($a1,128);}else{$a2='';}
        if($a2>=128){$a3=c86($a2);$a2=b86($a2,128);}else{$a3='';}
        if($a3>=128){$a4=c86($a3);$a3=b86($a3,128);}else{$a4='';}
	}else{
        $a2='';$a1=$a%128;$a0='';
    }
	$b='';
	if($a4!=''){$b=pack('c', $a4);}
	if($a3!=''){$b=pack('c', $a3).$b;}
	if($a2!=''){$b=pack('c', $a2).$b;}
	if($a1!=''){$b=pack('c', $a1).$b;}
	if($a0!=''){$b=pack('c', $a0).$b;}
	return bin2hex($b);
}
function itemnum($a,$b){
	if($a>=128){
        $aa=7+$b;
        $a1=c86($a);
        $a0=b86($a,128);
        if($a1>=128){$a2=c86($a1);$a1=b86($a1,128);$aa=8+$b;}else{$a2='';}
        if($a2>=128){$a3=c86($a2);$a2=b86($a2,128);$aa=9+$b;}else{$a3='';}
        if($a3>=128){$a4=c86($a3);$a3=b86($a3,128);$aa=10+$b;}else{$a4='';}
	}else{
        $aa=6+$b;
    }
	return dechex($aa);
}
?>