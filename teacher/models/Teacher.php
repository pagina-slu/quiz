<?php

class Teacher {
    private $conn;
    function __construct() {
        require_once 'config/db.php';
        $this -> conn = open_connection();
    }

    // CRUD Operations
    public function getAllClasses() {
        $query = "SELECT * FROM classes";
        $result = $this -> conn -> query($query);
        $classes = array();

        while ($row = $result -> fetch_assoc()) {
            array_push($classes, $row['class_description']);
        }
        return $classes;
    }
  
}
$t = new Teacher();
$_SESSION['classes'] = $t -> getAllClasses();