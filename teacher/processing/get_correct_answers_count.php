<?php
require '../models/Teacher.php';

$questionId = $_GET['questionId'];

$teacher = new Teacher();

echo json_encode($teacher->getCorrectAnswersCount($questionId));
