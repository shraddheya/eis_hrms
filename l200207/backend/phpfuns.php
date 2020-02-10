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

if ($mode === "LOGIN") {
  if (session_status() === PHP_SESSION_NONE) session_start();
  $link = mysqli_connect('db', 'root', 'ic@0001');
  $data['email'] = strtolower($data['email']);
  if ($data["email"] === "demo@edeitic.com") {
    if ($data["password"] !== "demo@edeitic.com") exit('failure' . 'pelase enter the right password: demo@edeitic.com');
    $usrID = "" . $timeNow . str_replace('.', '', getCLIP());
    // $usrPSS= strtoupper(md5($usrID));
    $DBnm = "eis_hrms_$usrID";
    $_SESSION["demoUsrID"] = $usrID;
    $_SESSION["user"] = array('prid' => 1560156094488);
    $_SESSION["DBnm"] = $DBnm;
    // print_r("\nDBnm : $DBnm\n</br>");
    // print_r("\nsession_save_path : ", session_save_path());
    // print_r("\nsession_save_path : ", realpath(dirname($_SERVER['DOCUMENT_ROOT']) . '/../session'));
    clearDemoDBs($link);
    $stmtCheckTableList = $link->prepare("SELECT `table_name` FROM `information_schema`.`tables` WHERE `table_schema` = 'eis_hrms_0demo';");
    $stmtCheckTableList->execute();
    if ($stmtCheckTableList->error) exit(' Failure');
    $stmtCheckTableListR = $stmtCheckTableList->get_result();
    $createDBQ = "CREATE DATABASE IF NOT EXISTS `$DBnm`;";
    while ($tblNm = $stmtCheckTableListR->fetch_array(MYSQLI_NUM)) $createDBQ = $createDBQ . "\nCREATE TABLE IF NOT EXISTS `$DBnm`.`$tblNm[0]` AS SELECT * FROM `eis_hrms_0demo`.`$tblNm[0]`;";
    $link->multi_query($createDBQ);
  } else {
    $_SESSION["demoUsrID"] = null;
    $_SESSION["email"] = $data['email'];
    // $_SESSION["user"] = array('prid' => 1560156094488 );

    // $_SESSION["DBnm"] = null;
  }
  mysqli_close($link);


  $link = mysqli_connect('db', 'root', 'ic@0001', $DBnm);
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
  $permissions  = bindec($user[0]['permissions']);
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
  while (true) {
    $userinConsideration = $retArray[$idx];
    $selects = "u.prid as `id`, u.title, u.fname, u.mname, u.lname, u.email as `mail`, u.post, c.prid2 as boss";
    if ($permissions & 0b0001) $selects  .= ", u.contactno"
      . ", c.connection";
    if ($permissions & 0b0010) $selects  .= ", u.address_c_houseno"
      . ", u.address_c_area"
      . ", u.address_c_city"
      . ", u.address_c_state"
      . ", u.address_c_country"
      . ", u.address_c_pincode"
      . ", u.address_p_houseno"
      . ", u.createdAt"
      . ", u.address_p_area"
      . ", u.address_p_city"
      . ", u.address_p_state"
      . ", u.address_p_country"
      . ", u.address_p_pincode"
      . ", u.picture";
    if ($permissions & 0b0100) $selects  .= ", u.current_salary";
    if ($permissions & 0b1000) $selects .= ", u.projects";
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
} else {
  if (session_status() == PHP_SESSION_NONE) session_start();
  print_r("session : " . json_encode($_SESSION) . "\n");
  $link = mysqli_connect('db', 'root', 'ic@0001', $_SESSION["DBnm"]);
}

if ($mode === "REGISTER") { // Add Users Who have Permissions
  $stmt = $link->prepare("INSERT into users(prid,title,fname,mname,lname,email,contactno,post,address_c_houseno,address_c_area,address_c_city,address_c_state,address_c_country,address_c_pincode,address_p_houseno,address_p_area,address_p_city,address_p_state,address_p_country,address_p_pincode) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
  $stmt->bind_param('issssssisssssisssssi', $data['prid'], $data["title"], $data["fname"], $data["mname"], $data["lname"], $data["email"], $data["contactno"], $data['post'], $data["address_c_houseno"], $data["address_c_area"], $data["address_c_city"], $data["address_c_state"], $data["address_c_country"], $data["address_c_pincode"], $data["address_p_houseno"], $data["address_p_area"], $data["address_p_city"], $data["address_p_state"], $data["address_p_country"], $data["address_p_pincode"]);
  $stmt->execute();
  if ($stmt->error) exit($stmt->error . " failure ");
  $stmtc = $link->prepare("INSERT INTO connections(prid1,prid2,connection)VALUES(?,?,'Boss')");
  $stmtc->bind_param('ii', $data['prid'], $data['boss']);
  $stmtc->execute();
  $newcon = $stmtc->insert_id;
  if ($stmtc->error) exit($stmtc->error . ' Failure');
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "SALARYSLIP") { // Select Salart
  $stmt = $link->prepare("SELECT prid,basic_salary,pf,medical,ta,da,hra,overtime,prepared_by,check_by,authorised_by,telephone_internet,bonus,house_rent,other FROM salaries where prid = ?");
  $stmt->bind_param("i", $data['prid']);
  $stmt->execute();
  $res = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  print_r($res);
  if ($stmt->error) exit($stmt->error.' Failure');
  print_r($mode . " success" . json_encode($res));
  exit();
}

if ($mode === "UPDATE_USERS") { // Users Can Be Updates
  $ql = $link->prepare("UPDATE users set title=?,fname=?,mname=?,lname=?,email=?,contactno=?,address_c_houseno=?,address_c_area=?,address_c_city=?,address_c_state=?,address_c_country=?,address_c_pincode=?, address_p_houseno=?,address_p_area=?,address_p_city=?,address_p_state=?,address_p_country=?,address_p_pincode=? WHERE prid =?");
  $ql->bind_param("sssssssssssisssssii", $data['title'], $data['fname'], $data['mname'], $data['lname'], $data['email'], $data['contactno'], $data['address_c_houseno'], $data['address_c_area'], $data['address_c_city'], $data['address_c_state'], $data['address_c_country'], $data['address_c_pincode'], $data['address_p_houseno'], $data['address_p_area'], $data['address_p_city'], $data['address_p_state'], $data['address_p_country'], $data['address_p_pincode'], $data['id']);
  $ql->execute();
  $idnew = $ql->insert_id;
  if ($ql->error) exit(' failure');
  $stmt = $link->prepare("SELECT * FROM users where id = $idnew");
  $stmt->execute();
  $newUsr = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  if ($stmt->error) exit(' failure');
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "NOTIFICATION") { // Send Notification Who LoggedIn
  $stmt = $link->prepare("SELECT id,`when`,why,what,whom FROM `notifications` WHERE whom = ?");
  $stmt->bind_param("i", $data['whom']);
  $stmt->execute();
  $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  if ($stmt->error) exit($stmt->error.' failure');
  print_r($mode . " success" . json_encode($result));
  exit;
}

if ($mode === "ACCESSLEVELS_ADD"){
  // $permissions 
  $stmt = $link->prepare("INSERT INTO accesslevels(`name`,`inid`,`outid`)VALUES(?,?,?)");
  $stmt->bind_param("sss", $data['name'], $data['inid'], $data['outid']);
  $stmt->execute();
  if($stmt->error) exit($stmt->error.' Failure');
  $stmtR = $link->prepare("SELECT id,`name`,inid,outid FROM accesslevels WHERE id=(LAST_INSERT_ID())");
  $stmtR->execute();
  $getdata = $stmtR->get_result()->fetch_all(MYSQLI_ASSOC);
  print_r($mode . " success". json_encode($getdata));
  exit();
}

if($mode === "ACCESSLEVELS_ALLOT"){
  $stmt = $link->prepare("UPDATE users SET access_levels = ? where prid = ?");
  $stmt->bind_param("si", $data['access_levels'], $data['prid']);
  $stmt->execute();
  if($stmt->error) exit($stmt->error."Failure");
  print_r($mode . " success".json_encode($data));
  exit();
}

