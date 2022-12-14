<?php
require '../models/Teacher.php';

$testId = $_GET['testId'];

$teacher = new Teacher();

echo json_encode($teacher->getAverageScore($testId));
