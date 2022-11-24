<?php
require '../models/Teacher.php';

$testId = $_GET['testId'];

$teacher = new Teacher();
$schedules = $teacher->getSchedules($testId);

echo json_encode($schedules);
