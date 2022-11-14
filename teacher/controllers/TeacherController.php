<?php
session_start();
require_once 'models/Teacher.php';

class TeacherController {
    private $teacher;
    function __construct() {
        $teacher = new Teacher();
        $_SESSION['classes'] = json_encode($teacher -> getAllClasses());
    }

    function getQuestions($classCode) {
        $_SESSION['questions'] = json_encode($teacher -> getQuestions($classCode));
    }
}