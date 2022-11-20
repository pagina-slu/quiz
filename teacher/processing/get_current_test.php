<?php
if (!isset($_SESSION)) {
    session_start();
}
$data = array();
$data['testId'] = $_SESSION['test-id'];
$data['testName'] = $_SESSION['test-name'];

echo json_encode($data);