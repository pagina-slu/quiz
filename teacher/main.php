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
  include_once 'includes/modal.php';
  ?>
  <header>
    <img class="logo white" src="images/book.svg" alt="logo" width="240" height="60" />
    <a id="logout-button"><button>Logout</button></a>
  </header>
  <nav id="top-nav">
    <ul>
      <li id="responses-button"><a>Responses</a></li>
      <li id="questions-button"><a>Questions</a></li>
    </ul>
  </nav>
  <main id="main">
  </main>

  <script src="../js/jquery-3.6.1.min.js"></script>
  <script src="../js/functions.js"></script>
  <script src="js/functions.js"></script>
  <script src="js/main.js"></script>
</body>

</html>