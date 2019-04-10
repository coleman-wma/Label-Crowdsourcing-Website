/* --- MODAL STUFF --- */

// Get the modal
var modalPageJS1 = document.getElementById('modalPage1');
var modalPageJS2 = document.getElementById('modalPage2');
var modalPageJS3 = document.getElementById('modalPage3');

// Get the button that opens the modal
var btnModal1 = document.getElementById("modalPage1Btn");
var btnModal2 = document.getElementById("modalPage2Btn");
var btnModal3 = document.getElementById("modalPage3Btn");
var btnModalExit = document.getElementById("modalExit");

// Get the <span> element that closes the modal
var modalCloseSpan1 = document.getElementsByClassName("closeModal")[0];
var modalCloseSpan2 = document.getElementsByClassName("closeModal")[1];
var modalCloseSpan3 = document.getElementsByClassName("closeModal")[2];

// When the user clicks the button, open the modal 
btnModal1.onclick = function () {
    modalPageJS1.style.display = "block";
};

btnModal2.onclick = function () {
    modalPageJS1.style.display = "none";
    modalPageJS2.style.display = "block";
};

btnModal3.onclick = function () {
    modalPageJS2.style.display = "none";
    modalPageJS3.style.display = "block";
};

btnModalExit.onclick = function () {
    modalPageJS3.style.display = "none";
};

// When the user clicks on <span> (x), close the modal
modalCloseSpan1.onclick = function () {
    modalPageJS1.style.display = "none";
};

modalCloseSpan2.onclick = function () {
    modalPageJS2.style.display = "none";
};

modalCloseSpan3.onclick = function () {
    modalPageJS3.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === modalPageJS1) {
        modalPageJS1.style.display = "none";
    } else if (event.target === modalPageJS2) {
        modalPageJS2.style.display = "none";
    } else if (event.target === modalPageJS3) {
        modalPageJS3.style.display = "none";
    }
};

/****************************************************************/
/************* FLASH BG OF AUDIOSTIMHEADER MSG ******************/
/****************************************************************/

// following allows animation of this header to draw attention
// to progress through the test
// 
// Included it here because the target variable would be null otherwise
// (element not existing in the DOM if the script was in the header)

var target = document.getElementById("audioStimHeader");

// in order to retrigger the animation we need to change the class
// so, every time the animation ends we'll change the class name to
// the non-animated equivalent, then every time we want to animate,
// call blinkMsg(), which changes the class name, thus triggering the animation
target.addEventListener('animationend', function () {

    this.className = 'audioLabelText';

}, false);

function blinkMsg() {
    target.className = 'audioLabelFlash';
}
