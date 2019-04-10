/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 *     Created on : Jun 13, 2017, 8:34:13 AM
 *     Author     : William Coleman
 *     CUSTOM JAVASCRIPT AUDIO PLAYER - SEE: https://www.lynda.com/HTML-5-tutorials/HTML5-Video-and-Audio-in-Depth/80781-2.html
 */

/****************************************************************/
/******************** DECLARE VARIABLES *************************/
/****************************************************************/

$(document).ready(function () {

    // Stop if HTML5 video isn't supported
//  if (!document.createElement('video').canPlayType) {
//    $("#video_controls").hide();
//    return;
//  }

    var audio_player = document.getElementById("audioStimulus"); // name the audio element this in trainingPage.php

    //var duration = audio_player.duration; // Duration of audio clip

    // Play/Pause ============================//
    $("#play_button").bind("click", function () {
        audio_player.play();
    });

    $("#pause_button").bind("click", function () {
        audio_player.pause();
    });

    $("#play_toggle").bind("click", function () {
        if (audio_player.paused) {
            audio_player.play();
            $(this).html("Pause");
        } else {
            audio_player.pause();
            $(this).html("Play");
        }
    });

    // Play Progress ============================//
    $(audio_player).bind("timeupdate", function () {
        var timePercent = (this.currentTime / this.duration) * 100;
        $("#play_progress").css({width: timePercent + "%"});
    });


    // Reset on file end =======================//
    audio_player.addEventListener("ended", function () {
        $("#play_toggle").html("Play");
    });


});