    function CheckInput(mess){
                var customAlert = document.createElement("div");
                customAlert.className = "custom-alert";
                customAlert.innerHTML = mess;
    
                var closeButton = document.createElement("span");
                closeButton.innerHTML = "X"; 
                closeButton.className = "close-button";
                closeButton.addEventListener("click", function() {
                    customAlert.style.display = "none";
                });
                customAlert.appendChild(closeButton);
    
                document.body.appendChild(customAlert);
    
                event.preventDefault(); 
    }


    