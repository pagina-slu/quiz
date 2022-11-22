<?php
require '../models/Teacher.php';

$questionId = $_GET['questionId'];

$teacher = new Teacher();
echo $teacher->deleteQuestion($questionId);

