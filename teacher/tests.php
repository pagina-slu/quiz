<?php
if (!isset($_SESSION)) {
  session_start();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="style/default.css" />
  <link rel="stylesheet" href="style/dashboard.css" />
  <title>Tests</title>
</head>

<body>
  <?php
  include_once 'includes/header.php';
  include_once 'includes/modal.php';
  ?>
  <div id="top-container">
    <div class="wrapper">
      <h1>My Tests</h1>
      <div class="search-bar"></div>
    </div>
    <div class="wrapper">
      <button id="new-test-button">New Test</button>
    </div>
  </div>
  <main id="main">
  </main>
  <script src="../js/jquery-3.6.1.min.js"></script>
  <script src="../js/functions.js"></script>
  <script src="js/modal.js"></script>
  <script src="js/functions.js"></script>
  <script src="js/tests.js"></script>
</body>

</html>