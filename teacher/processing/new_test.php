<?php

require '../models/Teacher.php';

$teacher = new Teacher();
$data = array($_POST['test-name'], $_POST['test-type'], $_POST['class-code']);
$teacher ->createNewTest($data);