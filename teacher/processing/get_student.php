<?php
require '../models/Teacher.php';

$studentID = $_GET['studentID'];

$teacher = new Teacher();
$student = $teacher->getStudent($studentID);

echo json_encode($student);
