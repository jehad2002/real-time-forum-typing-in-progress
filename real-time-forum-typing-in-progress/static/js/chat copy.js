import { getContentChat } from './socket.js';
//document.addEventListener("DOMContentLoaded", function () {
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

    document.getElementById("sendmessage").querySelector("input").addEventListener("focus", function () {
        if (this.value == "Send message...") {
            this.value = "";
        }
    });

    document.getElementById("sendmessage").querySelector("input").addEventListener("focusout", function () {
        if (this.value == "") {
            this.value = "Send message...";
        }
    });
}
//});


export async function friendsChat() {
    document.querySelectorAll(".friend").forEach(function (friend) {
        friend.addEventListener("click", function (e) {
            e.preventDefault();
            // socketChatConnect();
            getContentChat(friend)
            var destinataire = friend.querySelector('p').lastElementChild.textContent
            fetchDataChat(destinataire, '0', 'true')
            console.log('hello', destinataire);
            var childOffset = friend.getBoundingClientRect();
            var parentOffset = friend.parentElement.parentElement.getBoundingClientRect();
            var childTop = childOffset.top - parentOffset.top;
            var clone = friend.querySelector("img").cloneNode(true);
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
            document.getElementById("close").addEventListener("click", function () {
                document.getElementById("chat-messages").classList.remove("animate");
                document.getElementById("profile").classList.remove("animate");
                document.querySelectorAll('.cx, .cy').forEach(function (el) {
                    el.classList.remove("s1", "s2", "s3");
                });

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

    document.getElementById('chat-messages').addEventListener('scroll', throttledScroll);
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
                element.parentNode.removeChild(element);
            }
        }
    }

    requestAnimationFrame(update);
}

export function chatElement(data) {
    var UserId = document.getElementById('userID').textContent
    var div = document.createElement('div');
    if (data.Expediteur==UserId) {
        div.classList.add('message', 'right')
    } else {
        div.classList.add('message')
    }
    div.innerHTML = `
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/${data.Expediteur}_copy.jpg" />
        <div class="bubble">
            ${data.Contenu}
            <div class="corner"></div>
            <span>${data.Date}</span>
        </div>
    `
    return div
}

function fetchDataChat(destinataire, index, firstLoad) {
    fetch('/recupChat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destinataire: destinataire, index: index, firstLoad: firstLoad }),
    })
        .then(response => response.json())
        .then(data => {
            loadChat(data, firstLoad);
        })
        .catch(error => {
            console.error('Error while fetching on chat:', error);
        
        });
}

function loadChat(data, firstLoad) {
    var content = document.getElementById('chat-messages');
    if (firstLoad === 'true') {
        content.innerHTML = '';
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

function loadMoreMessages() {
    var allMessages = document.querySelectorAll('.bubble');
    var index;
    if (allMessages) {
        index = allMessages.length - 1;
    }
    fetchDataChat(destinataire, index, false);
}
