<?php
// this starts the session 
session_start();
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
        <title>Sound Event Presentation</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script type="text/javascript" src="http://www.listeningtest.eu/EXP3/js/listeningTest.js"></script>
        <script type="text/javascript" src="http://www.listeningtest.eu/EXP3/js/player.js"></script>
        <link rel="stylesheet" type="text/css" href="http://www.listeningtest.eu/EXP3/css/listeningTest.css">
        <!-- used to include 'php/process.php'; here but took it out -->
        <?php include 'readTable.php'; ?>

        <script type="text/javascript">

            // WRITES SESSION ID VARIABLE TO A JS VARIABLE SO WE CAN USE IT TO WRITE TO SERVER
            jsSubject_ID = <?php echo json_encode($_SESSION['testUniqueID']) ?>;
            //alert(PHPINTAG echo json_encode($_SESSION['testUniqueID']) ?>);

        </script>

        <script type="text/javascript">
            // the php 'readTable.php' file connects to the MySQL table that holds the orders
            // It loads the relevant order into the php array $phpPresOrderArray
            // the code below loads the presentation order into a javascript array jsPresOrderArray
            // Here we can use it to control the order of presentation of stimuli
            jsPresOrderArray = <?php echo json_encode($phpPresOrderArray) ?>;

            // alert(jsPresOrderArray[0] + ' - ' + jsPresOrderArray[1] + ' - ' + jsPresOrderArray[2]); // false
            // Got this from: http://www.dyn-web.com/tutorials/php-js/json/array.php
        </script>

    </head>
    <body>

        <!-- <a id="homeButtonTag" href="/index.html" style="visibility:visible">
            <button class="button buttonStart">HOME</button>
        </a> -->

        <h1 id="testPageHeadline">Sound Event Presentation</h1>

        <!-- SHOW / HIDE INSTRUCTIONS MODAL -->

        <!--  Trigger/Open The Modal -->
        <button id="modalPage1Btn" class="button buttonStart">Show Instructions</button> 

        <!-- The Modal -->
        <div id="modalPage1" class="modalFirst">

            <!-- Modal content -->
            <div class="modal-content">
                <span class="closeModal">&times;</span>
                <h2>How the experiment works.</h2>

                <h3>You will listen to and rate a series of sounds for the experiment.</h3>
                
                <h3>Imagine you are considering the sound as part of an overall mix.</h3>
                
                <p>When listening, consider whether what you hear would be mixed to a prominent position (Foreground),
                    a non-prominent position (Background) or somewhere in between. 
                    </p>
                    
                <h3>If you're not sure which point to pick, just select 'Neutral'.</h3>

                <p>There is no 'wrong' answer. I am interested in your opinion alone.</p>

                <p>You can play sounds as many times as you like.</p>

                <button id="modalPage2Btn" class="button buttonStart">Next</button> 
            </div>
        </div>

        <div id="modalPage2" class="modalOther">

            <!-- Modal content -->
            <div class="modal-content">
                <span class="closeModal">&times;</span>
                <h2>How the experiment works.</h2>

                <p>The 'PLAY' button will look like this.</p>

                <img id="PLAY_button" src="/images/PLAY_button.png" alt="play button"
                     class="modal_img">
                
                <h3>After you listen to each audio file, pick a point for the sound you hear on the provided scale.</h3>

                <p>The scale will look like this.</p>

                <img id="LIKERT_scale" src="/images/LIKERT_scale.png" alt="likert scale"
                     class="modal_img">

                <p>The green progress bar will track your progress through the experiment.</p>

                <img id="progBar" src="/images/progress_bar.png" alt="progress bar"
                     class="modal_img">

                <button id="modalPage3Btn" class="button buttonStart">Next</button> 
            </div>
        </div>

        <div id="modalPage3" class="modalOther">

            <!-- Modal content -->
            <div class="modal-content">
                <span class="closeModal">&times;</span>
                <h2>How the experiment works.</h2>

                <h3>The first six sounds you will listen to are for training purposes.</h3>

                <p>This is so you can familiarise yourself with how the controls work and 
                    also set the volume at a comfortable level.</p>

                <h4>Once you have set the volume level please try not to change it for the 
                    rest of the experiment. All the sounds have been level normalised.</h4>

                <h4>Please do NOT use the browser 'Back' button at any point.</h4>           

                <p>When you're ready to start the experiment, click the 'Start' button below.</p>

                <button id="modalExit" class="button buttonStart">Start</button> 
            </div>
        </div>

        <!-- FORM INPUT -->

        <h2 id="stimPageHead1"></h2>

        <h4 id="stimPageHead2"></h4>

        <h4 id="stimPageHead3"></h4>

        <div id='audioStimContainer' class='audioContainer'>

            <p id='progressBarHeader' class='audioLabelText'>This bar shows your progress through the experiment.</p>

            <div class="w3-light-grey">
                <div id="testProgressBar" class="w3-green-progress w3-center" style="width:0%"></div> <!-- w3-container -->
            </div>


            <p id='audioStimHeader' class='audioLabelText'>Press 'PLAY' to hear training sound 1 of 6.</p>

            <p id="audioStimInstruction" class='audioLabelText'>Please use the training sounds to set the volume to a comfortable level.</p>

            <audio id="audioStimulus" class='audioStimFile' src="http://www.listeningtest.eu/EXP3/media/mp3s/10023.mp3" 
                   type="audio/mpeg" onended="stimPlayedToEnd()">
                Your browser does not support the audio element.
            </audio>

            <!-- AUDIO CONTROLS HERE -->
            <div id="audio_controls">
                <div id="play_toggle" class="player-button">Play</div>
            </div>

            <div id="audio_progress">                
                <div id="progress" class="progress_bar">
                    <div id="play_progress"></div>
                </div>

            </div>

            <p id='audioStimRating' class='audioLabelText'>Please choose an option. Is the sound...</p>

            <form id="subjectLikert" name="likertForm" action="javascript:likertValidation()"> <!-- WAS action="javascript:formInputValidation()"-->

                <!-- Layout tips from https://www.w3schools.com/w3css/w3css_layout.asp
                and the relevant w3 style sheet here: https://www.w3schools.com/w3css/4/w3.css-->

                <div class='likertLayoutBlock'>
                    <div class="likertLayoutCell">Background</div>
                    <div class="likertLayoutCell">Neutral</div>
                    <div class="likertLayoutCell">Foreground</div>
                </div>

                <div class='likertLayoutBlock'>
                    <div class="likertLayoutCell"><input id="stimISdefback" type="radio" name="likertRadio" required 
                                                         onclick="javascript:logScore(1)">    <!-- javascript: setInternet(#) --></div>
                    <div class="likertLayoutCell"><input id="stimISneutral" type="radio" name="likertRadio" required
                                                         onclick="javascript:logScore(2)"></div>
                    <div class="likertLayoutCell"><input id="stimISdeffore" type="radio" name="likertRadio" required
                                                         onclick="javascript:logScore(3)"></div>
                </div>

                <div id="likertError" class="errorCenterText"></div>

                <span id="likertError" class="error"></span>

                <input id="indexSubmitForm" type="submit" value="Submit" class="button buttonTest">
            </form>

        </div>



        <!-- <span id="confirmSubjectID2" class="error"></span> -->

        <h3 id="fgbgh3">For the purposes of this study, foreground and background sounds are defined as follows:</h3> 
        <ul id="fgbgul">
            <li>A FOREGROUND sound: A sound that should be mixed to a prominent position.</li>
            <li>A BACKGROUND sound: A sound that does not need to be prominent in the mix.</li>
        </ul>

        <p id="ack" class="ackClass">I would like to acknowledge the support of the Irish Research Council
            in funding this research project.</p>

        <div id="ircLogothanks" class='ackContainer'>        

            <img id="IrcLong" src="/images/IRC_logo_LONG.png" alt="IRClong"
                 class="centerlong">

        </div>



        <script type="text/javascript" src="/js/modal.js">
//        THIS SCRIPT contains javascript that works with elements on this page.
//        It needs to be down here so that the elements the javascript manipulates
//        exist when the js acts on them. I was getting null assignments when this 
//        was at the top of the page.
        </script>
    </body>
</html>