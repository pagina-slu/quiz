
<?php
include 'config/db.php';

$db_connection = open_connection();

echo "<script>console.log('Connected!');</script>";

close_connection($db_connection);
?>
<!DOCTYPE html>
<html>
  <head>
    <!-- HTML Codes by Quackit.com -->
    <title>Instructor View</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="style/style.css" />
  </head>
  <body>
    <header>
      <img
        class="logo white"
        src="images/book.svg"
        alt="logo"
        width="240"
        height="60"
      />
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
    <div id="modal">
      <div class="modal-dialog">
        <div class="modal-header">
          <span>Header</span>
          <button id="close-modal-button">X</button>
        </div>
        <div class="modal-content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, aut. Consequatur dolores itaque iure minima rerum ipsa temporibus! Dolorem magni quis aperiam non quae blanditiis ipsum similique commodi? Cum, ad.</div>
      </div>
    </div>
    <script src="../res/categories.js"></script>
    <script src="../res/questions.js"></script>
    <script src="../js/functions.js"></script>
    <script src="js/main.js"></script>
  </body>
</html>
