<?php
require '../models/Teacher.php';

$testId = $_GET['testId'];

$teacher = new Teacher();
$questions = $teacher->getQuestions($testId);

echo json_encode($questions);
