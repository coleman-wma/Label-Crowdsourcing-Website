/* 
 * 
 *     Created on : Aug 31, 2017
 *     Author     : William Coleman
 */

/****************************************************************/
/******************** DECLARE VARIABLES *************************/
/****************************************************************/

var subjectStimOrderArray = [];   // This array will hold the order in which the
// subject listens to stimuli

var subjectStimScoreArray = [];   // This array will hold the scores the subject
// give to each stimulus

var timesPlayedArray = [];      // THIS array holds the no. of times played for each stimulus

var jsPresOrderArray = [];      // we load the order of presentation into this array from the server

var presCounter = 0;            // controls which slot in the arrays we're writing to
var fileName = "10023.mp3";               //  the name of the file we're switching to
var testSlotCounter = 1;        // controls which slot of the test Stimuli we're looking at
var trainingStage = true;       // boolean to control stimuli loading

var fileDir = "http://www.listeningtest.eu/EXP3/media/mp3s/"; // media file directory
var likertScore;                // holds likert Score for current stimulus
var stimulusPlayed = false;
var jsSubject_ID = 0;

var progBarWidth = 0;           // to implement test progress bar
var score;                      // holds the score selected by the subject from the Likert radio buttons
var col1;                       // to hold string variables for indexing sql tables
var col2;
var col3;
var timesPlayed = 0;            // track the number of times a stimulus is played


/****************************************************************/
/****************** LOG SCORE FROM LIKERT ***********************/
/****************************************************************/

/* When a radio button is selected, this function writes the relevant value to the arrays 
 * It is called directly from the Likert radio buttons on trainingPage.php                          */

function logScore(score) { // write the selected likert scale to the Object that holds test info

    likertScore = score; // for validation of radio buttons - score set at Likert radio buttons

    subjectStimOrderArray[presCounter] = fileName; // writes the number of the file being used to the subjectStimOrderArray array
    subjectStimScoreArray[presCounter] = likertScore;    // was score????
    timesPlayedArray[presCounter] = timesPlayed;   // writes the number of times this stimulus was played to the timesPlayedArray array

    //alert("presCounter: " + presCounter + ". fileName:" + subjectStimOrderArray[presCounter] +
    //        ". Score:" + subjectStimScoreArray[presCounter] + ". timesPlayed:" + timesPlayedArray[presCounter]);

}


/****************************************************************/
/********* CHECK THAT STIMULUS IS PLAYED TO THE END *************/
/****************************************************************/

function stimPlayedToEnd() { // to control a boolean the validation can check to make 
    // sure the file has been played to the end
    stimulusPlayed = true;   // This is called from the audio element 'onended' attribute on trainingPage.php
    timesPlayed++; // track the number of times the stimulus has been played
    //document.getElementById("confirmSubjectID2").innerHTML = timesPlayed; // for validation
}


/****************************************************************/
/**************** VALIDATE LIKERT SCALE INPUT *******************/
/****************************************************************/

/* Function to validate the input from the subject likert rating */

function likertValidation() {

    //document.getElementById("confirmSubjectID").innerHTML = localStorage.subject_id;

    //document.getElementById("confirmSubjectID2").innerHTML = jsSubject_ID; // to confirm the passing of a php variable to js
    // this prints out on trainingPage.php

// This is called from the Likert radio button form on trainingPage.php
// first, check the file has been played to the end

    if (stimulusPlayed) {                   // if stimulusPlayed is true, then
        // check the subject has checked a radio button
        var radioButtons = document.getElementsByName("likertRadio");
        for (var i = 0; i < radioButtons.length; i++) { // loop through all the Likert radio buttons
            if (radioButtons[i].checked) {
                // if this radio button is checked write the value to the local array
                //document.getElementById("likertError").innerHTML = "Selected score is " + likertScore;
                document.getElementById("likertError").innerHTML = "";
                radioButtons[i].checked = false;        // reset the radio button
                
                if (trainingStage) {
                    
                    passVal_train(jsSubject_ID, fileName, likertScore, timesPlayed, presCounter); // first pass the scores just entered
                    timesPlayed = 0; // zero this in preparation for the next stimulus
                    
                    if (fileName === "10080.mp3") {
                        trainingStage = false; // this is the final training stimulus, so flip this boolean                 
                    }
                                
                } else {
                    
                    passVal_test(jsSubject_ID, fileName, likertScore, timesPlayed, testSlotCounter - 1); // first pass the scores for final train stim
                    timesPlayed = 0; // zero this in preparation for the next stimulus
                    
                }
            
                loadNextAudio();                        // load the next audio file
                return;                                 // no need to check the rest
            } else {
                // if none of the radio buttons has been selected, fill the error span with an appropriate message
                document.getElementById("likertError").innerHTML =
                        "You must select an option. If you're not sure, just select \'Neutral\'.";
            }
        }
    } else {    // if stimulusPlayed is false,
        // fill the error span with an appropriate message
        document.getElementById("likertError").innerHTML =
                "Please wait until the whole file has played before rating. Thank You.";
    }
}


