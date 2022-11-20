<?php

require '../models/Teacher.php';

$teacher = new Teacher();
$data = array();
$data['test-id'] = $_POST['test-id'];
$data['question'] =  $_POST['question'];
$data['question-type'] = $_POST['question-type'];
if (isset($_POST['answer'])) $data['answer'] = $_POST['answer'];
if (isset($_POST['choices'])) $data['choices'] = $_POST['choices'];

$teacher->createNewQuestion($data);