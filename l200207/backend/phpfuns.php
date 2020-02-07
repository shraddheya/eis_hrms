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
  session_start();
  $link = mysqli_connect('db', 'root', 'ic@0001');
  if ($data["email"] === "demo@edeitic.com"){
    if ($data["password"] !== "demo@edeitic.com") exit('failure'.'pelase enter the right password: demo@edeitic.com');
    $usrID = "".$timeNow.str_replace('.', '', getCLIP());
    // $usrPSS= strtoupper(md5($usrID));
    $DBnm = "eis_hrms_$usrID";
    $_SESSION["demoUsrID"] = $usrID;
    $_SESSION["user"] = array('prid' => 1560156094488 );
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
    while($tblNm = $stmtCheckTableListR->fetch_array(MYSQLI_NUM)) $createDBQ = $createDBQ."\nCREATE TABLE IF NOT EXISTS `$DBnm`.`$tblNm[0]` AS SELECT * FROM `eis_hrms_0demo`.`$tblNm[0]`;";
    $link->multi_query($createDBQ);
    mysqli_close($link);
    print_r($timeNow);
  } else {
    $_SESSION["demoUsrID"] = null;
  }
  $link = mysqli_connect('db', 'root', 'ic@0001', $DBnm);
  $stmt     = $link->prepare("SELECT prid as `id`, title, fname, mname, lname, email as 'mail', post, contactno, `permissions`,
                                  address_c_houseno, address_c_area, address_c_city, address_c_state, address_c_country, address_c_pincode,
                                  address_p_houseno, address_p_area, address_p_city, address_p_state, address_p_country, address_p_pincode,current_salary,picture,createdAt
                              FROM `users` where `prid` = ?");
  $stmt->bind_param("s", $_SESSION["user"]["prid"]);
  $stmt->execute();
  $user     = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  $stmt->close();
  if (!$user) exit('failure wrong credentials!');
  // $permissions  = $user['permissions'];
  $permissions  = 0b0011; // Hardcode -- permisssions for show address
  $retArray     = array_merge($retArray, $user);
  $idx          = 0;
  // Getting list of posts
  $stmt = $link->prepare("SELECT id, post as `name`, boss FROM __master_posts");
  $stmt->execute();
  $UsrData["posts"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  $stmt->close();
  //Getting list of accesslevels
  $stmt = $link->prepare("SELECT id,`name` FROM __master_accesslevels");
  $stmt->execute();
  $UsrData["accesslevels"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  $stmt->close();
  // Getting list of Subordinates and connections
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
    $stmtN = $link->prepare("SELECT $selects FROM __master_users as u, __master_connections as c WHERE u.prid = c.prid1 AND c.prid2 = ?");
    $stmtN->bind_param("i", $userinConsideration["id"]);
    $stmtN->execute();
    $resultN = $stmtN->get_result()->fetch_all(MYSQLI_ASSOC);
    if ($resultN) $retArray = array_merge($retArray, $resultN);
    $stmtN->close();
    if (++$idx >= sizeof($retArray)) break;
  }
  mysqli_close($link);
  // session_start();
  $UsrData['users']     = $retArray;
  $UsrData['keyversion'] = $key;
  // print_r(json_encode());
  $_SESSION['userData'] = $UsrData['users'];
  print_r(json_encode($_SESSION['userData']));
  exit($mode . "success" . json_encode($UsrData));
}

if ($mode === "ISLOGGEDIN") { // Check Is-Login-?

  if(isset($_SESSION['userData'])) exit($mode."success".json_encode($_SESSION['userData']));
  exit($mode.'success'.json_encode('IS LOGGED IN'));
  // print_r($mode . "success" . json_encode($_SESSION['userData']));
  // exit();
}

if ($mode === "LOGOUT") { // Users Logout Mode
  unset($_SESSION['userData']);
  session_unset();
  session_destroy();
  exit($mode . 'success' . json_encode('LOGGED OUT'));
}

if ($mode === "NEWUSERS") {
  $stmt = $link->prepare("SELECT `password` FROM __master_users WHERE email =?");
  $stmt->bind_param("s", $data['email']);
  $stmt->execute();
  $newus = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  exit($mode . 'success' . json_encode($newus));
}

if ($mode === "GENRATEPASSWORD") {
  $stmt = $link->prepare("UPDATE users SET `__master_password` = md5(?) WHERE email =?");
  $stmt->bind_param("ss", $data['password'], $data['email']);
  $stmt->execute();
  if ($stmt->error) exit($stmt->error);
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "NOTIFICATION") { // Send Notification Who LoggedIn
  if ($key == "demomode") {
    exit($mode . " success" . json_encode("Demo Version"));
  } else if ($key == "promode") {
    $stmt = $link->prepare("SELECT id,`when`,why,what,whom FROM `__master_notifications` WHERE whom = ?");
    $stmt->bind_param("i", $data['whom']);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    if ($stmt->error) exit(' failure');
    print_r($mode . " success" . json_encode($result));
    exit;
  }
}

if ($mode === "DELETE_NOTIFICATION") {
  $stmt = $link->prepare("DELETE FROM `__master_notifications` WHERE id =?");
  $stmt->bind_param("i", $data['id']);
  $stmt->execute();
  if ($stmt->error) exit(' failure');
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "POSTS_ADD") { // Add Post
  $stmt = $link->prepare("INSERT INTO __master_posts(post,boss)VALUES(?,?)");
  $stmt->bind_param("si", $data['post'], $data['boss']);
  $stmt->execute();
  if ($stmt->error) exit(' failure');
  $stmtR = $link->prepare("SELECT id,post,boss FROM __master_posts WHERE id=(LAST_INSERT_ID())");
  $stmtR->execute();
  $getdata = $stmtR->get_result()->fetch_all(MYSQLI_ASSOC);
  print_r($mode . " success" . json_encode($getdata));
  exit();
}

if ($mode === "POSTS_DLT") {
  $stmt = $link->prepare("DELETE FROM `__master_posts` WHERE id =?");
  $stmt->bind_param("i", $data['id']);
  $stmt->execute();
  if ($stmt->error) exit(' failure');
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "POST_MEMBERS") {
  $stmt = $link->prepare("SELECT u.prid,p.post,u.title,u.fname,u.lname FROM __master_users as u, __master_posts as p WHERE u.post = p.id AND u.post = ?");
  $stmt->bind_param("s", $data['post']);
  $stmt->execute();
  $res = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  if ($stmt->error) exit($stmt->error);
  print_r($mode . " success" . json_encode($res));
  exit();
}

if ($mode === "POST_ALLOT") {
  $stmt = $link->prepare("UPDATE __master_users SET post = ? WHERE prid =?");
  $stmt->bind_param("si", $data['post'], $data['prid']);
  $stmt->execute();
  if ($stmt->error) exit($stmt->error);
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "REGISTER") { // Add Users Who have Permissions
  if ($key == "demomode") {
    exit($mode . " success" . json_encode("Demo Version"));
  } elseif ($key == "promode") {
    $stmt = $link->prepare("INSERT into __master_users(prid,title,fname,mname,lname,email,contactno,post,address_c_houseno,address_c_area,address_c_city,address_c_state,address_c_country,address_c_pincode,address_p_houseno,address_p_area,address_p_city,address_p_state,address_p_country,address_p_pincode) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param(
      'issssssisssssisssssi',
      $data['prid'],
      $data["title"],
      $data["fname"],
      $data["mname"],
      $data["lname"],
      $data["email"],
      $data["contactno"],
      $data['post'],
      $data["address_c_houseno"],
      $data["address_c_area"],
      $data["address_c_city"],
      $data["address_c_state"],
      $data["address_c_country"],
      $data["address_c_pincode"],
      $data["address_p_houseno"],
      $data["address_p_area"],
      $data["address_p_city"],
      $data["address_p_state"],
      $data["address_p_country"],
      $data["address_p_pincode"]
    );
    $stmt->execute();
    if ($stmt->error) exit($stmt->error . " failure ");
    $stmtc = $link->prepare("INSERT INTO __msater_connections(prid1,prid2,connection)VALUES(?,?,'Boss')");
    $stmtc->bind_param('ii', $data['prid'], $data['boss']);
    $stmtc->execute();
    $newcon = $stmtc->insert_id;
    if ($stmtc->error) exit($stmtc->error . ' Failure');
    print_r($mode . " success" . json_encode($data));
    exit();
  }
}

if ($mode === "SERVICES_ADD") { // Add Services
  $stmt = $link->prepare("INSERT INTO __master_services(`name`)VALUES(?)");
  $stmt->bind_param("s", $data['name']);
  $stmt->execute();
  if ($stmt->error) exit(' Failure');
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "SERVICES_ALLOT") {
  $stmt = $link->prepare("UPDATE __master_users SET services = ? WHERE prid = ?");
  $stmt->bind_param("si", $data['services'], $data['prid']);
  $stmt->execute();
  if ($stmt->error) exit(' Failure');
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "SERVICES_DLT") { // Delete Services
  $stmt = $link->prepare("DELETE FROM __master_services where id =?");
  $stmt->bind_param("i", $data['id']);
  $stmt->execute();
  if ($stmt->error) exit(' Failure');
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "SERVICES_MEMBERS") {
  $stmt = $link->prepare("SELECT u.prid,u.title,u.fname,u.mname,u.lname,u.services FROM __master_users AS u, __master_services AS s WHERE s.id = u.services AND u.services = ?");
  $stmt->bind_param("s", $data['services']);
  $stmt->execute();
  $res = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  if ($stmt->error) exit(' Failure');
  print_r($mode . " success" . json_encode($res));
  exit();
}

if ($mode === "SALARY_ADD") {
  $stmt = $link->prepare("INSERT INTO __master_salaries(prid,basic_salary,pf,medical,ta,da,hra,overtime,prepared_by,check_by,authorised_by,telephone_internet,bonus,house_rent,other)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
  $stmt->bind_param("iiiiiiiiiiiiiii", $data['prid'], $data['basic_salary'], $data['pf'], $data['medical'], $data['ta'], $data['da'], $data['hra'], $data['overtime'], $data['prepared_by'], $data['check_by'], $data['authorised_by'], $data['telephone_internet'], $data['bonus'], $data['house_rent'], $data['other']);
  $stmt->execute();
  if ($stmt->error) exit(' Failure');
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "SALARY_DLT") {
  $stmt = $link->prepare("DELETE FROM __master_salaries WHERE prid =?");
  $stmt->bind_param('i', $data['prid']);
  $stmt->execute();
  if ($stmt->error) exit(' Failure');
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "SALARYSLIP") { // Select Salart
  if ($key == "demomode") {
    exit($mode . " success" . json_encode("Demo Version"));
  } elseif ($key == "promode") {
    $stmt = $link->prepare("SELECT prid,basic_salary,pf,medical,ta,da,hra,overtime,prepared_by,check_by,authorised_by,telephone_internet,bonus,house_rent,other FROM __master_salaries where prid = ?");
    $stmt->bind_param("i", $data['prid']);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    if ($stmt->error) exit(' Failure');
    print_r($mode . " success" . json_encode($res));
    exit();
  }
}

if ($mode === "SALARY_UPDT") { // Update Users Salaries
  $stmt = $link->prepare("UPDATE __master_salaries SET basic_salary = ?,pf = ?,medical = ?,ta = ?,da = ?,hra = ?,overtime = ?,prepared_by = ?,check_by = ?,authorised_by = ?,telephone_internet = ?,bonus = ?,house_rent = ?,other = ? where prid=?");
  $stmt->bind_param("iiiiiisiiiiiiii", $data['basic_salary'], $data['pf'], $data['medical'], $data['ta'], $data['da'], $data['hra'], $data['overtime'], $data['prepared_by'], $data['check_by'], $data['authorised_by'], $data['telephone_internet'], $data['bonus'], $data['house_rent'], $data['other'], $data['prid']);
  $stmt->execute();
  if ($stmt->error) exit(' Failure');
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "TRANSACTION") { // Add Transactions
  $stmt = $link->prepare("INSERT INTO __master_transactions(amount,`date`,receiver,sender) VALUES(?,?,?,?)");
  $stmt->bind_param("isii", $data['amount'], $data['date'], $data['receiver'], $data['sender']);
  $stmt->execute();
  if ($stmt->error) exit(' failure');
  print_r($mode . " success" . json_encode($data));
  exit();
}

if ($mode === "UPDATE_USERS") { // Users Can Be Updates
  if ($key == "demomode") {
    exit($mode . " success" . json_encode("Demo Version"));
  } elseif ($key == "promode") {
    $ql = $link->prepare("UPDATE __master_users set title=?,fname=?,mname=?,lname=?,email=?,contactno=?,address_c_houseno=?,address_c_area=?,address_c_city=?,address_c_state=?,address_c_country=?,address_c_pincode=?, address_p_houseno=?,address_p_area=?,address_p_city=?,address_p_state=?,address_p_country=?,address_p_pincode=? WHERE prid =?");
    $ql->bind_param("sssssssssssisssssii", $data['title'], $data['fname'], $data['mname'], $data['lname'], $data['email'], $data['contactno'], $data['address_c_houseno'], $data['address_c_area'], $data['address_c_city'], $data['address_c_state'], $data['address_c_country'], $data['address_c_pincode'], $data['address_p_houseno'], $data['address_p_area'], $data['address_p_city'], $data['address_p_state'], $data['address_p_country'], $data['address_p_pincode'], $data['id']);
    $ql->execute();
    $idnew = $ql->insert_id;
    if ($ql->error) exit(' failure');
    $stmt = $link->prepare("SELECT * FROM __master_users where id = $idnew");
    $stmt->execute();
    $newUsr = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    if ($stmt->error) exit(' failure');
    print_r($mode . " success" . json_encode($data));
    exit();
  }
}

if ($mode === "UPDATE_USERS") { // Users Can Be Updates
  // if($key == "demomode"){
  //   exit($mode." success".json_encode("Demo Version"));
  // }elseif($key == "promode"){
  $stmtu = $link->prepare("UPDATE __master_users set title=?,fname=?,mname=?,lname=?,email=?,contactno=?,address_c_houseno=?,address_c_area=?,address_c_city=?,address_c_state=?,address_c_country=?,address_c_pincode=?, address_p_houseno=?,address_p_area=?,address_p_city=?,address_p_state=?,address_p_country=?,address_p_pincode=? WHERE prid =?");
  $stmtu->bind_param("sssssssssssisssssii", $data['title'], $data['fname'], $data['mname'], $data['lname'], $data['email'], $data['contactno'], $data['address_c_houseno'], $data['address_c_area'], $data['address_c_city'], $data['address_c_state'], $data['address_c_country'], $data['address_c_pincode'], $data['address_p_houseno'], $data['address_p_area'], $data['address_p_city'], $data['address_p_state'], $data['address_p_country'], $data['address_p_pincode'], $data['id']);
  $stmtu->execute();
  // $idnew = $ql->insert_id;
  if ($stmtu->error) exit(' failure');
  print_r($data);
  exit();
  // $stmt = $link->prepare("SELECT * FROM users where id = $idnew");
  // $stmt->execute();
  // $newUsr = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  // if($stmt->error) exit(' failure');
  // print_r($mode ." success".json_encode($data));
  // exit();
  // }
}

if ($mode === "UPLOADPICTURE") { // Upload Profile Picture
  $stmt = $link->prepare("UPDATE __master_users SET picture=? WHERE prid =?");
  $data['picture'] = base64_encode($data['picture']);
  $stmt->bind_param("si", $data['picture'], $data['prid']);
  $stmt->execute();
  $bs = base64_decode($data['picture']);
  if ($stmt->error) exit(' failure');
  print_r($mode . " success" . json_encode($bs));
  exit();
}
// Attendance Coding ... Start

if ($mode === "CLEARASSOCIATION") { // Connect with UI
  if ($key == "demomode") {
    exit($mode . " success" . json_encode("Demo Version"));
  } elseif ($key == "promode") {
    $stmt = $link->prepare("DELETE FROM __master_dataallassociation WHERE tagdata = ?");
    $stmt->bind_param("s", $data['tagdata']);
    $stmt->execute();
    if ($stmt->error) exit('failure');
    print_r($mode . "success" . json_encode("success"));
    exit();
  }
}

if ($mode === "GETCARDID") { // Connect with UI
  $stmt = $link->prepare("SELECT device,tagid,tagdata FROM __master_dataallassociation WHERE tagdata = ?");
  $stmt->bind_param("s", $data['tagdata']);
  $stmt->execute();
  $resdt = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  $dtdl = count($resdt);
  if ($dtdl != 0) {
    $stmt = $link->prepare("SELECT device,tagid,tagdata FROM __master_dataallassociation WHERE tagdata = ?");
    $stmt->bind_param("s", $data['tagdata']);
    $stmt->execute();
    $resdt = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    if ($stmt->error) exit($stmt->error);
    print_r($mode . "success" . json_encode($resdt));
    exit();
  } elseif ($dtdl == 0) {
    $stmtI = $link->prepare("INSERT INTO __master_dataallassociation(tagdata) VALUES(?) ");
    $stmtI->bind_param("s", $data['tagdata']);
    $stmtI->execute();
    if ($stmtI->error) exit($stmtI->error);
    $stmtD = $link->prepare("SELECT tagid,device,tagdata FROM __master_dataallassociation ORDER BY tagdata DESC LIMIT 1");
    $stmtD->execute();
    $resD = $stmtD->get_result()->fetch_all(MYSQLI_ASSOC);
    if ($stmtD->error) exit("Something went wrong data not fetched");
    print_r($mode . "success" . json_encode($resD));
    exit();
  }
}

if ($mode === "ALLOT_CARD") { //http://5th1n62/HRMS-DESKTOP-APP/hardware.php?mode=REG_ATT&data=<tagIDxxxx>@@@<deviceIDxxxx>@@@in@@@<tagDATAxxxx>
  $data = explode('@@@', $data);
  $stmt     = $link->prepare("UPDATE __master_dataallassociation SET tagid =?, device = ? WHERE tagid = 0");
  $stmt->bind_param("si", $data[0], $data[1]);
  $stmt->execute();
  if ($stmt->error) exit('Data not insert');
  $stmtS = $link->prepare("SELECT tagdata FROM __master_dataallassociation ORDER BY tagdata DESC LIMIT 1;");
  $stmtS->bind_param("s", $data['tagdata']);
  $stmtS->execute();
  $ress = $stmtS->get_result()->fetch_all(MYSQLI_ASSOC);
  print_r($ress);
  exit();
}

if ($mode === "REG_ATT") { //http://5th1n62/HRMS-PROJ/back-end/phpfuns.php?mode=REG_ATT&data=<tagIDxxxx>@@@<deviceIDxxxx>@@@in@@@<tagDATAxxxx>
  $data = explode('@@@', $data);
  if (count($data) !== 4) four04("4 inputs required");
  $stmt     = $link->prepare("SELECT tagid FROM __master_dataallassociation WHERE tagid = ? AND tagdata = ?");
  $stmt->bind_param("ss", $data[0], $data[3]);
  $stmt->execute();
  $rows     = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  $stmt->close();
  if (!$rows) exit('False');
  $stmt     = $link->prepare("INSERT INTO __master_attendance (prid, mode, device) values (?, ?, ?)");
  $stmt->bind_param("isi", $data[3], $data[2], $data[1]);
  $stmt->execute();
  $stmt->close();
  exit('True');
}
// Attendance Coding ... Close

four04(' No Such Calling');

/* 
Remaining AJAX

"UPLOADPROFILEPICTURE"

*/
