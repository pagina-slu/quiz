<?php
require '../models/Teacher.php';

$scheduleId = $_GET['scheduleId'];

$teacher = new Teacher();
echo $teacher->deleteSchedule($scheduleId);

