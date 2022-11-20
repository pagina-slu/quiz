<?php
if (!isset($_SESSION)) {
    session_start();
}
$_SESSION['test-id'] = $_POST['test-id'];
$_SESSION['test-name'] = $_POST['test-name'];
