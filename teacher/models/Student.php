<?php

class Student {
    public $studentId = "";
    public $firstName = "";
    public $lastName = "";

    // Getters
    public function getId() {
        return $this -> studentId;
    }

    public function getFirstName() {
        return $this -> firstName;
    }

    public function getLastName() {
        return $this -> lastName;
    }

    // Setters
    public function setId(string $id) {
        $this -> studentId = $id;
    }

    public function setFirstName(string $firstName) {
        $this -> firstName = $firstName;
    }

    public function setLastName(string $lastName) {
        $this -> lastName = $lastName;
    }

    // CRUD Operations
}