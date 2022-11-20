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
    // CREATE
    public function createNewTest($data) {
        $query = $this->conn->prepare("INSERT INTO tests(test_name, test_type, class_code) VALUES(?, ?, ?)");
        $query->bind_param("sss", $data[0], $data[1], $data[2]);
        $query->execute();
    }

    public function createNewQuestion($data) {
        $query = $this->conn->prepare("INSERT INTO questions(test_id, question, question_type) VALUES(?, ?, ?)");
        $query->bind_param("iss", $data['test-id'], $data['question'], $data['question-type']);
        $query->execute();
        $last_id = $this->conn->insert_id;
        if (isset($data['choices'])) {
            $query = $this->conn->prepare("INSERT INTO question_choices(question_id, choice) VALUES (?, ?)");
            foreach ($data['choices'] as &$choice) {
                $query->bind_param("is", $last_id, $choice);
                $query->execute();
            }
        }
        if (isset($data['answer'])) {
            $query = $this->conn->prepare("INSERT INTO question_answers(question_id, answer) VALUES (?, ?)");
            $query->bind_param("is", $last_id, $data['answer']);
            $query->execute();
        }
    }

    public function createNewClass($data) {
        $query = $this->conn->prepare("INSERT INTO classes(class_code, class_description) VALUES (?, ?)");
        $query->bind_param("ss", $data['class-code'], $data['class-description']);
        $query->execute();
    }

    // READ
    public function getAllClasses()
    {
        $query = "SELECT * FROM classes";
        $result = $this->conn->query($query);
        $classes = array();

        while ($row = $result->fetch_assoc()) {
            $class = array('classDescription' => $row['class_description'], 'classCode' => $row['class_code']);

            array_push($classes, $class);
        }
        return $classes;
    }

    public function getQuestions($testId)
    {
        $query = "SELECT * FROM questions WHERE test_id = " . $testId;
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

    public function getTests($classCode) {
        $query = "SELECT * FROM tests WHERE class_code = " . $classCode;
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

    public function getAnswers($questionId) {
        
    }

    public function getChocies($questionId) {

    }
}
