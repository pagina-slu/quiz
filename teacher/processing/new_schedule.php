<?php
require '../models/Teacher.php';

$teacher = new Teacher();
$data = array();
$data['test-id'] = $_POST['test-id'];
$data['open-date'] = $_POST['open-date'];
$data['close-date'] = $_POST['close-date'];
$teacher->createNewSchedule($data);