<?php
require '../models/Teacher.php';
$teacher = new Teacher();
$classes = $teacher->getAllClasses();

echo json_encode($classes);
