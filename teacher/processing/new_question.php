<?php

require '../models/Teacher.php';

$teacher = new Teacher();
$data = array($_POST['test-id'], $_POST['question'], $_POST['question-type']);
$teacher ->createNewQuestion($data);