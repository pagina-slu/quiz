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
        $query->bind_param("issi", $data['test-id'], trim($data['question']), $data['question-type'], $data['points']);
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

    public function createNewSchedule($data)
    {
        $query = $this->conn->prepare("INSERT INTO schedules(test_id, open_date, close_date) VALUES (?, ?, ?)");
        $query->bind_param("iss", $data['test-id'], $data['open-date'], $data['close-date']);
        $query->execute();
    }

    // READ
    public function getResponseDetails($responseID)
    {
        $query = "SELECT * FROM response_details WHERE response_id = '" . $responseID . "'";
        $result = $this->conn->query($query);
        $responses = array();

        while ($row = $result->fetch_assoc()) {
            $response = array();
            $response['responseID'] = $row['response_id'];
            $response['questionID'] = $row['question_id'];
            $response['answer'] = $row['answer'];
            array_push($responses, $response);
        }
        return $responses;
    }

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

    public function getQuestion($questionId)
    {
        $query = "SELECT * FROM questions WHERE question_id = " . $questionId . " LIMIT 1";
        $result = $this->conn->query($query);
        $question = array();
        while ($row = $result->fetch_assoc()) {
            $question["question"] = $row["question"];
            $question["id"] = $row['question_id'];
            $question["type"] = $row['question_type'];
            $question["points"] = $row['points'];
            $question["answer"] = $this->getAnswers($question["id"]);
            if ($question["type"] == "multiple-choice") {
                $question["choices"] = $this->getChoices($question["id"]);
            }
        }

        return $question;
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
        $query = "SELECT * FROM responses WHERE test_id = '" . $testId . "'";
        $result = $this->conn->query($query);
        $responses = array();
        while ($row = $result->fetch_assoc()) {
            $response = array();
            $response['id'] = $row['response_id'];
            $response['test_id'] = $row['test_id'];
            $response['student_id'] = $row['student_id'];
            $response['is_checked'] = $row['is_checked'];
            $response['score'] = $row['score'];
            $response['timestamp'] = $row['timestamp'];
            array_push($responses, $response);
        }
        return $responses;
    }

    public function getQuestionAnswers($questionID)
    {
        $query = "SELECT * FROM question_answers WHERE test_id = '" . $questionID . "'";
        $result = $this->conn->query($query);
        $answers = array();
        while ($row = $result->fetch_assoc()) {
            $answer = array();
            $answer['question_id'] = $row['question_id'];
            $answer['answer'] = $row['answer'];
            array_push($answers, $answer);
        }
        return $answers;
    }

    public function getTotalPoints($testId)
    {
        $query = "SELECT SUM(points) AS points FROM questions where test_id ='" . $testId . "'";
        $result = $this->conn->query($query);
        $row = $result->fetch_assoc();
        return $row['points'];
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

    public function getStudent($student_id)
    {
        $query = "SELECT * FROM students where student_id = '" . $student_id . "'";
        $result = $this->conn->query($query);
        $student = array();
        while ($row = $result->fetch_assoc()) {
            $student['student_id'] = $row['student_id'];
            $student['f_name'] = $row['first_name'];
            $student['l_name'] = $row['last_name'];
        }
        return $student;
    }

    public function getAllStudents()
    {
        $query = "SELECT * FROM students";
        $result = $this->conn->query($query);
        $students = array();
        while ($row = $result->fetch_assoc()) {
            $student = array();
            $student['student_id'] = $row['student_id'];
            $student['f_name'] = $row['first_name'];
            $student['l_name'] = $row['last_name'];
            array_push($students, $student);
        }
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

    public function getSchedules($testId)
    {
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

    public function getHighestScore($testId) {
        $query = "SELECT MAX(score) AS max_score FROM responses WHERE test_id = " . $testId;
        $result = $this->conn->query($query);
        $row = $result->fetch_assoc();

        return $row['max_score'];
    }

    public function getAverageScore($testId) {
        $query = "SELECT AVG(score) AS average_score FROM responses WHERE test_id = " . $testId;
        $result = $this->conn->query($query);
        $row = $result->fetch_assoc();

        return $row['average_score'];
    }



    // Update
    public function updateQuestion($question)
    {
        $questionId = $question['question-id'];
        $query = "SELECT question_type FROM questions WHERE question_id = " . $questionId . " LIMIT 1";
        $result = $this->conn->query($query);
        $currentQuestionType = "";
        while ($row = $result->fetch_assoc()) {
            $currentQuestionType = $row['question_type'];
        }
        $query = $this->conn->prepare("UPDATE questions SET question = ?, question_type = ?, points = ? WHERE question_id = ?");
        $query->bind_param("ssii", $question['question'], $question['question-type'], $question['points'], $questionId);
        $query->execute();

        // Manipulate choices
        if ($currentQuestionType == "multiple-choice" && $question['question-type'] != "multiple-choice") {
            // Remove choices
            $query = "DELETE FROM question_choices WHERE question_id = " . $questionId;
            $this->conn->query($query);
        } else if ($currentQuestionType == "multiple-choice" && $question['question-type'] == "multiple-choice") {
            // Remove choices
            $query = "DELETE FROM question_choices WHERE question_id = " . $questionId;
            $this->conn->query($query);

            // Add choices
            foreach ($question['choices'] as &$choice) {
                $addQuery = $this->conn->prepare("INSERT INTO question_choices(question_id, choice) VALUES ( ?, ?)");
                $addQuery->bind_param("is", $questionId, $choice);
                $addQuery->execute();
            }
        } else if ($currentQuestionType != "multiple-choice" && $question['question-type'] == "multiple-choice") {
            // Add choices
            foreach ($question['choices'] as &$choice) {
                $addQuery = "INSERT INTO question_choices(question_id, choice) VALUES ( " . $questionId . ", " . $choice . ")";
                $this->conn->query($addQuery);
            }
        }

        // Remove all answers
        $query = "DELETE FROM question_answers WHERE question_id = " . $questionId;
        $result = $this->conn->query($query);

        // Add new answers
        foreach ($question['answer'] as &$answer) {
            $query = $this->conn->prepare("INSERT INTO question_answers(question_id, answer) VALUES (?, ?)");
            $query->bind_param("is", $questionId, $answer);
            $query->execute();
        }
    }

    public function checkResponse($responseId)
    {
        $responseDetails = $this->getResponseDetails($responseId);
        $score = 0;
        foreach ($responseDetails as &$response) {
            $question = $this->getQuestion($response['questionID']);
            foreach ($question['answer'] as &$answer) {
                
                if (strtolower(trim($response['answer'])) == strtolower(trim($answer))) {
                    $score = $score + $question['points'];
                    break;
                }
            }
        }

        $query = "UPDATE responses SET is_checked = true, score = " . $score . " WHERE response_id = " . $responseId;
        $this->conn->query($query);
        return $score;
    }

    public function getCorrectAnswersCount($questionId) {
        $count = 0;
        $query = "SELECT * FROM response_details WHERE question_id = " . $questionId;
        $result = $this->conn->query($query);
        while ($row = $result->fetch_assoc()) {
            $question = $this->getQuestion($row['question_id']);
            foreach ($question['answer'] as &$answer) {
                if (strtolower(trim($row['answer'])) == strtolower(trim($answer))) {
                    $count = $count + 1;
                    break;
                }
            }
        }
        return $count;
    }

    public function uncheckResponse($responseId)
    {
        $query = "UPDATE responses SET is_checked = false, score = 0  WHERE response_id = " . $responseId;
        $this->conn->query($query);
    }

    // Delete
    public function deleteQuestion($questionId)
    {
        $query = "DELETE FROM question_answers WHERE question_id = " . $questionId;
        $this->conn->query($query);
        $query = "DELETE FROM question_choices WHERE question_id = " . $questionId;
        $this->conn->query($query);
        $query = "DELETE FROM questions WHERE question_id = " . $questionId;
        $this->conn->query($query);
    }

    public function deleteSchedule($scheduleId)
    {
        $query = "DELETE FROM schedules WHERE schedule_id = " . $scheduleId;
        $this->conn->query($query);
    }

    public function deleteResponses($testId)
    {
        $query = "SELECT response_id FROM responses WHERE test_id = " . $testId;
        $result = $this->conn->query($query);
        $responseIds = array();
        while ($row = $result->fetch_assoc()) {
            array_push($responseIds, $row['response_id']);
        }

        foreach ($responseIds as &$responseId) {
            $query = "DELETE FROM response_details WHERE response_id = " . $responseId;
            $this->conn->query($query);
        }

        $query = "DELETE FROM responses WHERE test_id = " . $testId;
        $this->conn->query($query);
    }
}
