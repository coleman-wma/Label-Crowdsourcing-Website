<?php

//include 'ChromePhp.php';

$thisID = $_POST['resultsArray'][0];  // jsSubject_ID
$whichStim = $_POST['resultsArray'][1]; // stim
$theRes = $_POST['resultsArray'][2];  // result
$tmPlayed = $_POST['resultsArray'][3]; // timesPlayed
$instNum = $_POST['resultsArray'][4];  // instance_no
$finDateTime = date("Y:m:d H:i:s");

//$thisID = 5;  // jsSubject_ID
//$whichStim = 15005; // stim
//$theRes = 1;  // result
//$tmPlayed = 5; // timesPlayed
//$instNum = 0;  // instance_no
//$finDateTime = date("Y:m:d H:i:s");

$col1 = "trainStim" . $instNum;
$col2 = "trainResu" . $instNum;
$col3 = "trainPlay" . $instNum;

//echo "The variable '$col1' is " . $col1 . "<br>";
//echo "The variable '$whichStim' is " . $whichStim . "<br>";

$servername = "mysql2269int.cp.blacknight.com"; // variables for MySQL table connection
$username = "u1099601_coleman";
$password = "V###########@";
$database = "db1099601_listeningTest";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Success from the INITIAL CONNECT if statement" . "<br>";
}

// insert variables into SQL table

$sql = "UPDATE EXP3_subjectInfo
                    SET $col1 = '$whichStim', $col2 = '$theRes', $col3 = '$tmPlayed', fin_date = '$finDateTime'
                    WHERE id = $thisID";


if ($conn->query($sql) === TRUE) {
    $msg = "New record created successfully";
    echo "New record created successfully";
    // inside the json_encode() I'm declaring an array that gets passed back to 
    // the original script page (trainingPage.php)
    echo json_encode(array("firstSlot" => $thisID, "secondSlot" => $col1));

    // this removes all the variables in the session, but not the session itself 
    session_unset();

    // this destroys all the session variables and the session 
    session_destroy();
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
?>

