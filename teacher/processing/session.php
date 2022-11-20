<?php
if (!isset($_SESSION)) {
    session_start();
}
$_SESSION['class-code'] = $_POST['class-code'];
$_SESSION['class-description'] = $_POST['class-description'];

echo $_SESSION['class-code'];
