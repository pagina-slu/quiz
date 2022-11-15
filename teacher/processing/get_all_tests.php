<?php
require '../models/Teacher.php';
$teacher = new Teacher();
$tests = $teacher->getAllTests();

echo json_encode($tests);
