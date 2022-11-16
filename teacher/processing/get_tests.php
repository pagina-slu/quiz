<?php
require '../models/Teacher.php';

$classCode = $_GET['classCode'];

$teacher = new Teacher();
$tests = $teacher->getTests($classCode);

echo json_encode($tests);
