//document.addEventListener('DOMContentLoaded', 
export function displayMenuButton() {
    const menuButton = document.querySelector('.menu-button');
    const mobileCategoryList = document.querySelector('.mobile-menu .category-list');
    //console.log('isclicked');
    if (menuButton) {
        menuButton.addEventListener('click', () => {
            mobileCategoryList.classList.toggle('active');
            menuButton.classList.toggle('active');
        });
    }
}
//);

//$(document).ready(function () {
//    $(document).on("click", ".reply-button", function () {
//        var commentID = $(this).attr("data-comment-id");
//        var replyForm = $(".comment[data-comment-id='" + commentID + "']").find(".reply-form");
//        replyForm.toggleClass("hidden");
//    });
//});

const showInputButton = document.getElementById("show-input-button");
const popupInput = document.getElementById("popup-input");

//document.addEventListener("click", (e) => {
//    if (e.target.parentNode.classList.contains("search-bar") && e.target.classList.contains("active")) {
//        popupInput.style.display = "block";
//    }else{
//        popupInput.style.display = "none";
//    }
    
//});
window.addEventListener("resize", () => {
    if (window.innerWidth <= 420) {
        popupInput.style.display = "none";
    }
});

document.querySelectorAll('.category-link').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedCategory = link.getAttribute('data-category'); 
        document.querySelectorAll('.post-item').forEach((post) => {
            post.classList.add('hidden');
        });

        document.querySelectorAll(`.post-item[data-category="${selectedCategory}"]`).forEach((post) => {
            post.classList.remove('hidden');
        });
    });
});

const showRepliesButtons = document.querySelectorAll(".show-replies-button");

showRepliesButtons.forEach(button => {
    const parentComment = button.closest(".comment");
    const subCommentsList = parentComment.querySelector(".sub-comments");

    if (parentComment.nextElementSibling) {
        button.style.display = "inline-block";
        parentComment.nextElementSibling.style.display="none";
        button.addEventListener('click', (e)=>{
            if (!button.classList.contains("active")) {
                parentComment.nextElementSibling.style.display="block";
                button.classList.add('active');
                
            }else{
                parentComment.nextElementSibling.style.display="none";
                button.classList.remove('active');
            }
        });
    } else {
        button.style.display = "none";
    }
});


