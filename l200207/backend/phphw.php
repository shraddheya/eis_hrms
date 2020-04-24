<?php

$mode = filter_input(INPUT_GET, "mode");
$data = filter_input(INPUT_GET, "data");
if (isset($mode)) {
  if (($mode !== "ALLOT_CARD") && ($mode !== "REG_ATT")) four04("Not Allowed");
} else {
  $mode = rtrim(filter_input(INPUT_POST, 'mode'), ',');
  $data = json_decode(filter_input(INPUT_POST, "data"), true);
}



// Attendance Coding ... Start

if ($mode === "CLEARASSOCIATION") { // Connect with UI
  $stmt = $link->prepare("DELETE FROM dataallassociation WHERE tagdata = ?");
  $stmt->bind_param("s", $data['tagdata']);
  $stmt->execute();
  if ($stmt->error) exit('failure');
  print_r($mode . "success" . json_encode("success"));
  exit();
}

if ($mode === "GETCARDID") { // Connect with UI
  $stmt = $link->prepare("SELECT device,tagid,tagdata FROM dataallassociation WHERE tagdata = ?");
  $stmt->bind_param("s", $data['tagdata']);
  $stmt->execute();
  $resdt = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  $dtdl = count($resdt);
  if ($dtdl != 0) {
    $stmt = $link->prepare("SELECT device,tagid,tagdata FROM dataallassociation WHERE tagdata = ?");
    $stmt->bind_param("s", $data['tagdata']);
    $stmt->execute();
    $resdt = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    if ($stmt->error) exit($stmt->error);
    print_r($mode . "success" . json_encode($resdt));
    exit();
  } elseif ($dtdl == 0) {
    $stmtI = $link->prepare("INSERT INTO dataallassociation(tagdata) VALUES(?) ");
    $stmtI->bind_param("s", $data['tagdata']);
    $stmtI->execute();
    if ($stmtI->error) exit($stmtI->error);
    $stmtD = $link->prepare("SELECT tagid,device,tagdata FROM dataallassociation ORDER BY tagdata DESC LIMIT 1");
    $stmtD->execute();
    $resD = $stmtD->get_result()->fetch_all(MYSQLI_ASSOC);
    if ($stmtD->error) exit("Something went wrong data not fetched");
    print_r($mode . "success" . json_encode($resD));
    exit();
  }
}

if ($mode === "REG_ATT") { //http://5th1n62/HRMS-PROJ/back-end/phpfuns.php?mode=REG_ATT&data=<tagIDxxxx>@@@<deviceIDxxxx>@@@in@@@<tagDATAxxxx>
  $data = explode('@@@', $data);
  if (count($data) != 4) four04("4 inputs required");
  $stmt     = $link->prepare("SELECT tagid FROM dataallassociation WHERE tagid = ? AND tagdata = ?");
  $stmt->bind_param("ss", $data[0], $data[3]);
  $stmt->execute();
  $rows     = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  if (!$rows) exit("=@Failure");
  $stmt     = $link->prepare("INSERT INTO attendance (prid, mode, device) values (?, ?, ?)");
  $stmt->bind_param("isi", $data[3], $data[2], $data[1]);
  $stmt->execute();
  $stmt->close();
  print_r("=@Success");
  exit();
}