/****************************************************************/
/**************** LOAD THE NEXT AUDIO STIMULUS ******************/
/****************************************************************/

function loadNextAudio() {
    /* This is called from likertValidation(), after stimulus has been played to the 
     * end and the subject has selected a score. This function checks if we're
     * still in training stage or not, and loads the next stimulus accordingly.
     * In the training stage, this is hard-coded. Beyond that, it looks at the
     * jsPresOrderArray[] to see what file to load next.
     */

    document.getElementById('play_progress').style.width = 0; // when loading a new file, reset the play progress div

    // to track the current and next audio sources
    var oldAudioSrc = newAudioSrc = document.getElementById('audioStimulus');
    //var arrayCounter; // a counter to load new files from the jsPresOrderArray
    //var newAudioSrc = document.getElementById('audioStimulus'); // variable to hold new audio source

    if (trainingStage) {
        
            //passVal_train(jsSubject_ID, fileName, likertScore, timesPlayed, presCounter); // first pass the scores just entered
            
            //timesPlayed = 0; // zero this in preparation for the next stimulus
            
        // check the current stimulus and change presCounter & fileName variables accordingly
        if (oldAudioSrc.src === fileDir + "10023.mp3") { // if it's the first training stim, load the second...

            fileName = "10045.mp3";
            newAudioSrc.src = fileDir + fileName;                // changing the src of the audio element
            presCounter++;                                       // increment presCounter
            newAudioSrc.load();                                  // loading the new file ready for playing


            // Update the progress bar to show progress through the test
            progBarWidth = 0.9433; // was 7.69 for test phase with 10 dummy stimuli and three test
            moveTestProgressBar();
            // Update the audioStimHeader to reflect progress through test
            document.getElementById("audioStimHeader").innerHTML = "Press 'PLAY' to hear training sound 2 of 6.";
            document.getElementById("progressBarHeader").innerHTML = "Listening to training sounds...";
            blinkMsg();
//            alert("presCounter: " + presCounter + ". fileName:" + fileName +
//                    ". testSlotCounter:" + testSlotCounter + ". trainingStage:" +
//                    trainingStage + "total no of stims = " + jsPresOrderArray.length);
        } else if (oldAudioSrc.src === fileDir + "10045.mp3") {

            fileName = "10042.mp3";
            newAudioSrc.src = fileDir + fileName;                // changing the src of the audio element
            presCounter++;                                       // increment presCounter
            newAudioSrc.load();                                  // loading the new file ready for playing


            // Update the progress bar to show progress through the test
            progBarWidth = (0.9433 * presCounter);
            moveTestProgressBar();
            // Update the audioStimHeader to reflect progress through test
            document.getElementById("audioStimHeader").innerHTML = "Press 'PLAY' to hear training sound 3 of 6.";
            document.getElementById("audioStimInstruction").innerHTML = "Please ensure the volume is at a comfortable level.";
            blinkMsg();
//                        alert("presCounter: " + presCounter + ". fileName:" + fileName +
//                    ". testSlotCounter:" + testSlotCounter + ". trainingStage:" +
//                    trainingStage + "total no of stims = " + jsPresOrderArray.length);
        } else if (oldAudioSrc.src === fileDir + "10042.mp3") {

            fileName = "10021.mp3";
            newAudioSrc.src = fileDir + fileName;                // changing the src of the audio element
            presCounter++;                                       // increment presCounter
            newAudioSrc.load();                                  // loading the new file ready for playing

 
            // Update the progress bar to show progress through the test
            progBarWidth = (0.9433 * presCounter);
            moveTestProgressBar();
            // Update the audioStimHeader to reflect progress through test
            document.getElementById("audioStimHeader").innerHTML = "Press 'PLAY' to hear training sound 4 of 6.";
            document.getElementById("audioStimInstruction").innerHTML = "Listening to training sounds...";
            blinkMsg();
//                        alert("presCounter: " + presCounter + ". fileName:" + fileName +
//                    ". testSlotCounter:" + testSlotCounter + ". trainingStage:" +
//                    trainingStage + "total no of stims = " + jsPresOrderArray.length);
        } else if (oldAudioSrc.src === fileDir + "10021.mp3") {

            fileName = "10056.mp3";
            newAudioSrc.src = fileDir + fileName;                // changing the src of the audio element
            presCounter++;                                       // increment presCounter
            newAudioSrc.load();                                  // loading the new file ready for playing

 
            // Update the progress bar to show progress through the test
            progBarWidth = (0.9433 * presCounter);
            moveTestProgressBar();
            // Update the audioStimHeader to reflect progress through test
            document.getElementById("audioStimHeader").innerHTML = "Press 'PLAY' to hear training sound 5 of 6.";
            document.getElementById("audioStimInstruction").innerHTML = "Please ensure the volume is at a comfortable level.";
            blinkMsg();
//                        alert("presCounter: " + presCounter + ". fileName:" + fileName +
//                    ". testSlotCounter:" + testSlotCounter + ". trainingStage:" +
//                    trainingStage + "total no of stims = " + jsPresOrderArray.length);
        } else if (oldAudioSrc.src === fileDir + "10056.mp3") {

            fileName = "10080.mp3";
            newAudioSrc.src = fileDir + fileName;                // changing the src of the audio element
            presCounter++;                                       // increment presCounter
            newAudioSrc.load();                                  // loading the new file ready for playing
            //trainingStage = false;                               // this is the final training stimulus, so flip this boolean


            // Update the progress bar to show progress through the test
            progBarWidth = (0.9433 * presCounter);
            moveTestProgressBar();
            // Update the audioStimHeader to reflect progress through test
            document.getElementById("audioStimHeader").innerHTML = "This is the FINAL training sound.";
            document.getElementById("audioStimInstruction").innerHTML = "Please ensure the volume is at a comfortable level.";
            blinkMsg();
//                        alert("presCounter: " + presCounter + ". fileName:" + fileName +
//                    ". testSlotCounter:" + testSlotCounter + ". trainingStage:" +
//                    trainingStage + "total no of stims = " + jsPresOrderArray.length);
        }
        
    } else { // if trainingStage is false, then load the next stimulus from the jsPresOrderArray[] array
        
        if (testSlotCounter === 1) {
            
            //passVal_train(jsSubject_ID, fileName, likertScore, timesPlayed, presCounter); // first pass the scores for final train stim
            //timesPlayed = 0; // zero this in preparation for the next stimulus
            //presCounter++; // increment presCounter
        
            // Update the audioStimHeader to reflect progress through test
            document.getElementById("progressBarHeader").innerHTML = "You are now listening to sounds for the main experiment.";
            document.getElementById("audioStimHeader").innerHTML = "Press 'PLAY' to hear experiment sound " +
                    testSlotCounter + " of " + (jsPresOrderArray.length - 1) + ".";
            document.getElementById("audioStimInstruction").innerHTML = "Please do not use the browser 'Back' button.";
            blinkMsg();
            // Update the progress bar to show progress through the test
            //progBarWidth = (0.9433 * presCounter);
            //moveTestProgressBar();
        } //else {
            
            //passVal_test(jsSubject_ID, fileName, likertScore, timesPlayed, testSlotCounter); // first pass the scores for final train stim
            //timesPlayed = 0; // zero this in preparation for the next stimulus
            //presCounter++; // increment presCounter
            
            
        //}
        

        
        // if there are still slots in the jsPresOrderArray[] array that haven't been presented
        if (testSlotCounter < jsPresOrderArray.length) {
            fileName = jsPresOrderArray[testSlotCounter];        // select the name of the next file to be loaded
            newAudioSrc.src = fileDir + fileName + ".mp3"; // changing the src of the audio element
            newAudioSrc.load();                                  // loading the new file ready for playing
            // Update the audioStimHeader to reflect progress through test
            document.getElementById("audioStimHeader").innerHTML = "Press 'PLAY' to hear experiment sound " +
                    testSlotCounter + " of " + (jsPresOrderArray.length - 1) + ".";
            blinkMsg();
//                        alert("presCounter: " + presCounter + ". fileName:" + fileName +
//                    ". testSlotCounter:" + testSlotCounter + ". trainingStage:" +
//                    trainingStage + "total no of stims = " + jsPresOrderArray.length);
// 
            // Update the progress bar to show progress through the test
            presCounter++; // increment presCounter
            progBarWidth = (0.9433 * presCounter);
            moveTestProgressBar();

            testSlotCounter++;                                   // increment testSlotCounter

        } else {
            // Update the progress bar to show progress through the test
            progBarWidth = 100;
            moveTestProgressBar();
//                        alert("presCounter: " + presCounter + ". fileName:" + fileName +
//                    ". testSlotCounter:" + testSlotCounter + ". trainingStage:" +
//                    trainingStage + "total no of stims = " + jsPresOrderArray.length);
            // if we've got to the end of the jsPresOrderArray[] array
            // Then we've presented all the stimuli we want to present.
            // Time to tidy up and go home.

            //passVal_test(jsSubject_ID, fileName, likertScore, timesPlayed, testSlotCounter); // pass values for the final stim
            sayThankYou();
            //passVal(); // pass the test values to the server
        }
    }
    stimulusPlayed = false; // reset the boolean to prepare for new stimulus
}

