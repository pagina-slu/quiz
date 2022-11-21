<?php
require '../models/Teacher.php';

$teacher = new Teacher();
$data = array();
$data['question-id'] = $_POST['questionId'];
$data['question'] =  $_POST['question'];
$data['question-type'] = $_POST['questionType'];
if (isset($_POST['answer'])) $data['answer'] = $_POST['answer'];
if (isset($_POST['choices'])) $data['choices'] = $_POST['choices'];

$teacher->updateQuestion($data);