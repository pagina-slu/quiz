<?php
require '../models/Teacher.php';

$teacher = new Teacher();
$data = array();
$data['class-code'] = $_POST['class-code'];
$data['class-description'] = $_POST['class-description'];
$teacher->createNewClass($data);