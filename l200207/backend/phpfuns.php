<?php
include_once './preqsts.php';
$link;
$DBnm;
$mode = filter_input(INPUT_GET, "mode");
$data = filter_input(INPUT_GET, "data");
if (isset($mode)) {
  if (($mode !== "ALLOT_CARD") && ($mode !== "REG_ATT")) four04("Not Allowed");
} else {
  $mode = rtrim(filter_input(INPUT_POST, 'mode'), ',');
  $data = json_decode(filter_input(INPUT_POST, "data"), true);
}

#region login special case
if ($mode === "LOGIN") {
  if (session_status() === PHP_SESSION_NONE) session_start();
  $dbcreds = (object)$dbC['root'];
  $dbcredD = isset($dbC['demo']) ? (object)$dbC['demo'] : $dbcreds;
  // print_r(json_encode($dbcreds->host));echo "\n";
  // print_r(json_encode($dbcreds->username));echo "\n";
  // print_r(json_encode($dbcreds->password));echo "\n";
  $link = mysqli_connect($dbcreds->host, $dbcreds->username, $dbcreds->password);
  $data['email'] = strtolower($data['email']);
  if ($data["email"] === "demo@edeitic.com") {
    if ($data["password"] !== "demo@edeitic.com") exit('failure' . 'pelase enter the right password: demo@edeitic.com');
    $usrID = "" . $timeNow . str_replace('.', '', getCLIP());
    $DBnm = "eis_hrms_$usrID";
    $_SESSION["demoUsrID"] = $usrID;
    $_SESSION["user"] = array('prid' => 1560156094488); // set prid of master in demo database
    $_SESSION["DB"]["nm"] = $DBnm;
    $_SESSION["DB"]["host"] = $dbcredD->host;
    $_SESSION["DB"]["username"] = $dbcredD->username;
    $_SESSION["DB"]["password"] = $dbcredD->password;

    clearDemoDBs($link);
    $stmtCheckTableList = $link->prepare("SELECT `table_name` FROM `information_schema`.`tables` WHERE `table_schema` = 'eis_hrms_0demo';");
    $stmtCheckTableList->execute();
    if ($stmtCheckTableList->error) exit(' Failure');
    $stmtCheckTableListR = $stmtCheckTableList->get_result();
    $createDBQ = "CREATE DATABASE IF NOT EXISTS `$DBnm`;";
    while ($tblNm = $stmtCheckTableListR->fetch_array(MYSQLI_NUM)) $createDBQ = $createDBQ . "\nCREATE TABLE IF NOT EXISTS `$DBnm`.`$tblNm[0]` LIKE `eis_hrms_0demo`.`$tblNm[0]`; INSERT INTO `$DBnm`.`$tblNm[0]` SELECT * FROM eis_hrms_0demo.`$tblNm[0]`;";
    $link->multi_query($createDBQ);
  } else {
    $_SESSION["demoUsrID"] = null;
    $_SESSION["email"] = $data['email'];
    // $_SESSION["user"] = array('prid' => 1560156094488 );

    // $_SESSION["DBnm"] = null;
  }
  mysqli_close($link);
  exit($mode . 'success');
} else {
  if (session_status() === PHP_SESSION_NONE) session_start();
  if (!isset($_SESSION['user'])) {
    echo($mode . 'failure' . 'NOTLOGGEDIN');
    $mode = 'LOGOUT';
  }
}
#endregion

if ($mode === "GETINITDATA") {
  $dbcreds = (object)$_SESSION['DB'];
  $link = mysqli_connect($dbcreds->host, $dbcreds->username, $dbcreds->password, $dbcreds->nm);
  if ($link->error) exit('error : ' . json_encode($link->error));
  $pridUsrMain = $_SESSION["user"]["prid"];
  $retArray = [];
  $UsrData  = [];
  $stmt     = $link->prepare("SELECT prid as `id`, title, fname, mname, lname, email as 'mail', post, contactno, `permissions`,
                                    address_c_houseno, address_c_area, address_c_city, address_c_state, address_c_country, address_c_pincode,
                                    address_p_houseno, address_p_area, address_p_city, address_p_state, address_p_country, address_p_pincode,current_salary,picture,createdAt
                              FROM `users` where `prid` = ?");
  $stmt->bind_param("s", $pridUsrMain);
  $stmt->execute();
  $user     = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  $stmt->close();
  // print_r('success : '.json_encode($user));
  if (!$user) exit('failure wrong credentials!');
  $permissions  = $user[0]['permissions'];
  // $permissions  = 0b0011; // Hardcode -- permisssions for show address
  $retArray     = array_merge($retArray, $user);
  $idx          = 0;
  // Getting list of posts
  $stmt = $link->prepare("SELECT id, post as `name`, boss FROM posts");
  $stmt->execute();
  $UsrData["posts"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  $stmt->close();
  //Getting list of accesslevels
  $stmt = $link->prepare("SELECT id,`name` FROM accesslevels");
  $stmt->execute();
  $UsrData["accesslevels"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  $stmt->close();
  // Getting list of Subordinates and connections
  // print_r(json_encode($UsrData)."\n".$permissions."\n".bindec($permissions)."\n");
  // exit();
  $selects = "u.prid as `id`, u.title, u.fname, u.mname, u.lname, u.email as `mail`, u.post, c.prid2 as boss, u.picture";
  if ($permissions & 0b00000100) $selects  .= ""
    . ", u.contactno"
    . ", c.connection"
    . ", u.address_c_houseno"
    . ", u.address_c_area"
    . ", u.address_c_city"
    . ", u.address_c_state"
    . ", u.address_c_country"
    . ", u.address_c_pincode"
    . ", u.address_p_houseno"
    . ", u.address_p_area"
    . ", u.address_p_city"
    . ", u.address_p_state"
    . ", u.address_p_country"
    . ", u.address_p_pincode";
  if ($permissions & 0b00010000) $selects  .= ""
    . ", u.access_levels"
    . ", u.services"
    . ", u.permissions"
    . ", u.documents_accesslevels"
    . ", u.leaves"
    . ", u.current_salary";

    print_r($selects);echo("\n");
    while (true) {
    $userinConsideration = $retArray[$idx];
    $stmtN = $link->prepare("SELECT $selects FROM users as u, connections as c WHERE u.prid = c.prid1 AND c.prid2 = ?");
    $stmtN->bind_param("i", $userinConsideration["id"]);
    $stmtN->execute();
    $resultN = $stmtN->get_result()->fetch_all(MYSQLI_ASSOC);
    if ($resultN) $retArray = array_merge($retArray, $resultN);
    $stmtN->close();
    if (++$idx >= sizeof($retArray)) break;
    break;
  }
  mysqli_close($link);
  // session_start();
  $UsrData['users']     = $retArray;
  // print_r(json_encode());
  $_SESSION['userData'] = $UsrData['users'];
  print_r("session : " . json_encode($_SESSION) . "\n");
  exit($mode . "success" . json_encode($UsrData));
} 

if ($mode === "ISLOGGEDIN") { // Check Is-Login-?
  if (isset($_SESSION['userData'])) exit($mode . "success");// . json_encode($_SESSION['userData']));
  exit($mode . 'failure');
  // print_r($mode . "success" . json_encode($_SESSION['userData']));
  // exit();
}