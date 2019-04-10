<?php

/* Script to read a table in the listeningtest.eu web space
 * 
 * THIS SCRIPT IS CALLED AT THE TOP OF trainingPage.php
 *  
 */

/* SERVER LOGIN
 * Declare variables and assign values for server log in.
 */

//function readTable() {

$servername = "mysql2269int.cp.blacknight.com";
$username = "u1099601_coleman";
$password = "Vtvvredr1746@";
$database = "db1099601_listeningTest";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
    echo "Connection FAILED" . "<br>";
} else {
     //echo "Success from the INITIAL CONNECT readORDER if statement" . "<br>";
}
// echo "Connected successfully" . "<br>";

$selectRow = json_encode($_SESSION['testUniqueID']); // decrement this value as needed

$sql = "SELECT * FROM EXP3_presOrder
                WHERE id = $selectRow"; // change this number to the subject ID

$result = $conn->query($sql);

// output data of each row
while ($row = $result->fetch_assoc()) { // fetch_assoc() puts $ into an associative array that we can loop through
    //echo "id: " . $row["id"] . " - Stim0: " . $row["testStim0"] . " - Stim1: " . 
    //$row["testStim1"] . "<br>";
    // write all the info to an array we can index by number
    $phpPresOrderArray = array($row["id"], $row["testStim1"], $row["testStim2"], 
        $row["testStim3"], $row["testStim4"], $row["testStim5"], $row["testStim6"], 
        $row["testStim7"], $row["testStim8"], $row["testStim9"], $row["testStim10"],
        $row["testStim11"], $row["testStim12"], $row["testStim13"], $row["testStim14"], 
        $row["testStim15"], $row["testStim16"], $row["testStim17"], $row["testStim18"], 
        $row["testStim19"], $row["testStim20"], $row["testStim21"], $row["testStim22"], 
        $row["testStim23"], $row["testStim24"], $row["testStim25"], $row["testStim26"], 
        $row["testStim27"], $row["testStim28"], $row["testStim29"], $row["testStim30"],
        $row["testStim31"], $row["testStim32"], $row["testStim33"], $row["testStim34"], 
        $row["testStim35"], $row["testStim36"], $row["testStim37"], $row["testStim38"], 
        $row["testStim39"], $row["testStim40"], $row["testStim41"], $row["testStim42"], 
        $row["testStim43"], $row["testStim44"], $row["testStim45"], $row["testStim46"],
        $row["testStim47"], $row["testStim48"], $row["testStim49"], $row["testStim50"],
        $row["testStim51"], $row["testStim52"], $row["testStim53"], $row["testStim54"], 
        $row["testStim55"], $row["testStim56"], $row["testStim57"], $row["testStim58"], 
        $row["testStim59"], $row["testStim60"], $row["testStim61"], $row["testStim62"], 
        $row["testStim63"], $row["testStim64"], $row["testStim65"], $row["testStim66"], 
        $row["testStim67"], $row["testStim68"], $row["testStim69"], $row["testStim70"],
        $row["testStim71"], $row["testStim72"], $row["testStim73"], $row["testStim74"], 
        $row["testStim75"], $row["testStim76"], $row["testStim77"], $row["testStim78"], 
        $row["testStim79"], $row["testStim80"], $row["testStim81"], $row["testStim82"], 
        $row["testStim83"], $row["testStim84"], $row["testStim85"], $row["testStim86"], 
        $row["testStim87"], $row["testStim88"], $row["testStim89"], $row["testStim90"],
        $row["testStim91"], $row["testStim92"], $row["testStim93"], $row["testStim94"], 
        $row["testStim95"], $row["testStim96"], $row["testStim97"], $row["testStim98"], 
        $row["testStim99"], $row["testStim100"]);
}

$conn->close(); // close the connection

?>