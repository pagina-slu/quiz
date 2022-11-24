<?php
require '../models/Teacher.php';

$testId = $_GET['testId'];

$teacher = new Teacher();
$questions = $teacher->getSchedules($testId);

echo json_encode($questions);
