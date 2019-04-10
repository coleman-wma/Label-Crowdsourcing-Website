<?php
session_start(); // this starts the session 
// Start the output buffer
// This is to enable page forwarding when input is written to the server.
// It only forwards the user to the next page (training) if writing to the database has been successful
ob_start();

// I start the buffer here, the redirect and the ob_end_flush() are in validation.php
// Good explanation of this here: https://www.sitepoint.com/community/t/redirection-after-html-output/2351/3
?>

<!DOCTYPE html>
<!--
    Created on : Aug 31, 2017
    Author     : William Coleman

The php code is based on W3Schools php form tutorial: 
https://www.w3schools.com/php/php_forms.asp

-->
<html>
    <head>
        <title>Demographic Survey</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="/js/listeningTest.js"></script>
        <link rel="stylesheet" type="text/css" href="/css/listeningTest.css">
    </head>
    <body onload='mobileCheck()'>

        <!-- <a id="homeButtonTag" href="/index.html" style="visibility:visible">
            <button class="button buttonStart">HOME</button>
        </a> -->

        <h1>Demographic Survey</h1>

        <!-- SMARTPHONE / TABLET WARNING -->

        <div id="modalMobile" class="modalOther">

            <!-- Modal content -->
            <div class="modal-content">
                <span class="closeModalMobile">&times;</span>

                <h3>It looks like you're browsing on a mobile device.</h3>

                <h4>This site is designed to display on desktop computers. Some elements will
                    not display correctly on smaller screens.</h4>

                <h4>During testing the site worked as expected on most mobile devices, but not all.
                    If you find that the final training sound is presented repeatedly this means that the
                    experimental sounds will not load on your device. Please try again on a desktop computer.</h4>

                <h4>Apologies for any inconvenience.</h4>

                <button id="modalMobileBtn" class="button buttonStart">Exit</button> 
            </div>
        </div>

        <!-- HEARING DEFICIENCIES WARNING -->

        <div id="modalHearDef" class="modalOther">

            <!-- Modal content -->
            <div class="modal-content">
                <span class="closeModalHearDef">&times;</span>

                <h4>None of the experimental procedures to be used in this study are likely to cause any 
                    discomfort or adverse reaction. You will have control over the volume level at all times.
                    Still, for the duration of the listening experiment there is a low risk of being exposed to 
                    excessive sound levels.</h4>

                <h4>To control this you will be asked to set the volume at a comfortable level during the training phase. 
                    The experiment sounds have been screened for this purpose.
                </h4>

                <h4>Participants with auditory disorders, such as tinnitus, may find that taking 
                    part in the study draws attention to their disorder in a negative way. In such 
                    an instance participants are asked to stop the listening experiment.</h4>

                <button id="modalHearDefBtn" class="button buttonStart">Exit</button> 
            </div>
        </div>

        <!-- FORM INPUT -->

        <h2>Please answer the following questions.</h2>

        <!-- INCLUDE .PHP FILE FOR VALIDATION AND WRITING TO SERVER -->
        <?php
        include 'validation.php';
        ?>

        <!-- ********* ---------- *********** -->
        <!-- ********* INPUT FORM *********** -->
        <!-- ********* ---------- *********** -->

        <p><span class="error">All fields are required.</span></p>
        <form class="" method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">  
            <fieldset>

                <input id="devTypeNo" name="devType" style="display:none;">
                <input id="userAgentStr" name="userAgent" style="display:none;">

                <!-- ********* AGE *********** -->

                <div class="surveyDivs">
                    <label_alt for="age_" class="surveyQs">What is your age (you must be 18+ to take part)?</label_alt>

                    <select id="age_" name="subjectAge" autofocus required class="surveyContent">
                        <option value=''></option>
                        <option value='18-24'>18-24</option>
                        <option value='25-44'>25-44</option>
                        <option value='45-64'>45-64</option>
                        <option value='65-74'>65-74</option>
                        <option value='75+'>75+</option>
                    </select>

                    <span class="error"><?php echo $subjectAgeErr; ?></span>
                </div>


                <!-- ********* HEARING *********** -->

                <div class="surveyDivs">
                    <label_alt for="hearing_def" class="surveyQs">Do you have any hearing deficiencies?</label_alt>

                    <label for="hearing_defY" class="surveyContent">Yes</label>
                    <input id="hearing_defY" type="radio" name="hearing_def" required <?php
                    if (isset($hearing_def) && $hearing_def == "yes") {
                        echo "checked";
                    }
                    ?> value="yes"><br>

                    <label for="hearing_defN" class="surveyContent">No</label>
                    <input id="hearing_defN" type="radio" name="hearing_def" required <?php
                    if (isset($hearing_def) && $hearing_def == "no") {
                        echo "checked";
                    }
                    ?> value="no">
                    <span class="error"><?php echo $hearing_defErr; ?></span>
                </div>


                <!-- ********* GENDER *********** -->

                <div class="surveyDivs">
                    <label_alt for="gender_" class="surveyQs">How do you identify your gender?</label_alt>

                    <label for="gender_F" class="surveyContent">Female</label>
                    <input id="gender_F" type="radio" name="gender" required <?php
                    if (isset($gender) && $gender == "female") {
                        echo "checked";
                    }
                    ?> value="female"><br>

                    <label for="gender_M" class="surveyContent">Male</label>
                    <input id="gender_M" type="radio" name="gender" required <?php
                    if (isset($gender) && $gender == "male") {
                        echo "checked";
                    }
                    ?> value="male"><br>

                    <label for="gender_O" class="surveyContent">Other</label>
                    <input id="gender_O" type="radio" name="gender" required <?php
                    if (isset($gender) && $gender == "other") {
                        echo "checked";
                    }
                    ?> value="other">
                    <span class="error"><?php echo $genderErr; ?></span>
                </div>

                <!-- ********* HANDEDNESS *********** -->

                <div class="surveyDivs">
                    <label_alt for="handedness_" class="surveyQs">Are you left, right-handed or ambidextrous?</label_alt>

                    <label for="handednessL" class="surveyContent">Left</label>
                    <input id="handednessL" type="radio" name="handedness" required <?php
                    if (isset($handedNess) && $handedNess == "left") {
                        echo "checked";
                    }
                    ?> value="left"><br>

                    <label for="handednessR" class="surveyContent">Right</label>
                    <input id="handednessR" type="radio" name="handedness" required <?php
                    if (isset($handedNess) && $handedNess == "right") {
                        echo "checked";
                    }
                    ?> value="right"><br>

                    <label for="handednessA" class="surveyContent">Ambi</label>
                    <input id="handednessA" type="radio" name="handedness" required <?php
                    if (isset($handedNess) && $handedNess == "ambidextrous") {
                        echo "checked";
                    }
                    ?> value="ambidextrous">

                    <span class="error"><?php echo $handedNessErr; ?></span>
                </div>



                <input type="submit" name="submit" value="Submit" class="button buttonTest">
            </fieldset>
        </form>
        <script src="/js/mobileDevice.js"></script>
    </body>
</html>