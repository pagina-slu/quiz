<?php
class Teacher {
    private $conn;
    function __construct() {
        require '../config/db.php';
        $this -> conn = open_connection();
    }

    // CRUD Operations
    public function getAllClasses() {
        $query = "SELECT * FROM classes";
        $result = $this -> conn -> query($query);
        $classes = array();

        while ($row = $result -> fetch_assoc()) {
            $class[] = array();

            $class["classDescription"] = $row['class_description'];
            $class["classCode"] = $row['class_code'];
            $class["students"] = "";
            array_push($classes, $class);
        }
        return $classes;
    }

    public function getQuestions($classCode) {
        $query = "SELECT * FROM questions INNER JOIN tests ON questions.test_id = tests.test_id WHERE class_code = " . $classCode;
        $result = $this -> conn -> query($query);
        $questions = array();

        while ($row = $result -> fetch_assoc()) {
            $question[] = array();
            $question["question"] = $row["question"];
            $question["id"] = $row['question_id'];
            $question["type"] = $row['question_type'];
            $question["answers"] = "";
            $question["choices"] = "";
            $question["points"] = 1;
            array_push($questions, $question);
        }
        return $questions;
    }
}