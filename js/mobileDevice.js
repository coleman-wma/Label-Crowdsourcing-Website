var modalMobileClose = document.getElementsByClassName("closeModalMobile")[0];
var modalMobBtn = document.getElementById("modalMobileBtn");
var modalMobilePage = document.getElementById('modalMobile');
var devNotifier = document.getElementById("devTypeNo");
var usrAgStr = document.getElementById("userAgentStr");
var modalHearDefClose = document.getElementsByClassName("closeModalHearDef")[0];
var modalHearDefBtn = document.getElementById("modalHearDefBtn");
var modalHearDefPage = document.getElementById('modalHearDef');

function mobileCheck() {

    // check if user is on a mobile device, if so, warn them the site might not work
    // also take note of this on back end
    var isDevMobile;
    var str = navigator.userAgent;
    var chop = str.slice(0,255); // if shorter than 255 what happens here?
    var n = str.search("Mobi");
    if (n >= 0) {
        // launch a modal
        modalMobilePage.style.display = "block";
        // to send device type to back end
        isDevMobile = "Mobile";
    } else {
        isDevMobile = "Desktop";
    }
   
   devNotifier.value = isDevMobile;
   usrAgStr.value = chop;
}

// When the user clicks the exit button, close the modal 
modalMobBtn.onclick = function () {
    modalMobilePage.style.display = "none";
};

modalHearDefBtn.onclick = function () {
    modalHearDefPage.style.display = "none";
};


// When the user clicks on <span> (x), close the modal
modalMobileClose.onclick = function () {
    modalMobilePage.style.display = "none";
};

modalHearDefClose.onclick = function () {
    modalHearDefPage.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === modalMobilePage) {
        modalMobilePage.style.display = "none";
    }
};

window.onclick = function (event) {
    if (event.target === modalHearDefPage) {
        modalHearDefPage.style.display = "none";
    }
};

// listen for click on 'Yes' Hearing Deficiencies radio button
// Launches a modal talking to hearing def subjects
// https://stackoverflow.com/questions/8922002/attach-event-listener-through-javascript-to-radio-button

$(document).ready(function(){
    $('input[type=radio]').click(function(){
        if (this.id === "hearing_defY")
            modalHearDefPage.style.display = "block";
    });
});
