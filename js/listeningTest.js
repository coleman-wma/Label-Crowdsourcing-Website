/* 
 * 
 *     Created on : Aug 31, 2017
 *     REvised on : Apr 10, 2019
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

    // THESE NO LONGER NEEDED - values are pushed now when subject hits the 'submit' button
    // See likertValidation()
    //subjectStimOrderArray[presCounter] = fileName; // writes the number of the file being used to the subjectStimOrderArray array
    //subjectStimScoreArray[presCounter] = likertScore;    // was score????
    //timesPlayedArray[presCounter] = timesPlayed;   // writes the number of times this stimulus was played to the timesPlayedArray array

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
                    
                    // if we're still in training phase we log the score using passVal_train()
                    passVal_train(jsSubject_ID, fileName, likertScore, timesPlayed, presCounter); // first pass the scores just entered
                    timesPlayed = 0; // zero this in preparation for the next stimulus
                    
                    if (fileName === "10080.mp3") { // if this is the stimulus then...
                        trainingStage = false; // this is the final training stimulus, so flip this boolean                 
                    }
                                
                } else { // if we're not in training phase then we log score using passVal_test()
                    
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
        
        if (testSlotCounter === 1) { // checking if we're on the first test stimulus
                                     // bunch of stuff needs to be changed if we are...
        
            // Update the audioStimHeader to reflect progress through test
            document.getElementById("progressBarHeader").innerHTML = "You are now listening to sounds for the main experiment.";
            document.getElementById("audioStimHeader").innerHTML = "Press 'PLAY' to hear experiment sound " +
                    testSlotCounter + " of " + (jsPresOrderArray.length - 1) + ".";
            document.getElementById("audioStimInstruction").innerHTML = "Please do not use the browser 'Back' button.";
            blinkMsg();
        }
        

        
        // if there are still slots in the jsPresOrderArray[] array that haven't been presented
        if (testSlotCounter < jsPresOrderArray.length) {
            fileName = jsPresOrderArray[testSlotCounter];        // select the name of the next file to be loaded
            newAudioSrc.src = fileDir + fileName + ".mp3";       // changing the src of the audio element
            newAudioSrc.load();                                  // loading the new file ready for playing
            
            // Update the audioStimHeader to reflect progress through test
            document.getElementById("audioStimHeader").innerHTML = "Press 'PLAY' to hear experiment sound " +
                    testSlotCounter + " of " + (jsPresOrderArray.length - 1) + ".";
            blinkMsg();
            //                        
            //                        alert("presCounter: " + presCounter + ". fileName:" + fileName +
            //                    ". testSlotCounter:" + testSlotCounter + ". trainingStage:" +
            //                    trainingStage + "total no of stims = " + jsPresOrderArray.length);
            // 
            // 
            // Update the progress bar to show progress through the test
            presCounter++; // increment presCounter
            progBarWidth = (0.9433 * presCounter);
            moveTestProgressBar();

            testSlotCounter++;                                   // increment testSlotCounter

        } else { // what to do if we've loaded all the sounds
            
            // Update the progress bar to show progress through the test
            progBarWidth = 100;
            moveTestProgressBar();
//                        alert("presCounter: " + presCounter + ". fileName:" + fileName +
//                    ". testSlotCounter:" + testSlotCounter + ". trainingStage:" +
//                    trainingStage + "total no of stims = " + jsPresOrderArray.length);
// 
// if we've got to the end of the jsPresOrderArray[] array
            // Then we've presented all the stimuli we want to present.
            // Time to tidy up and go home.

            sayThankYou();

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