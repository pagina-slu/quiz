<?php
require '../models/Teacher.php';

$testId = $_GET['testId'];

$teacher = new Teacher();
$responses = $teacher->getResponses($testId);

echo json_encode($responses);