/****************************************************************/
/************ PASS JAVASCRIPT ARRAY DATA TO PHP *****************/
/****************************************************************/

function passVal_train(id, stim, result, timesPlayed, instance_no) {
    
    var ar = {'resultsArray[]': [id, stim, result, timesPlayed, instance_no]};
    
    //alert("resultsArray[0] is: " + ar[0] + ". resultsArray[1] is: " + ar[1] + ". resultsArray[2] is: " + ar[2]);
    //alert("id is: " + id + ". stim is: " + stim + ". result is: " + result +
    //        "timesPlayed is: " + timesPlayed + ". instance_no is: " + instance_no);
    
        // top answer here was very useful: 
    // https://stackoverflow.com/questions/5571646/how-to-pass-a-javascript-array-via-jquery-post-so-that-all-its-contents-are-acce
    
    // ftp://f129615@ftp.d1099601.cp.blacknight.com/webspace/httpdocs/listeningtest.eu/EXP3/php/EXP3_postToServer.php

    //(page you're sending data to, data you're sending, function to perform on the data the page sends back)
    $.post("http://www.listeningtest.eu/EXP3/php/EXP3_postData_train.php", ar, function (data, status) { // sends the array we've created to the postToServer.php page
        alert(data.firstSlot + ", " + data.secondSlot + ", " + status); // throws an alert on the original html page
    }, "json");
}

