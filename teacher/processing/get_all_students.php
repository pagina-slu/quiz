<?php
require '../models/Teacher.php';
$teacher = new Teacher();
$student = $teacher->getAllStudents();

echo json_encode($student);
