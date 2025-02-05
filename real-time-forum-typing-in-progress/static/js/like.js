function UpdateLike(like) {
    const contentLike = like.querySelector(".like i");
    const contentDisLike = like.querySelector(".dislike i");

    if (contentLike.classList.contains("fa-thumbs-o-up")) {
        let n = Number(like.querySelector(".likeNumber").textContent) + 1;
        like.querySelector(".likeNumber").textContent = n;
        like.querySelector(".like").style.backgroundColor = "green";
        like.querySelector(".like i").classList.remove("fa-thumbs-o-up");
        like.querySelector(".like i").classList.add("fa-thumbs-up");
    } else {
        let n = Number(like.querySelector(".likeNumber").textContent) - 1;
        like.querySelector(".likeNumber").textContent = n;
        like.querySelector(".like").style.backgroundColor = "white";
        contentLike.classList.remove("fa-thumbs-up");
        contentLike.classList.add("fa-thumbs-o-up");
    }

    if (contentDisLike.classList.contains("fa-thumbs-down")) {
        contentDisLike.classList.remove("fa-thumbs-down");
        contentDisLike.classList.add("fa-thumbs-o-down");
        like.querySelector(".dislike").style.backgroundColor = "white";
        let n = Number(like.querySelector(".dislikeNumber").textContent) - 1;
        like.querySelector(".dislikeNumber").textContent = n;
    }
}

function UpdateDisLike(dislike) {
    const contentDisLike = dislike.querySelector(".dislike i");
    const contentLike = dislike.querySelector(".like i");

    if (contentDisLike.classList.contains("fa-thumbs-o-down")) {
        let n = Number(dislike.querySelector(".dislikeNumber").textContent) + 1;
        dislike.querySelector(".dislikeNumber").textContent = n;
        dislike.querySelector(".dislike").style.backgroundColor = "rgb(175, 99, 99)";
        contentDisLike.classList.remove("fa-thumbs-o-down");
        contentDisLike.classList.add("fa-thumbs-down");
    } else {
        let n = Number(dislike.querySelector(".dislikeNumber").textContent) - 1;
        dislike.querySelector(".dislikeNumber").textContent = n;
        dislike.querySelector(".dislike").style.backgroundColor = "white";
        contentDisLike.classList.remove("fa-thumbs-down");
        contentDisLike.classList.add("fa-thumbs-o-down");
    }

    if (contentLike.classList.contains("fa-thumbs-up")) {
        contentLike.classList.remove("fa-thumbs-up");
        contentLike.classList.add("fa-thumbs-o-up");
        dislike.querySelector(".like").style.backgroundColor = "white";
        let n = Number(dislike.querySelector(".likeNumber").textContent) - 1;
        dislike.querySelector("span").textContent = n;
    }
}


function createInput(parent, commentId) {
    var postId = document.querySelector(".postId").textContent
    var replyFormHTML = `
        <div  class="reply-form">
            <div class="user-icon">
                <div class="user-circle" style="background-color: gray;">
                    <img src="" alt="" class="user-avatar" style="max-width: 60%; height: auto;">
                </div>
            </div>
            <form method="POST" action="/commentreply" class="open-popup" id="formreply">
                <input type="hidden" name="PostID" value="${postId}">
                <input type="hidden" class="commentId" name="parentID" value="${commentId}">
                <textarea class="comment-input" minlength="2" maxlength="1500" required id="textareaFielddreply"  name="content" placeholder="leave a comment" ></textarea>
                <button type="submit">reply</button>
            </form>
        </div>
    `;
    parent.innerHTML += replyFormHTML;
}


function comment(element, commentId) {
    document.querySelectorAll(element).forEach(comment => {
        comment.addEventListener("click", (e) => {
            e.preventDefault();
            // if (depht==1) {
            //     var parentComment = comment.parentNode.parentNode;
            // }else if (depht==2) {
            var parentComment = comment.parentNode.parentNode;
            // }
            var existingForm = parentComment.querySelector(".reply-form");
            if (existingForm) {
                parentComment.removeChild(existingForm);
            } 
        });
    });
}

document.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("fa-thumbs-up") || target.classList.contains("fa-thumbs-o-up") ||
        target.classList.contains("fa-thumbs-down") || target.classList.contains("fa-thumbs-o-down")) {
        const like = target.closest(".content-like-dislike");
        var flag = "post";
        if (target.parentNode.parentNode.classList.contains("react_to_comment")) {
            flag = "comment";
        }
        var etat
        if (target.parentNode.classList.contains("like")) {
            UpdateLike(like);
            etat = target.classList.contains("fa-thumbs-up") ? 1 : 0;
        } else {
            UpdateDisLike(like);
            etat = 3;
            if (target.classList.contains("fa-thumbs-down")) {
                etat = 2;
            }
        }
        const postId = parseInt(like.querySelector(".postId").textContent);
        const currentURL = window.location.href;
        const commentId = parseInt(like.querySelector(".commentId").textContent)
        if (flag == "post") {
            try {
                const response = await fetch("/actionpost", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        postId: postId,
                        commentId: commentId,
                        etat: etat
                    })
                });
                if (response.ok) {
                    console.log("Number of likes successfully updated.", currentURL);
                } else {
                    console.error("Error while updating the number of likes.");
                }
            } catch (error) {
                console.error("An error occurred: ", error);
            }
        } else if (flag == "comment") {
            try {
                const response = await fetch("/actioncomment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        postId: postId,
                        commentId: commentId,
                        etat: etat
                    })
                });

                if (response.ok) {
                    console.log("Number of likes successfully updated.", currentURL);
                } else {
                    console.error("Error updating the number of likes.");
                }
            } catch (error) {
                console.error("Une erreur s'est produite : ", error);
            }
        }
    } else if ((!e.target.classList.contains("reply-button")) && !e.target.closest(".reply-form") && !e.target.classList.contains("comment")) {
        document.querySelectorAll(".reply-form").forEach(form => {
            form.parentNode.removeChild(form);
        });
    }
    if (e.target.classList.contains("reply-button")) {
        var commentId = e.target.parentNode.querySelector(".commentId").textContent
        comment(".reply-button", commentId)
        ReplyAlert()
    } else if (e.target.classList.contains("comment")) {
        comment(".comment", 2)
    }
});


function CheckInput(mess) {
    var customAlert = document.createElement("div");
    customAlert.className = "custom-alert";
    customAlert.innerHTML = mess;

    var closeButton = document.createElement("span");
    closeButton.innerHTML = "X"; 
    closeButton.className = "close-button";
    closeButton.addEventListener("click", function () {
        customAlert.style.display = "none"; 
    });
    customAlert.appendChild(closeButton);

    document.body.appendChild(customAlert);

    event.preventDefault(); 
}

function ReplyAlert() {
    document.getElementById("formreply").addEventListener("submit", function (event) {
        var textarea = document.getElementById("textareaFielddreply").value;
        if (textarea.length > 1500 || textarea.length < 2) {
            CheckInput("respect the size of your response content");
        }
    });
}
