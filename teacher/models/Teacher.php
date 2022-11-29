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
    public function createNewTest($data)
    {
        $query = $this->conn->prepare("INSERT INTO tests(test_name, test_type, class_code) VALUES(?, ?, ?)");
        $query->bind_param("sss", $data[0], $data[1], $data[2]);
        $query->execute();
    }

    public function createNewQuestion($data)
    {
        $query = $this->conn->prepare("INSERT INTO questions(test_id, question, question_type, points) VALUES(?, ?, ?, ?)");
        $query->bind_param("issi", $data['test-id'], $data['question'], $data['question-type'], $data['points']);
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

    public function createNewClass($data)
    {
        $query = $this->conn->prepare("INSERT INTO classes(class_code, class_description) VALUES (?, ?)");
        $query->bind_param("ss", $data['class-code'], $data['class-description']);
        $query->execute();
    }

    public function createNewSchedule($data) {
        $query = $this->conn->prepare("INSERT INTO schedules(test_id, open_date, close_date) VALUES (?, ?, ?)");
        $query->bind_param("iss", $data['test-id'], $data['open-date'], $data['close-date']);
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
            $question["points"] = $row['points'];
            $question["answer"] = $this->getAnswers($question["id"]);
            if ($question["type"] == "multiple-choice") {
                $question["choices"] = $this->getChoices($question["id"]);
            }
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

    public function getTests($classCode)
    {
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

    public function getAllResponses()
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

    public function getResponses($testId)
    {
        $query = "SELECT * FROM responses WHERE test_id = " . $testId;
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

    public function getAnswers($questionId)
    {
        $query = "SELECT * FROM question_answers WHERE question_id = " . $questionId;
        $result = $this->conn->query($query);
        $answers = array();
        while ($row = $result->fetch_assoc()) {
            array_push($answers, $row['answer']);
        }
        return $answers;
    }

    public function getChoices($questionId)
    {
        $query = "SELECT * FROM question_choices WHERE question_id = " . $questionId;
        $result = $this->conn->query($query);
        $choices = array();
        while ($row = $result->fetch_assoc()) {
            array_push($choices, $row['choice']);
        }
        return $choices;
    }

    public function getSchedules($testId) {
        $query = "SELECT * FROM schedules WHERE test_id = " . $testId;
        $result = $this->conn->query($query);
        $schedules = array();
        while ($row = $result->fetch_assoc()) {
            $schedule = array();
            $schedule['id'] = $row['schedule_id'];
            $schedule['open_date'] = $row['open_date'];
            $schedule['close_date'] = $row['close_date'];
            array_push($schedules, $schedule);
        }
        return $schedules;
    }

    // Update
    public function updateQuestion($question)
    {
        $query = "SELECT question_type FROM questions WHERE question_id = " . $question['question-id'] . " LIMIT 1";
        $result = $this->conn->query($query);
        $questionType = "";
        while ($row = $result->fetch_assoc()) {
            $questionType = $row['question_type'];
        }
        $query = $this->conn->prepare("UPDATE questions SET question = ?, question_type = ?, points = ? WHERE question_id = ?");
        $query->bind_param("ssii", $question['question'], $question['question-type'], $question['points'], $question['question-id']);
        $query->execute();
        if ($questionType == "multiple-choice" && $question['question-type'] != "multiple-choice") {
            // Remove choices
            $query = "DELETE FROM question_choices WHERE question_id = " . $question['question-id'];
            $this->conn->query($query);
        } else if ($questionType == "multiple-choice" && $question['question-type'] == "multiple-choice") {
            // Update choices
        } else if ($questionType != "multiple-choice" && $question['question-type'] != "multiple-choice") {
            // Add choices
        }
    }

    // Delete
    public function deleteQuestion($questionId) {
        $query = "DELETE FROM question_answers WHERE question_id = " . $questionId;
        $this->conn->query($query);
        $query = "DELETE FROM question_choices WHERE question_id = " . $questionId;
        $this->conn->query($query);
        $query = "DELETE FROM questions WHERE question_id = " . $questionId;
        $this->conn->query($query);
    }
}
