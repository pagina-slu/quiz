<?php
require '../models/Teacher.php';

$teacher = new Teacher();
$test_id = $_GET['test_id'];

$points = $teacher->getTotalPoints($test_id);
echo json_encode($points);