<?php

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: localhost');
// header ('Access-Control-Expose-Headers: Set-Cookie');
// header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
// header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
error_reporting(E_ALL);
// ini_set('display_errors', 1);
// ini_set('session.save_path',realpath(dirname($_SERVER['DOCUMENT_ROOT']) . '/../session'));

date_default_timezone_set('UTC');

$mode = filter_input(INPUT_POST, 'mode');
$data = filter_input(INPUT_POST, "data");
if (session_status() == PHP_SESSION_NONE) session_start();
exit($mode.'\nsuccess\ndata:\n'.$data);