export async function searchfieldFunc() {
    console.log('test');
    var preloadbg = document.createElement("img");
    preloadbg.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/timeline1.png";
    
    document.getElementById("searchfield").addEventListener("focus", function () {
        if (this.value == "Search contacts...") {
            this.value = "";
        }
    });
    
    document.getElementById("searchfield").addEventListener("focusout", function () {
        if (this.value == "") {
            this.value = "Search contacts...";
        }
    });
    
    document.getElementById("sendmessage").querySelector("input").addEventListener("keydown", function(e) {
        if (e.key === 'Enter' && this.value.trim() !== "") {
            sendMessage(this.value.trim());
            this.value = ''; 
        }
    });
    
    
    document.getElementById("sendmessage").querySelector("input").addEventListener("focusout", function () {
        if (this.value == "") {
            this.value = "Send message...";
        }
    });
}
//});

export var destinataire;
export var windowWidth;

export async function friendsChat(func) {
    document.querySelectorAll(".friend").forEach(function (friend) {
        friend.addEventListener("click", function (e) {
            console.log("amy", friend.id);
            e.preventDefault();
            destinataire = friend.id;
            func(friend, destinataire);
            fetchDataChat(destinataire, '0', 'true');
            console.log('hello', destinataire);
            var childOffset = friend.getBoundingClientRect();
            var parentOffset = friend.parentElement.parentElement.getBoundingClientRect();
            var childTop = childOffset.top - parentOffset.top;
            var clone = friend.querySelector("img").cloneNode(true);
            //var clone = friend.querySelector("img");
            var top = childTop + 12 + "px";

            clone.style.top = top;
            clone.classList.add("floatingImg");

            setTimeout(function () {
                document.getElementById("profile").querySelector("p").classList.add("animate");
                document.getElementById("profile").classList.add("animate");
            }, 100);

            setTimeout(function () {
                document.getElementById("chat-messages").classList.add("animate");
                document.querySelectorAll('.cx, .cy').forEach(function (el) {
                    el.classList.add('s1');
                });
                setTimeout(function () {
                    document.querySelectorAll('.cx, .cy').forEach(function (el) {
                        el.classList.add('s2');
                    });
                }, 100);
                setTimeout(function () {
                    document.querySelectorAll('.cx, .cy').forEach(function (el) {
                        el.classList.add('s3');
                    });
                }, 200);
            }, 150);

            animateElement(clone, {
                width: 68,
                left: 140,
                top: 20
            }, 200, false);

            document.getElementById("chatbox").appendChild(clone);

            var name = friend.querySelector("p strong").innerHTML;
            var email = friend.querySelector("p span").innerHTML;
            document.getElementById("profile").querySelector("p").innerHTML = name;
            document.getElementById("profile").querySelector("span").innerHTML = email;

            document.querySelectorAll(".message:not(.right) img").forEach(function (img) {
                img.src = clone.src;
            });

            document.getElementById("friendslist").style.display = "none";
            document.getElementById("chatview").style.display = "block";

            //document.getElementById("close").removeEventListener("click", (e)=>{
            //    e.preventDefault();
            //});

            readMsg(friend)
            document.getElementById("close").addEventListener("click", function () {
                document.getElementById("chat-messages").classList.remove("animate");
                document.getElementById("profile").classList.remove("animate");
                document.querySelectorAll('.cx, .cy').forEach(function (el) {
                    el.classList.remove("s1", "s2", "s3");
                });
                readMsg(friend)
                animateElement(clone, {
                    width: 40,
                    left: 12,
                    top: top
                }, 200, true);

                setTimeout(function () {
                    document.getElementById("chatview").style.display = "none";
                    document.getElementById("friendslist").style.display = "flex";
                }, 50);
            });
            //document.getElementById('chat-messages').addEventListener('scroll', throttledScroll);
        });
    });
    handleResize();
    document.getElementById('chat-messages').addEventListener('scroll', throttledScroll);
}

