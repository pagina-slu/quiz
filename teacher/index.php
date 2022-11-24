<?php
if (!isset($_SESSION)) {
  session_start();
}
if (!isset($_SESSION['class-code'])) {
  header("Location:dashboard.php");
}
?>
<!DOCTYPE html>
<html>

<head>
  <title>Instructor View</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="style/default.css" />
  <link rel="stylesheet" href="style/style.css" />
</head>

<body>
  <?php
  include_once 'includes/header.php';
  include_once 'includes/modal.php';
  ?>
  <nav id="top-nav">
    <ul>
      <li id="questions-button"><a>Questions</a></li>
      <li id="responses-button"><a>Responses</a></li>
      <li id="schedules-button"><a>Schedules</a></li>
    </ul>
  </nav>
  <main id="main">
  </main>

  <script src="../js/jquery-3.6.1.min.js"></script>
  <script src="../js/functions.js"></script>
  <script src="js/modal.js"></script>
  <script src="js/functions.js"></script>
  <script src="js/logout.js"></script>
  <script src="js/main.js"></script>
</body>

</html>