function passVal_test(id, stim, result, timesPlayed, instance_no) {
    
    var ar = {'resultsArray[]': [id, stim, result, timesPlayed, instance_no]};
    
    //alert("resultsArray[0] is: " + ar[0] + ". resultsArray[1] is: " + ar[1] + ". resultsArray[2] is: " + ar[2]);
    //alert("id is: " + id + ". stim is: " + stim + ". result is: " + result +
    //        "timesPlayed is: " + timesPlayed + ". instance_no is: " + instance_no);
    
        // top answer here was very useful: 
    // https://stackoverflow.com/questions/5571646/how-to-pass-a-javascript-array-via-jquery-post-so-that-all-its-contents-are-acce
    
    // ftp://f129615@ftp.d1099601.cp.blacknight.com/webspace/httpdocs/listeningtest.eu/EXP3/php/EXP3_postToServer.php

    //(page you're sending data to, data you're sending, function to perform on the data the page sends back)
    $.post("http://www.listeningtest.eu/EXP3/php/EXP3_postData_test.php", ar, function (data, status) { // sends the array we've created to the postToServer.php page
        alert(data.firstSlot + ", " + data.secondSlot + ", " + status); // throws an alert on the original html page
    }, "json");
}

function passVal() { // declares a function to pass javascript arrays to php

    /*
     * 
     * NOTE:- sendJStophp.html & testingJstoPhp.html are the originals of this.
     * testingJstoPhp.php & simple.php have the server side (php)
     *   
     * top answer here was very useful: 
     * https://stackoverflow.com/questions/5571646/how-to-pass-a-javascript-array-via-jquery-post-so-that-all-its-contents-are-acce
     * 
     */

    // This is the syntax for a standard array - see files mentioned above for 
    // associative array syntax

    // TO BE ADDED AS OF FRI AUG 18TH - timesPlayedArray scores
    // TO BE ADDED AS OF FRI AUG 18TH - loop through these assignments??

    var slot0 = subjectStimOrderArray[0];
    var slot1 = subjectStimScoreArray[0];
    var slot2 = subjectStimOrderArray[1];
    var slot3 = subjectStimScoreArray[1];
    var slot4 = subjectStimOrderArray[2];
    var slot5 = subjectStimScoreArray[2];
    var slot6 = subjectStimOrderArray[3];
    var slot7 = subjectStimScoreArray[3];
    var slot8 = subjectStimOrderArray[4];
    var slot9 = subjectStimScoreArray[4];
    var slot10 = subjectStimOrderArray[5];
    var slot11 = subjectStimScoreArray[5];
    var slot12 = subjectStimOrderArray[6];
    var slot13 = subjectStimScoreArray[6];
    var slot14 = subjectStimOrderArray[7];
    var slot15 = subjectStimScoreArray[7];
    var slot16 = subjectStimOrderArray[8];
    var slot17 = subjectStimScoreArray[8];
    var slot18 = subjectStimOrderArray[9];
    var slot19 = subjectStimScoreArray[9];
    var slot20 = subjectStimOrderArray[10];
    var slot21 = subjectStimScoreArray[10];
    var slot22 = subjectStimOrderArray[11];
    var slot23 = subjectStimScoreArray[11];
    var slot24 = subjectStimOrderArray[12];
    var slot25 = subjectStimScoreArray[12];
    var slot26 = subjectStimOrderArray[13];
    var slot27 = subjectStimScoreArray[13];
    var slot28 = subjectStimOrderArray[14];
    var slot29 = subjectStimScoreArray[14];
    var slot30 = subjectStimOrderArray[15];
    var slot31 = subjectStimScoreArray[15];
    var slot32 = subjectStimOrderArray[16];
    var slot33 = subjectStimScoreArray[16];
    var slot34 = subjectStimOrderArray[17];
    var slot35 = subjectStimScoreArray[17];
    var slot36 = subjectStimOrderArray[18];
    var slot37 = subjectStimScoreArray[18];
    var slot38 = subjectStimOrderArray[19];
    var slot39 = subjectStimScoreArray[19];
    var slot40 = subjectStimOrderArray[20];
    var slot41 = subjectStimScoreArray[20];
    var slot42 = subjectStimOrderArray[21];
    var slot43 = subjectStimScoreArray[21];
    var slot44 = subjectStimOrderArray[22];
    var slot45 = subjectStimScoreArray[22];
    var slot46 = subjectStimOrderArray[23];
    var slot47 = subjectStimScoreArray[23];
    var slot48 = subjectStimOrderArray[24];
    var slot49 = subjectStimScoreArray[24];
    var slot50 = subjectStimOrderArray[25];
    var slot51 = subjectStimScoreArray[25];
    var slot52 = subjectStimOrderArray[26];
    var slot53 = subjectStimScoreArray[26];
    var slot54 = subjectStimOrderArray[27];
    var slot55 = subjectStimScoreArray[27];
    var slot56 = subjectStimOrderArray[28];
    var slot57 = subjectStimScoreArray[28];
    var slot58 = subjectStimOrderArray[29];
    var slot59 = subjectStimScoreArray[29];
    var slot60 = subjectStimOrderArray[30];
    var slot61 = subjectStimScoreArray[30];
    var slot62 = subjectStimOrderArray[31];
    var slot63 = subjectStimScoreArray[31];
    var slot64 = subjectStimOrderArray[32];
    var slot65 = subjectStimScoreArray[32];
    var slot66 = subjectStimOrderArray[33];
    var slot67 = subjectStimScoreArray[33];
    var slot68 = subjectStimOrderArray[34];
    var slot69 = subjectStimScoreArray[34];
    var slot70 = subjectStimOrderArray[35];
    var slot71 = subjectStimScoreArray[35];
    var slot72 = subjectStimOrderArray[36];
    var slot73 = subjectStimScoreArray[36];
    var slot74 = subjectStimOrderArray[37];
    var slot75 = subjectStimScoreArray[37];
    var slot76 = subjectStimOrderArray[38];
    var slot77 = subjectStimScoreArray[38];
    var slot78 = subjectStimOrderArray[39];
    var slot79 = subjectStimScoreArray[39];
    var slot80 = subjectStimOrderArray[40];
    var slot81 = subjectStimScoreArray[40];
    var slot82 = subjectStimOrderArray[41];
    var slot83 = subjectStimScoreArray[41];
    var slot84 = subjectStimOrderArray[42];
    var slot85 = subjectStimScoreArray[42];    
    var slot86 = subjectStimOrderArray[43];
    var slot87 = subjectStimScoreArray[43];
    var slot88 = subjectStimOrderArray[44];
    var slot89 = subjectStimScoreArray[44];
    var slot90 = subjectStimOrderArray[45];
    var slot91 = subjectStimScoreArray[45];
    var slot92 = subjectStimOrderArray[46];
    var slot93 = subjectStimScoreArray[46];
    var slot94 = subjectStimOrderArray[47];
    var slot95 = subjectStimScoreArray[47];
    var slot96 = subjectStimOrderArray[48];
    var slot97 = subjectStimScoreArray[48];
    var slot98 = subjectStimOrderArray[49];
    var slot99 = subjectStimScoreArray[49];    
    var slot100 = subjectStimOrderArray[50];
    var slot101 = subjectStimScoreArray[50];
    var slot102 = subjectStimOrderArray[51];
    var slot103 = subjectStimScoreArray[51];
    var slot104 = subjectStimOrderArray[52];
    var slot105 = subjectStimScoreArray[52];
    
    var slot106 = subjectStimOrderArray[53];
    var slot107 = subjectStimScoreArray[53];
    var slot108 = subjectStimOrderArray[54];
    var slot109 = subjectStimScoreArray[54];
    var slot110 = subjectStimOrderArray[55];
    var slot111 = subjectStimScoreArray[55];
    var slot112 = subjectStimOrderArray[56];
    var slot113 = subjectStimScoreArray[56];
    var slot114 = subjectStimOrderArray[57];
    var slot115 = subjectStimScoreArray[57];
    var slot116 = subjectStimOrderArray[58];
    var slot117 = subjectStimScoreArray[58];
    var slot118 = subjectStimOrderArray[59];
    var slot119 = subjectStimScoreArray[59];    
    var slot120 = subjectStimOrderArray[60];
    var slot121 = subjectStimScoreArray[60];
    var slot122 = subjectStimOrderArray[61];
    var slot123 = subjectStimScoreArray[61];
    var slot124 = subjectStimOrderArray[62];
    var slot125 = subjectStimScoreArray[62];
    
    var slot126 = subjectStimOrderArray[63];
    var slot127 = subjectStimScoreArray[63];
    var slot128 = subjectStimOrderArray[64];
    var slot129 = subjectStimScoreArray[64];
    var slot130 = subjectStimOrderArray[65];
    var slot131 = subjectStimScoreArray[65];
    var slot132 = subjectStimOrderArray[66];
    var slot133 = subjectStimScoreArray[66];
    var slot134 = subjectStimOrderArray[67];
    var slot135 = subjectStimScoreArray[67];
    var slot136 = subjectStimOrderArray[68];
    var slot137 = subjectStimScoreArray[68];
    var slot138 = subjectStimOrderArray[69];
    var slot139 = subjectStimScoreArray[69];    
    var slot140 = subjectStimOrderArray[70];
    var slot141 = subjectStimScoreArray[70];
    var slot142 = subjectStimOrderArray[71];
    var slot143 = subjectStimScoreArray[71];
    var slot144 = subjectStimOrderArray[72];
    var slot145 = subjectStimScoreArray[72];
    
    var slot146 = subjectStimOrderArray[73];
    var slot147 = subjectStimScoreArray[73];
    var slot148 = subjectStimOrderArray[74];
    var slot149 = subjectStimScoreArray[74];
    var slot150 = subjectStimOrderArray[75];
    var slot151 = subjectStimScoreArray[75];
    var slot152 = subjectStimOrderArray[76];
    var slot153 = subjectStimScoreArray[76];
    var slot154 = subjectStimOrderArray[77];
    var slot155 = subjectStimScoreArray[77];
    var slot156 = subjectStimOrderArray[78];
    var slot157 = subjectStimScoreArray[78];
    var slot158 = subjectStimOrderArray[79];
    var slot159 = subjectStimScoreArray[79];    
    var slot160 = subjectStimOrderArray[80];
    var slot161 = subjectStimScoreArray[80];
    var slot162 = subjectStimOrderArray[81];
    var slot163 = subjectStimScoreArray[81];
    var slot164 = subjectStimOrderArray[82];
    var slot165 = subjectStimScoreArray[82];
    
    var slot166 = subjectStimOrderArray[83];
    var slot167 = subjectStimScoreArray[83];
    var slot168 = subjectStimOrderArray[84];
    var slot169 = subjectStimScoreArray[84];
    var slot170 = subjectStimOrderArray[85];
    var slot171 = subjectStimScoreArray[85];
    var slot172 = subjectStimOrderArray[86];
    var slot173 = subjectStimScoreArray[86];
    var slot174 = subjectStimOrderArray[87];
    var slot175 = subjectStimScoreArray[87];
    var slot176 = subjectStimOrderArray[88];
    var slot177 = subjectStimScoreArray[88];
    var slot178 = subjectStimOrderArray[89];
    var slot179 = subjectStimScoreArray[89];    
    var slot180 = subjectStimOrderArray[90];
    var slot181 = subjectStimScoreArray[90];
    var slot182 = subjectStimOrderArray[91];
    var slot183 = subjectStimScoreArray[91];
    var slot184 = subjectStimOrderArray[92];
    var slot185 = subjectStimScoreArray[92];
    
    var slot186 = subjectStimOrderArray[93];
    var slot187 = subjectStimScoreArray[93];
    var slot188 = subjectStimOrderArray[94];
    var slot189 = subjectStimScoreArray[94];
    var slot190 = subjectStimOrderArray[95];
    var slot191 = subjectStimScoreArray[95];
    var slot192 = subjectStimOrderArray[96];
    var slot193 = subjectStimScoreArray[96];
    var slot194 = subjectStimOrderArray[97];
    var slot195 = subjectStimScoreArray[97];
    var slot196 = subjectStimOrderArray[98];
    var slot197 = subjectStimScoreArray[98];
    var slot198 = subjectStimOrderArray[99];
    var slot199 = subjectStimScoreArray[99];    
    var slot200 = subjectStimOrderArray[100];
    var slot201 = subjectStimScoreArray[100];
    var slot202 = subjectStimOrderArray[101];
    var slot203 = subjectStimScoreArray[101];
    var slot204 = subjectStimOrderArray[102];
    var slot205 = subjectStimScoreArray[102];
    var slot206 = subjectStimOrderArray[103];
    var slot207 = subjectStimScoreArray[103];
    var slot208 = subjectStimOrderArray[104];
    var slot209 = subjectStimScoreArray[104];
    var slot210 = subjectStimOrderArray[105];
    var slot211 = subjectStimScoreArray[105];
    
    
    var slot212 = timesPlayedArray[0];
    var slot213 = timesPlayedArray[1];
    var slot214 = timesPlayedArray[2];
    var slot215 = timesPlayedArray[3];
    var slot216 = timesPlayedArray[4];
    var slot217 = timesPlayedArray[5];
    var slot218 = timesPlayedArray[6];
    var slot219 = timesPlayedArray[7];
    var slot220 = timesPlayedArray[8];
    var slot221 = timesPlayedArray[9];
    var slot222 = timesPlayedArray[10];
    var slot223 = timesPlayedArray[11];
    var slot224 = timesPlayedArray[12];
    var slot225 = timesPlayedArray[13];
    var slot226 = timesPlayedArray[14];
    var slot227 = timesPlayedArray[15];
    var slot228 = timesPlayedArray[16];
    var slot229 = timesPlayedArray[17];
    var slot230 = timesPlayedArray[18];
    var slot231 = timesPlayedArray[19];
    var slot232 = timesPlayedArray[20];
    var slot233 = timesPlayedArray[21];
    var slot234 = timesPlayedArray[22];
    var slot235 = timesPlayedArray[23];
    var slot236 = timesPlayedArray[24];
    var slot237 = timesPlayedArray[25];
    var slot238 = timesPlayedArray[26];
    var slot239 = timesPlayedArray[27];
    var slot240 = timesPlayedArray[28];
    var slot241 = timesPlayedArray[29];
    var slot242 = timesPlayedArray[30];
    var slot243 = timesPlayedArray[31];
    var slot244 = timesPlayedArray[32];
    var slot245 = timesPlayedArray[33];
    var slot246 = timesPlayedArray[34];
    var slot247 = timesPlayedArray[35];
    var slot248 = timesPlayedArray[36];
    var slot249 = timesPlayedArray[37];
    var slot250 = timesPlayedArray[38];
    var slot251 = timesPlayedArray[39];
    var slot252 = timesPlayedArray[40];
    var slot253 = timesPlayedArray[41];
    var slot254 = timesPlayedArray[42];
    
    var slot255 = timesPlayedArray[43];
    var slot256 = timesPlayedArray[44];
    var slot257 = timesPlayedArray[45];
    var slot258 = timesPlayedArray[46];
    var slot259 = timesPlayedArray[47];
    var slot260 = timesPlayedArray[48];
    var slot261 = timesPlayedArray[49];
    var slot262 = timesPlayedArray[50];
    var slot263 = timesPlayedArray[51];
    var slot264 = timesPlayedArray[52];
  
    var slot265 = timesPlayedArray[53];
    var slot266 = timesPlayedArray[54];
    var slot267 = timesPlayedArray[55];
    var slot268 = timesPlayedArray[56];
    var slot269 = timesPlayedArray[57];
    var slot270 = timesPlayedArray[58];
    var slot271 = timesPlayedArray[59];
    var slot272 = timesPlayedArray[60];
    var slot273 = timesPlayedArray[61];
    var slot274 = timesPlayedArray[62];
    
    var slot275 = timesPlayedArray[63];
    var slot276 = timesPlayedArray[64];
    var slot277 = timesPlayedArray[65];
    var slot278 = timesPlayedArray[66];
    var slot279 = timesPlayedArray[67];
    var slot280 = timesPlayedArray[68];
    var slot281 = timesPlayedArray[69];
    var slot282 = timesPlayedArray[70];
    var slot283 = timesPlayedArray[71];
    var slot284 = timesPlayedArray[72];
    
    var slot285 = timesPlayedArray[73];
    var slot286 = timesPlayedArray[74];
    var slot287 = timesPlayedArray[75];
    var slot288 = timesPlayedArray[76];
    var slot289 = timesPlayedArray[77];
    var slot290 = timesPlayedArray[78];
    var slot291 = timesPlayedArray[79];
    var slot292 = timesPlayedArray[80];
    var slot293 = timesPlayedArray[81];
    var slot294 = timesPlayedArray[82];
    
    var slot295 = timesPlayedArray[83];
    var slot296 = timesPlayedArray[84];
    var slot297 = timesPlayedArray[85];
    var slot298 = timesPlayedArray[86];
    var slot299 = timesPlayedArray[87];
    var slot300 = timesPlayedArray[88];
    var slot301 = timesPlayedArray[89];
    var slot302 = timesPlayedArray[90];
    var slot303 = timesPlayedArray[91];
    var slot304 = timesPlayedArray[92];
   
    var slot305 = timesPlayedArray[93];
    var slot306 = timesPlayedArray[94];
    var slot307 = timesPlayedArray[95];
    var slot308 = timesPlayedArray[96];
    var slot309 = timesPlayedArray[97];
    var slot310 = timesPlayedArray[98];
    var slot311 = timesPlayedArray[99];
    var slot312 = timesPlayedArray[100];
    var slot313 = timesPlayedArray[101];
    var slot314 = timesPlayedArray[102];
    var slot315 = timesPlayedArray[103];
    var slot316 = timesPlayedArray[104];
    var slot317 = timesPlayedArray[105];

    var ar = {'resultsArray[]': [jsSubject_ID, 
            slot0, slot1, slot2, slot3, slot4, 
            slot5, slot6, slot7, slot8, slot9, 
            slot10, slot11, slot12, slot13, slot14, slot15, slot16, slot17, slot18, slot19, 
            slot20, slot21, slot22, slot23, slot24, slot25, slot26, slot27, slot28, slot29, 
            slot30, slot31, slot32, slot33, slot34, slot35, slot36, slot37, slot38, slot39, 
            slot40, slot41, slot42, slot43, slot44, slot45, slot46, slot47, slot48, slot49, 
            slot50, slot51, slot52, slot53, slot54, slot55, slot56, slot57, slot58, slot59, 
            slot60, slot61, slot62, slot63, slot64, slot65, slot66, slot67, slot68, slot69, 
            slot70, slot71, slot72, slot73, slot74, slot75, slot76, slot77, slot78, slot79, 
            slot80, slot81, slot82, slot83, slot84, slot85, slot86, slot87, slot88, slot89, 
            slot90, slot91, slot92, slot93, slot94, slot95, slot96, slot97, slot98, slot99, 
            slot100, slot101, slot102, slot103, slot104, slot105, slot106, slot107, slot108, slot109,
            slot110, slot111, slot112, slot113, slot114, slot115, slot116, slot117, slot118, slot119, 
            slot120, slot121, slot122, slot123, slot124, slot125, slot126, slot127, slot128, slot129, 
            slot130, slot131, slot132, slot133, slot134, slot135, slot136, slot137, slot138, slot139, 
            slot140, slot141, slot142, slot143, slot144, slot145, slot146, slot147, slot148, slot149, 
            slot150, slot151, slot152, slot153, slot154, slot155, slot156, slot157, slot158, slot159, 
            slot160, slot161, slot162, slot163, slot164, slot165, slot166, slot167, slot168, slot169, 
            slot170, slot171, slot172, slot173, slot174, slot175, slot176, slot177, slot178, slot179, 
            slot180, slot181, slot182, slot183, slot184, slot185, slot186, slot187, slot188, slot189, 
            slot190, slot191, slot192, slot193, slot194, slot195, slot196, slot197, slot198, slot199, 
            slot200, slot201, slot202, slot203, slot204, slot205, slot206, slot207, slot208, slot209, 
            slot210, slot211, slot212, slot213, slot214, slot215, slot216, slot217, slot218, slot219, 
            slot220, slot221, slot222, slot223, slot224, slot225, slot226, slot227, slot228, slot229, 
            slot230, slot231, slot232, slot233, slot234, slot235, slot236, slot237, slot238, slot239, 
            slot240, slot241, slot242, slot243, slot244, slot245, slot246, slot247, slot248, slot249, 
            slot250, slot251, slot252, slot253, slot254, slot255, slot256, slot257, slot258, slot259, 
            slot260, slot261, slot262, slot263, slot264, slot265, slot266, slot267, slot268, slot269, 
            slot270, slot271, slot272, slot273, slot274, slot275, slot276, slot277, slot278, slot279, 
            slot280, slot281, slot282, slot283, slot284, slot285, slot286, slot287, slot288, slot289, 
            slot290, slot291, slot292, slot293, slot294, slot295, slot296, slot297, slot298, slot299, 
            slot300, slot301, slot302, slot303, slot304, slot305, slot306, slot307, slot308, slot309, 
            slot310, slot311, slot312, slot313, slot314, slot315, slot316, slot317]};

    // top answer here was very useful: 
    // https://stackoverflow.com/questions/5571646/how-to-pass-a-javascript-array-via-jquery-post-so-that-all-its-contents-are-acce

    //(page you're sending data to, data you're sending, function to perform on the data the page sends back)
    $.post("/php/postToServer.php", ar, function (data, status) { // sends the array we've created to the postToServer.php page
        alert(data.firstSlot + ", " + data.secondSlot + ", " + status); // throws an alert on the original html page
    }, "json");

    // Flip appearance to thank yous
    sayThankYou();
}

