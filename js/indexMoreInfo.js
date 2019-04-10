var modalMoInfoPage = document.getElementById('modalMoreInfo');
var modalMoInfoBtn = document.getElementById("modalMoreInfoBtn");
var modalMoInfoClose = document.getElementsByClassName("closeModalMoreInfo")[0];
var modalMoInfoExitBtn = document.getElementById("modalMoreInfoExitBtn");

// When the user clicks the 'more information' button, open the modal 
modalMoInfoBtn.onclick = function () {
    modalMoInfoPage.style.display = "block";
};

// When the user clicks the exit button, close the modal 
modalMoInfoExitBtn.onclick = function () {
    modalMoInfoPage.style.display = "none";
};

// When the user clicks on <span> (x), close the modal
modalMoInfoClose.onclick = function () {
    modalMoInfoPage.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === modalMoInfoPage) {
        modalMoInfoPage.style.display = "none";
    }
};