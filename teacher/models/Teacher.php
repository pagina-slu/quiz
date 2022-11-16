<?php
class Teacher
{
    private $conn;
    function __construct()
    {
        require '../config/db.php';
        $this->conn = open_connection();
    }

    // CRUD Operations
    public function getAllClasses()
    {
        $query = "SELECT * FROM classes";
        $result = $this->conn->query($query);
        $classes = array();

        while ($row = $result->fetch_assoc()) {
            $class = array('classDescription' => $row['class_description'], 'classCode' => ['class_code']);

            array_push($classes, $class);
        }
        return $classes;
    }

    public function getQuestions($classCode)
    {
        $query = "SELECT * FROM questions INNER JOIN tests ON questions.test_id = tests.test_id WHERE class_code = " . $classCode;
        $result = $this->conn->query($query);
        $questions = array();

        while ($row = $result->fetch_assoc()) {
            $question = array();
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

    public function getAllTests()
    {
        $query = "SELECT * FROM tests";
        $result = $this->conn->query($query);
        $tests = array();

        while ($row = $result->fetch_assoc()) {
            $test = array();
            $test['id'] = $row['test_id'];
            $test['name'] = $row['test_name'];
            $test['type'] = $row['test_type'];
            $test['classCode'] = $row['class_code'];
            array_push($tests, $test);
        }
        return $tests;
    }

    public function getClassDescription($classCode)
    {
        $query = "SELECT class_description FROM classes WHERE class_code = " . $classCode;
        $result = $this->conn->query($query);
        $classDescription = "";
        while ($row = $result->fetch_assoc()) {
            $classDescription = $row['class_description'];
        }
        return $classDescription;
    }

    public function getResponses()
    {
        $query = "SELECT * FROM responses";
        $result = $this->conn->query($query);
        $responses = array();
        while ($row = $result->fetch_assoc()) {
            $response = array();
            $response['id'] = $row['response_id'];
            $response['t_id'] = $row['test_id'];
            $response['username'] = $row['username'];
            $response['isChecked'] = $row['isChecked'];
            $response['timestamp'] = $row['timestamp'];
            array_push($responses, $response);
        }
        return $responses;
    }

    public function getResponseDetails()
    {
        $query = "SELECT * FROM response_details";
        $result = $this->conn->query($query);
        $responses = array();
        while ($row = $result->fetch_assoc()) {
            $response = array();
            $response['id'] = $row['response_id'];
            $response['q_id'] = $row['question_id'];
            $response['answer'] = $row['answer'];
            array_push($responses, $response);
        }
        return $responses;
    }
}