/****************************************************************/
/******************** MOVE PROGRESS BAR *************************/
/****************************************************************/

function moveTestProgressBar() {
    var elem = document.getElementById("testProgressBar");
    progBarWidth = Math.round(progBarWidth);

    var id = setInterval(frame, 10);
    function frame() {
        if (progBarWidth >= 100) {
            clearInterval(id);
        } else {

            elem.style.width = progBarWidth + '%';
            elem.innerHTML = progBarWidth * 1 + '%';
        }
    }
}

/****************************************************************/
/************************* SAY THANKS ***************************/
/****************************************************************/

function sayThankYou() {
    // Flip appearance to thank yous
    document.getElementById('audioStimContainer').style.display = "none"; // vanish the play button, Likert scale etc
    document.getElementById('modalPage1Btn').style.display = "none"; // vanish the instructions button
    document.getElementById('testPageHeadline').innerHTML = "Thank you!";
    document.getElementById('stimPageHead1').innerHTML = "You have completed the listening experiment. " +
            "Thank you for your time!";
    document.getElementById('stimPageHead2').innerHTML = "If you'd like to know more about " +
            "the results of the research, please drop me a line at the email address below";
    document.getElementById('stimPageHead3').innerHTML = "bill.coleman[AT]xperi[DOT]com";
    document.getElementById('ack').style.visibility = "visible";
    document.getElementById('ircLogothanks').style.visibility = "visible";
    document.getElementById('fgbgh3').style.display = "none"; // vanish the handy reference
    document.getElementById('fgbgul').style.display = "none";

}