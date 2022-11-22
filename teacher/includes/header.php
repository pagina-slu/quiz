<?php
if (!isset($_SESSION)) {
    session_start();
}
?>
<header>
    <div id="logo">
        <img class="green" src="images/book.svg" alt="logo" width="240" height="60" />Pagina
    </div>
    <div id="class-details">
        <span id="class-code">
            <?php
            if (isset($_SESSION['test-name'])) {
                echo $_SESSION['test-name'];
            } else if (isset($_SESSION['class-code'])) {
                echo $_SESSION['class-code'];
            }
            ?>
        </span>
        <span id="class-description">
            <?php
            if (isset($_SESSION['class-description'])) {
                echo $_SESSION['class-description'];
            }

            ?></span>
    </div>
    <a id="logout-button"><button>Logout</button></a>
</header>