<?php

$dur = array(
  'days' => 0,
  'hours' => 0,
  'minutes' => 5,
  'seconds' => 0,
);

$duration = ((($dur['days'] * 24 + $dur['hours']) * 60 + $dur['minutes']) * 60 + $dur['seconds'])*10000;
header('Access-Control-Allow-Origin:localhost');
// header ('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('session.save_path',realpath(dirname($_SERVER['DOCUMENT_ROOT']) . '/../session'));

date_default_timezone_set('UTC');

$timeNow = microtime(TRUE) * 10000;

function getCLIP(){
  return  getenv('HTTP_CLIENT_IP')?:
          getenv('HTTP_X_FORWARDED_FOR')?:
          getenv('HTTP_X_FORWARDED')?:
          getenv('HTTP_FORWARDED_FOR')?:
          getenv('HTTP_FORWARDED')?:
          getenv('REMOTE_ADDR');
}

function clearDemoDBs($link){
  global $duration, $timeNow;
  $stmtCheckDBList = $link->prepare("SHOW DATABASES;");
  $stmtCheckDBList->execute();
  if ($stmtCheckDBList->error) exit(' Failure');
  $stmtCheckDBListR = $stmtCheckDBList->get_result();
  $strDropDB  = "";
  while($dbnm = $stmtCheckDBListR->fetch_array(MYSQLI_NUM)) {
    $dbCreateTime = (float)substr($dbnm[0], 9, 14);
    // print_r("</br>\n".$dbCreateTime." : ".$timeNow." : ".($timeNow - $dbCreateTime)." : ".($dbCreateTime > 15000000000000 )." : ".( $timeNow - $dbCreateTime > $duration)." : ".($dbCreateTime > 15000000000000 && $timeNow - $dbCreateTime > $duration) );
    // print_r("</br>\n".( $timeNow - $dbCreateTime > $duration)." : ".($dbCreateTime > 15000000000000 && $timeNow - $dbCreateTime > $duration) );
    if($dbCreateTime > 15000000000000 && $timeNow - $dbCreateTime > $duration) $strDropDB = $strDropDB."DROP DATABASE IF EXISTS `$dbnm[0]`;\n";
  }
  // print_r("duration : $duration \n q : $strDropDB");
  $link->multi_query($strDropDB);
}

function four04($msg = "not found"){
  http_response_code(404);
  print_r($msg);
  // include('my_404.php'); // provide your own HTML for the error page
  die();
}

function p($m='msg',$msg){
  echo("\n");print_r("$m : ");print_r(json_encode($msg));echo("\n");
}



?>