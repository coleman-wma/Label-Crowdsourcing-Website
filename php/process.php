<?php

function printInput() { // I've got something wrong here - found a workaround
    $contents = var_dump($_POST);
    echo $contents;
}

function endSession() { // to end session by clicking a button
    // this removes all the variables in the session, but not the session itself 
    session_unset();

    // this destroys all the session variables and the session 
    session_destroy();

    // printing out the variables we wrote to see if they're balnked
    echo "<br/>" . "FROM FUNCTION (dollarSign)_SESSION['testUniqueID'] is " . $_SESSION['testUniqueID'] . "<br/>";

    Print_r($_SESSION);
    echo "<p>";
}

?>