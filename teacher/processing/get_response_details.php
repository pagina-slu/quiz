<?php
require '../models/Teacher.php';

$responseID = $_GET['responseID'];

$teacher = new Teacher();
$responseDetails = $teacher->getResponseDetails($responseID);

echo json_encode($responseDetails);
