<?php
require '../models/Teacher.php';

$testId = $_GET['testId'];

$teacher = new Teacher();

echo $teacher->deleteResponses($testId);