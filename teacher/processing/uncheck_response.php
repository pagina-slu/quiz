<?php
require '../models/Teacher.php';

$responseId = $_GET['responseId'];

$teacher = new Teacher();
echo $teacher->uncheckResponse($responseId);