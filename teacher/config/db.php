<?php
function open_connection()
{
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "";
    $db = "pagina";

    // Stores the database connection
    $conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $conn->error);

    return $conn;
}

function close_connection($conn)
{
    echo "<script>console.log('Closing connection.');</script>";
    $conn->close();
}
