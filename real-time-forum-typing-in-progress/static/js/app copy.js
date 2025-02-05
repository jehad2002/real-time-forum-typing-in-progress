import { createPostElement, createPostButton, formPost } from './components/postComponent.js';
import { createCategoryElement } from './components/categoriesComponent.js';
import { createFooterElement } from './components/footerComponent.js';
import { createHeaderElement } from './components/headerComponent.js';
import { createLoginElement } from './components/loginComponent.js'; 
import { checkToUploadText, socketConnect } from './formpost.js';

document.addEventListener("DOMContentLoaded", function () {
    checkSessionOnLoad();
});

function checkSessionOnLoad() {
    fetch("/check_session")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const loginSection = document.getElementById("loginSection");
                if (loginSection) {
                    loginSection.innerHTML = "";
                }
                const postContainer = document.getElementById("postContains");
                postContainer.innerHTML = "";
                postContainer.appendChild(createPostButton())


                loadPosts();
                loadCategories();
                createHeaderElement(data.name,data.userID);
            } else {
                loadLoginPage();
            }
        })
        .catch(error => {
            console.error("Error verifying session:", error);
                        loadLoginPage();
        });
}

function loadLoginPage() {
    const loginElement = createLoginElement();

    const mainContainer = document.getElementById("loginSection");
    mainContainer.innerHTML = "";
    mainContainer.appendChild(loginElement);

    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); 

        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const loginSection = document.getElementById("loginSection");
                    if (loginSection) {
                        loginSection.innerHTML = "";
                    }

                    const postContainer = document.getElementById("postContains");
                    postContainer.innerHTML = "";
                    postContainer.appendChild(createPostButton())

                    loadPosts();
                    loadCategories();

                    createHeaderElement(data.name,data.userID);
                } else {
                    const loginError = document.getElementById("login-error");
                    if (loginError) {
                        loginError.style.display = "block";
                    }
                }
            })
            .catch(error => {
                console.error("Error while connecting:", error);
                        });
    });

}

const logoutForm = document.getElementById("logoutForm");

if (logoutForm) {
    //console.log("al")
    logoutForm.addEventListener("submit", function (event) {
        event.preventDefault();

        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    
                    loadLoginPage();
                } else {
                    console.error("Error while disconnecting:", data.message);  
                              }
            })
            .catch(error => {
                console.error("Error while disconnecting:", error);
                        });
    });
}else{
    //console.log("ei")
}

function loadPosts() {
    fetch("/get_all_posts")
        .then(response => response.json())
        .then(posts => {

            updatePageContent(posts);
        })
        .catch(error => console.error("Error retrieving posts:", error));
    }

function loadCategories() {
    updateFooter(); 
    fetch("/get_all_categories")
        .then(response => response.json())
        .then(categories => {
            updateCategories(categories);
        })
        .catch(error => console.error("Error retrieving categories:", error));
    }

function updatePageContent(posts) {
    const postContainer = document.getElementById("postContains");
    //const postContainer = document.getElementById("postsSection");
    //postContainer.innerHTML = "";
    //postContainer.appendChild(createPostButton())
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postContainer.appendChild(postElement);
    });
    var element = socketConnect(createPostElement);
    //const buttonPostForm = document.getElementById('openPostForm');
    //buttonPostForm.insertBefore(element, )
    if (element) {
        document.getElementById('postContains').insertBefore(element, document.querySelector('.profile-create-post').nextSibling);
    }
}

function updateCategories(categories) {
    //const categoriesContainer = document.getElementById("categoriesSection");
    const categoriesContainer = document.querySelector(".categoriesSection");
    categoriesContainer.innerHTML = "";

    const categoriesArray = Array.isArray(categories) ? categories : [categories];

    categoriesArray.forEach(category => {
        const categoryElement = createCategoryElement(category);
        categoriesContainer.appendChild(categoryElement);
    });
    document.getElementById('postContains').insertBefore(formPost(categories), document.querySelector('.profile-create-post').nextSibling);
    checkBtnCreatePost(categoriesArray)
}


function updateFooter() {
    createFooterElement();

}


function checkBtnCreatePost(categories) {
    const buttonPostForm = document.getElementById('openPostForm');
    if (buttonPostForm) {
        //console.log(buttonPostForm);
        buttonPostForm.addEventListener('click', function () {
            const formPost = document.getElementById('formPost');
            buttonPostForm.parentNode.style.display = 'none';
            formPost.style.display = 'block';
            checkToUploadText()
        });
    }
}