<?php
require '../models/Teacher.php';

$classCode = $_GET['classCode'];

$teacher = new Teacher();
$questions = $teacher->getQuestions($classCode);

echo json_encode($questions);
