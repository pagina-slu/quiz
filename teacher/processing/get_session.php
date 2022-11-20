<?php
if (!isset($_SESSION)) {
    session_start();
}
$data = array();
$data['classCode'] = $_SESSION['class-code'];
$data['classDescription'] = $_SESSION['class-description'];

echo json_encode($data);