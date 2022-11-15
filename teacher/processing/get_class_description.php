<?php
require '../models/Teacher.php';

$classCode = $_GET['classCode'];

$teacher = new Teacher();
$classDescription = $teacher->getClassDescription($classCode);

echo json_encode($classDescription);
