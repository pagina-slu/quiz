<?php

require_once '../controllers/TeacherController.php';
session_start();
$classCode = $_GET['classCode'];

$teacherController = new TeacherController();
$teacherController -> getQuestions($classCode);

echo $_SESSION['questions'];