<!--

    Created on : Aug 31, 2017
    Author     : William Coleman

The php code is based on W3Schools php form tutorial: 
https://www.w3schools.com/php/php_forms.asp

-->

<html> 
    <head> 
        <title></title> 
    </head> 

    <body> 

        <?php
        /* Final validation of correct input and post results to server
         * so they're all stored in the same record. */

        /* SERVER LOGIN
         * Declare variables and assign values for server log in.
         */

        $servername = "mysql2269int.cp.blacknight.com";
        $username = "u1099601_coleman";
        $password = "Vtvvredr1746@";
        $database = "db1099601_listeningTest";

// Create connection
        $conn = new mysqli($servername, $username, $password, $database);

// Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        } // else {
        // echo "Success from the INITIAL CONNECT if statement" . "<br>";
        // }
        // echo "Connected successfully" . "<br>";
// define variables to hold form input, error checking booleans and error msgs - set to empty values

        /* INSERTING VALUES INTO THE SERVER DB NEEDS TO ACT ONLY
         * ON VALID COMPLETION OF ALL ELEMENTS OF THE FORM - THIS REQUIRES A BOOLEAN
         * FOR EACH ENTRY WHICH IS CHECKED - ONLY WHEN ALL BOOLEANS ARE TRUE 
         * CAN DATA BE WRITTEN TO THE SERVER  */

        $subjectAgeErr = $hearing_defErr = $genderErr = $handedNessErr = ""; // $ruralUrbanErr = $listenToMusicErr = $liveMusicEventsErr = $playInstrumentErr = $cinemaGoerErr = $playsComputerGamesErr = $proAudioAcousticsErr = $testEnvironmentErr = 
        $regDate = $subjectAge = $hearing_def = $gender = $handedNess = $devMobile = $user_Agent = ""; // $ruralUrban = $listenToMusic = $liveMusicEvents = $playInstrument = $cinemaGoer = $playsComputerGames = $proAudioAcoustics = $testEnvironment = 
        $subjectAgeCk = $hearing_defCk = $genderCk = $handedNessCk = False; // $ruralUrbanCk = $listenToMusicCk = $liveMusicEventsCk = $playInstrumentCk = $cinemaGoerCk = $playsComputerGamesCk = $proAudioAcousticsCk = $testEnvironmentCk = 

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            
                        /*  ---------------- AGE ---------------  */
            
            if (empty($_POST["subjectAge"])) { // if left empty throw an error
                $subjectAgeErr = "This is a required field. Please select an option.";
                $subjectAgeCk = False;
            } else {
                $subjectAge = $_POST["subjectAge"];
                $subjectAgeCk = True;
            }

            /*             * ********* HEARING DEFICIENCIES ******** */

            if (empty($_POST["hearing_def"])) {
                $hearing_defErr = "Please select an option";
                $hearing_defCk = False;
            } else {
                $hearing_def = test_input($_POST["hearing_def"]);
                $hearing_defCk = True; // Switch boolean check to True so this item will pass validation
            }


            /*             * ********* GENDER ******** */

            if (empty($_POST["gender"])) {
                $genderErr = "Gender is required";
                $genderCk = False;
            } else {
                $gender = test_input($_POST["gender"]);
                $genderCk = True; // Switch boolean check to True so this item will pass validation
            }

            /*             * ********* HANDEDNESS ******** */

            if (empty($_POST["handedness"])) {
                $handedNessErr = "Please select an option";
                $handedNessCk = False;
            } else {
                $handedNess = test_input($_POST["handedness"]);
                $handedNessCk = True; // Switch boolean check to True so this item will pass validation
            }
            
            $devMobile = $_POST["devType"]; 
            $user_Agent = $_POST["userAgent"]; // need to check this is working
            
        }

// Form input is fed to this function so input can be parsed for malicious code
        function test_input($data) {
            $data = trim($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }

// If everything checks out and all input is valid then we can write this to the server.
// First we check the booleans
        if ($subjectAgeCk && $hearing_defCk &&
                $genderCk && $handedNessCk == TRUE) {

            $subjectAgeCk = $hearing_defCk = $genderCk = $handedNessCk = False;

// If successful then we run this function which writes values to server
            postToServer();
        }

        function postToServer() {

            /* The connection is created at the top of this script
             * So all we have to do is write the values.
             * Have to pull global variables into the function first so they can be accessed in this scope. */

            global $conn, $regDate, $subjectAge, $hearing_def,
            $gender, $handedNess, $devMobile, $user_Agent;

            $last_id = ""; // to ensure it's not set to an old value
            // SET TIMESTAMP VALUE
            date_default_timezone_set("Europe/Dublin");
            $regDate = date("Y:m:d H:i:s");

            /* ---------------- INSERT QUESTIONNAIRE VALUES ----------------------- */

            $sql = "INSERT INTO EXP3_subjectInfo (age) VALUES ('$subjectAge')";

            // If we've made a connection to the server then track the id
            if ($conn->query($sql) === TRUE) {
                $last_id = $conn->insert_id; // track the id for this new record
                // echo "New record created successfully. Last inserted ID is: " . $last_id . "<br>";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }

            // this sets variables in the session so we can track $last_id across multiple pages
            $_SESSION['testUniqueID'] = $last_id; // make this available to other pages so we can write test results

            $sql = "UPDATE EXP3_subjectInfo
                    SET reg_date = '$regDate',
                    hearing_def = '$hearing_def', gender = '$gender',
                    handedness = '$handedNess', devicetype = '$devMobile', useragent = '$user_Agent' 
                    WHERE id = $last_id";
            
            // ADD TO ABOVE WHEN NEW TABLE CREATED
            // , test_environment = '$testEnvironment'
            // , environment = '$ruralUrban', listen_music = '$listenToMusic',
            //        gig_goer = '$liveMusicEvents', play_inst = '$playInstrument', go_cinema = '$cinemaGoer',
            //        comp_gamer = '$playsComputerGames', audio_proacad = '$proAudioAcoustics'

            if ($conn->query($sql) === TRUE) {
                // echo "regDate appended to the last record" . "<br>";
                // echo "End of boolean check IF STATEMENT!" . "<br>";
                // Because the connection needs to be closed
                $conn->close();

                // If this is successful - redirect this page to the first training page
                // Clean (erase) the output buffer and turn off output buffering                
                ob_end_clean();
                // Send the user to the next page (Training)
                header('Location: http://www.listeningtest.eu/EXP3/php/trainingPage.php');
                // Output a message (optional) and terminate the current script
                exit;
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }

// Flush (send) the output buffer and turn off output buffering
        ob_end_flush();
        ?>


    </body> 
</html>

