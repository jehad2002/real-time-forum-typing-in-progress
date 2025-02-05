document.getElementById("open-popup").addEventListener("click", function () {
    document.getElementById("popup").style.display = "block";
    document.getElementById("popup-signup").style.display = "none"; 
    var checkConnexion = document.getElementById("checkConnexion").textContent
    if (checkConnexion==true) {
        document.getElementById("popup").style.display = "block";
        }
});

document.querySelector(".btn").addEventListener("click", ()=>{
    var checkConnexion = document.getElementById("checkConnexion").textContent
    if (checkConnexion==true) {
        document.getElementById("popup").style.display = "block";
        }
        console.log("test");
})


document.getElementById("close").addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
});

document.getElementById("cancel-login").addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
});

document.getElementById("open-popup-signup-link").addEventListener("click", function () {
    document.getElementById("popup-signup").style.display = "block";
    document.getElementById("popup").style.display = "none"; 
});

document.getElementById("open-popup-like").addEventListener("click", function () {
    document.getElementById("popup").style.display = "block";
    document.getElementById("popup-signup").style.display = "none"; 
});

document.addEventListener("DOMContentLoaded", (e)=> {
    var openPopupButtons = document.querySelectorAll(".open-popup");
    var checkConnexion = document.getElementById("checkConnexion");
    var checkRegister = document.getElementById("register-error");
    console.log("test",checkRegister.textContent);
    if (checkConnexion.textContent=="true") {
        document.getElementById("popup").style.display = "block";
        document.getElementById("login-error").style.display = "block";
        //checkConnexion.textContent="false"
    }else if (checkRegister.textContent.length!=54) {
        console.log("test",checkRegister.textContent);
        document.getElementById("popup-signup").style.display = "block";
        checkRegister.style.display = "block";
    }
    openPopupButtons.forEach(function(button) {
        button.addEventListener("click", function () {
            document.getElementById("popup").style.display = "block";
            document.getElementById("popup-signup").style.display = "none";
        });
    });
});


document.getElementById("open-popup-signup").addEventListener("click", function () {
    document.getElementById("popup-signup").style.display = "block";
    document.getElementById("popup").style.display = "none"; 
});

document.getElementById("close-signup").addEventListener("click", function () {
    document.getElementById("popup-signup").style.display = "none";
});

document.getElementById("cancel-signup").addEventListener("click", function () {
    document.getElementById("popup-signup").style.display = "none";
});

document.getElementById("open-popup-login").addEventListener("click", function () {
    document.getElementById("popup").style.display = "block";
    document.getElementById("popup-signup").style.display = "none"; 
});
