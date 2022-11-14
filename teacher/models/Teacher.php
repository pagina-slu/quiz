<?php
require_once $GLOBALS['root'].'/models/Class.php';
require_once $GLOBALS['root'].'/models/Question.php';
class Teacher {
    private $conn;
    function __construct() {
        require_once $GLOBALS['root'].'/config/db.php';
        $this -> conn = open_connection();
    }

    // CRUD Operations
    public function getAllClasses() {
        $query = "SELECT * FROM classes";
        $result = $this -> conn -> query($query);
        $classes = array();

        while ($row = $result -> fetch_assoc()) {
            $class = new _Class();
            $class->classDescription = $row['class_description'];
            $class->classCode = $row['class_code'];
            $class->students = "";
            array_push($classes, $class);
        }

        return $classes;
    }

    public function getQuestions($classCode) {
        $query = "SELECT * FROM questions WHERE class_code = " . $classCode;
        $result = $this -> conn -> query($query);
        $questions = array();

        while ($row = $result -> fetch_assoc()) {
            $question = new Question();
            $question->questionID = $row['question_id'];
            $question->questionType = $row['question_type'];
            $question->answers = "";
            $question->choices = "";
            $question->points = 1;
            array_push($questions, $question);
        }

        return $questions;
    }
}