function readMsg(friend) {
    var notificationIcon = friend.querySelector('.notification-icon')
   
    if (notificationIcon) {
        notificationIcon.remove();
        var dest = parseInt( destinataire) ; 
        console.log("dest",dest)
        var exp= parseInt (document.getElementById("userID").textContent)
        console.log("exp",exp)
        var requestData = {
            userId: exp,
            senderId: dest
        };

    
        fetch(`/close-chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update messages status');
                }
                return response.json();
            })
            .then(data => {
            })
            .catch(error => {
                console.error('Error updating messages status:', error);
            });
    }
}

function animateElement(element, properties, duration, shouldRemove) {
    const start = {};
    const changes = {};
    const startTime = performance.now();

    for (const prop in properties) {
        start[prop] = parseFloat(element.style[prop]) || 0;
        changes[prop] = properties[prop] - start[prop];
    }
    function update() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / duration);

        for (const prop in changes) {
            element.style[prop] = start[prop] + changes[prop] * progress + 'px';
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (shouldRemove) {
                console.log('element.parentNode ', element);
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }
        }
    }

    requestAnimationFrame(update);
}

export function chatElement(data) {
    var UserId = document.getElementById('userID').textContent
    var div = document.createElement('div');

    if (data.Expediteur == UserId) {
        div.classList.add('message', 'right', 'sender'); 
    } else {
        div.classList.add('message', 'receiver'); 
    }

    console.log("aD;LK", data.Date)
    div.innerHTML = `
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/${data.Expediteur}_copy.jpg" />
        <div class="bubble">
            ${data.Contenu}
            <div class="corner"></div>
            <span>${data.Date}</span>
        </div>
    `;

    return div;
}


function fetchDataChat(destinataire, index, firstLoad) {

    fetch('/recupChat', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destinataire: destinataire, firstLoad: firstLoad, index: index }),
    })
        .then(response => response.json())
        .then(data => {
            loadChat(data, firstLoad);
            var scrollToBottom = false;
            if (firstLoad === true) {
                scrollToBottom = true;
            }

            if (scrollToBottom) {
                content.scrollTop = content.scrollHeight;
            }
        })
        .catch(error => {
            console.error('Error during the fetch request on chat:', error);
        });
}

function loadChat(data, firstLoad) {
    var content = document.getElementById('chat-messages');
    var scrollToBottom = false;

    if (firstLoad === 'true') {
        content.innerHTML = '';
        scrollToBottom = true;
    }

    const keys = Object.keys(data);
    for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i];
        const label = document.createElement('label');
        label.textContent = key;

        if (Object.hasOwnProperty.call(data, key)) {
            const messages = data[key];
            for (let index = 0; index < messages.length; index++) {
                content.insertBefore(chatElement(messages[index]), content.firstElementChild);
            }
            content.insertBefore(label, content.firstElementChild);
        }
    }


    if (scrollToBottom) {
        content.scrollTop = content.scrollHeight;
    }

}

function throttle(func, wait) {
    let timeout;

    return function () {
        const context = this;
        const args = arguments;

        if (!timeout) {
            timeout = setTimeout(function () {
                func.apply(context, args);
                timeout = null;
            }, wait);
        }
    };
}

function checkScroll() {
    const content = document.getElementById('chat-messages');

    if (content.scrollTop === 0) {
        loadMoreMessages();
    }
}

const throttledScroll = throttle(checkScroll, 200);


function displayChatContent() {
    if (document.getElementById('chatbtn')) {
        document.getElementById('chatbtn').addEventListener('click', (e) => {
            var chatbox = document.getElementById('chatbox');
            var mainContainer = document.querySelector('.main-container');
            
            if (!chatbox || !mainContainer) return; // Ensure elements exist before proceeding

            // Adjust layout when chat button is clicked
            chatbox.style.top = '50px';
            mainContainer.style.marginTop = '45em'; // Adjust as needed
            chatbox.style.display = 'block';
            console.log('Chat content displayed successfully');
        });
    }
}


function resetChatContent(windowWidth) {
    var mainContainer = document.querySelector('.main-container');
    var chatbox = document.getElementById('chatbox');
    
    // Check if the elements exist
    if (!mainContainer || !chatbox) {
        console.log('Required elements not found!');
        return;
    }

    if (windowWidth <= 768) {
        // For mobile devices
        mainContainer.style.marginTop = '7em'; // Adjust based on your design
        chatbox.style.top = '50px'; // Adjust position based on mobile design
    } else if (windowWidth > 768 && windowWidth <= 1024) {
        // For tablets
        mainContainer.style.marginTop = '4em';
        chatbox.style.top = '90px'; // Adjust according to tablet layout
    } else {
        // For desktops
        mainContainer.style.marginTop = '90px';
        chatbox.style.top = '0px'; // No offset for desktop view
    }

    // Ensure search bar is visible for larger screens
    document.querySelector('.seachbar').style.display = 'flex';
    document.getElementById('chatbtn').style.display = 'none'; // Hide the chat button on desktop
    console.log('Resetting the chat content...');
}


function handleResize() {
    windowWidth = window.innerWidth;
    var btn = document.querySelector('.menu-button');
    var main = document.querySelector('.main-container');
    
    if (windowWidth <= 768) {
        // For mobile views, hide search bar and show the chat button
        document.querySelector('.seachbar').style.display = 'none';
        document.getElementById('chatbtn').style.display = 'block';
        main.style.marginTop = '7em'; // Adjust top margin for mobile view

        if (btn) {
            btn.style.top = '40px'; // Position menu button accordingly
        }
        
        displayChatContent(); // Ensure chat content button is set up
    } else {
        resetChatContent(windowWidth); // Adjust for desktop/tablet
    }
}

window.addEventListener('resize', handleResize);


function loadMoreMessages() {
    var allMessages = document.querySelectorAll('.bubble');
    var index;
    if (allMessages) {
        index = allMessages.length - 1;
    }

    fetchDataChat(destinataire, (index + 1).toString(), 'false');
}
function sendMessage(messageContent) {
    const requestData = {
        destinataire: destinataire,
        content: messageContent,
        senderId: document.getElementById("userID").textContent
    };

    fetch('/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Message sent successfully!");
            loadChat(data, 'false'); 
        } else {
            console.error("Error sending message:", data.error);
        }
    })
    .catch(error => {
        console.error("Network error while sending message:", error);
    });
}