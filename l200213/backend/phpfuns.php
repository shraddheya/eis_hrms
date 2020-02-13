<?php

$mode = rtrim(filter_input(INPUT_POST, 'mode'), ',');
$data = json_decode(filter_input(INPUT_POST, "data"), true);

if($mode === "GETDATA"){
    if (session_status() == PHP_SESSION_NONE) session_start();
}

