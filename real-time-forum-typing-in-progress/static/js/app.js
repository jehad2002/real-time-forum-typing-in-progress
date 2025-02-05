import { createPostElement, createPostButton, formPost } from './components/postComponent.js';
import { createCategoryElement, createButtonCategoryElement } from './components/categoriesComponent.js';
import { createFooterElement } from './components/chatComponent.js';
import { createHeaderElement } from './components/headerComponent.js';
import { createLoginElement } from './components/loginComponent.js';  
import { createRegisterElement } from './components/registerComponent.js';  
import { createErrorPage } from './components/errorComponent.js';  
import { checkToUploadText } from './formpost.js';
import { displayMenuButton } from './index.js';
import { filterByCategories } from './filterCategories.js';
import { getContentPost, getContentComment, socketConnect, getContentChat, allElementPost } from './socket.js';
import { searchfieldFunc, friendsChat, windowWidth } from './chat.js';
import { createComment } from './components/commentComponent.js';  
var commentData = null;
var connectedUserName;
var connectedUserId;
var body = document.querySelector('body')

document.addEventListener("DOMContentLoaded", function () {
    if (window.location.href == "http://localhost:3000/") {
        checkSessionOnLoad();
    } else if (window.location.href !== "http://localhost:3000/comment") {
        fetch("/check_session")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                socketConnect(createPostElement);
                const url = new URL(window.location.href);
                const postId = Number(url.searchParams.get("postId"));
                fetchCommentPost(postId, data);
            } else {
            console.log('login page');
                loadLoginPage();
            }
        })
        .catch(error => {
            console.error("Error verifying session:", error);
        
        });
    } else {
        loadErrorPage();
    }
});

function loadErrorPage() {

    fetch("/404")
    .then(response => {
        if (response.ok) {
            return response.text(); 
        } else {
            throw new Error(`Erreur HTTP ${response.status}`);
        }
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Error during request:", error);
    
    });
    const errorContainer= document.createElement('div')
    errorContainer.id = 'login-error'
    createErrorPage(404, "Page Not Found", "The requested page could not be found.", errorContainer);
    return;
}

function handleLogout() {
    const logoutButton = document.querySelector("#logoutForm button");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            fetch("/logout", {
                method: "POST", 
            })
                .then(response => {
                    if (response.ok) {
                        var header = document.querySelector('header');
                        const mainContainerPost = document.querySelector('.main-container');
                        header.parentNode.removeChild(header)
                        mainContainerPost.parentNode.removeChild(mainContainerPost)
                        loadLoginPage()
                    }
                })
                .catch(error => {
                    console.error("Error during logout:", error);
                });
        });
    }
}

function backBtn() {
    document.querySelector('.logo').addEventListener('click', ()=>{
        var main = document.querySelector('.main-container')
        var header = document.querySelector('header')
        document.querySelector('body').removeChild(main)
        document.querySelector('body').removeChild(header)
        checkSessionOnLoad()
        changeRoute('/');
    })
}

function checkSessionOnLoad() {
    fetch("/check_session")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadContentPage(data, loadPosts)
            } else {
                loadLoginPage();
            }
        })
        .catch(error => {
            console.error("Error verifying session:", error);
            
            loadLoginPage();
        });
}

export function loadLoginPage() {
    const loginElement = createLoginElement();
    body.appendChild(loginElement);
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); 
        var username = getUserInfos()[0]
        var password = getUserInfos()[1]
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
                    body.removeChild(loginElement)
                    loadContentPage(data, loadPosts)
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
    const openPopupSignupLink = document.getElementById("open-popup-signup-link");
    if (openPopupSignupLink) {
        console.log("okokokoko")
        openPopupSignupLink.addEventListener("click", function (event) {
            event.preventDefault();
            if (loginElement) {
                body.removeChild(loginElement)
            }
            loadRegisterPage();
        });
    } else {
        console.log("errrrrr")
    }
}

function getUserInfos() {
    const usernameElement = document.getElementById("loginUsername");
    const passwordElement = document.getElementById("loginPassword");
    var username;
    var password;
    if (usernameElement) {
        username = usernameElement.value
    }
    if (passwordElement) {
        password = passwordElement.value
    }
    return [username, password]
}

function loadContentPage(data, func, isComment) {
    var main = document.createElement('main');
    main.classList.add('main-container');
    body.insertBefore(main, body.firstChild.nextSibling);

    const postContainer = document.createElement('section');
    postContainer.id = 'postContains';
    postContainer.classList.add("content");

    if (!isComment) {
        postContainer.appendChild(createPostButton(data.userID));
    }

    if (data.userID) {
        console.log('yessss');
        connectedUserName = data.name;
        connectedUserId = data.userID;
        createHeaderElement(data.name, data.userID, handleLogout);
    }
    backBtn()
    func(postContainer, data, main);

    loadCategories(postContainer, isComment);
    main.appendChild(postContainer);
}


export function loadRegisterPage() {
    const registerElement = createRegisterElement();
    body.appendChild(registerElement);
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault(); 
    
            const nameElement = document.querySelector('input[name="name"]');
            const usernameElement = document.querySelector('input[name="username"]');
            const emailElement = document.querySelector('input[name="email"]');
            const passwordElement = document.querySelector('input[name="password"]');
            const ageElement = document.querySelector('input[name="age"]');
            const genderElement = document.querySelector('select[name="gender"]');
            const firstNameElement = document.querySelector('input[name="first_name"]');
            const lastNameElement = document.querySelector('input[name="last_name"]');
    
            if (nameElement && usernameElement && emailElement && passwordElement && ageElement && genderElement && firstNameElement && lastNameElement) {
                const name = nameElement.value.trim();
                const username = usernameElement.value.trim();
                const email = emailElement.value.trim();
                const password = passwordElement.value;
                const age = parseInt(ageElement.value);
                const gender = genderElement.value;
                const firstName = firstNameElement.value.trim();
                const lastName = lastNameElement.value.trim();
    
                if (!username || !lastName || !name || !firstName || !email) {
                    const registerError = document.getElementById("register-error");
                    if (registerError) {
                        registerError.style.color = "red";
                        registerError.innerText = "The fields 'username', 'lastname' and 'name' must not contain spaces.";
                        
                        registerError.style.display = "block";
                    }
                }
    
                fetch("/register", {    
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ Name: name, Username: username, Email: email, Password: password, Age: age, Gender: gender, FirstName: firstName, LastName: lastName }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            const registerError = document.getElementById("register-error");
                            if (registerError) {
                                registerError.style.display = "block";
                                registerError.style.color = "green";
                                registerError.textContent = "Registration successful";
                                        }
                        } else {
                            const registerError = document.getElementById("register-error");
                            if (registerError) {
                                registerError.style.color = "red";
                                registerError.innerHTML = "Error while registering: " + data.message;
                                
                                registerError.style.display = "block";
                            }
                        }
                    })
                    .catch(error => {
                        console.error("Error sending request:", error);
                            });
            } else {
                const registerError = document.getElementById("register-error");
                if (registerError) {
                    registerError.innerText = "Please do not change my ID";
                        registerError.style.display = "block";
                }
            }
        });
    }
    

    const openPopupLoginLink = document.getElementById("open-popup-login");
    if (openPopupLoginLink) {
        openPopupLoginLink.addEventListener("click", function (event) {
            event.preventDefault();
            if (registerElement) {
                body.removeChild(registerElement)
            }
            loadLoginPage();
        });
    }
}

const logoutForm = document.getElementById("logoutForm");

if (logoutForm) {
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
}

var allposts;

function loadPosts(postContainer, data) {
    fetch("/get_all_posts")
        .then(response => response.json())
        .then(posts => {
            allposts = posts
            updatePageContent(posts, postContainer);
            socketConnect(createPostElement);
            filterByCategories();
            displayMenuButton();
        })
        .catch(error => console.error("Error retrieving posts:", error));
    }

function loadCategories(postcontainer, isComment) {
    fetch("/get_asside_content")
        .then(response => response.json())
        .then(assideContent => {
            updateCategories(assideContent.Cat, postcontainer, isComment);
            updateFooter(assideContent.Use); 
            searchfieldFunc()
            friendsChat(getContentChat)
        })
        .catch(error => console.error("Error retrieving categories:", error));
    }

var allPostElement
function updatePageContent(posts,postContainer) {
    allPostElement = []
    var main = document.querySelector('main');
    allposts.forEach(post => {
        const postElement = createPostElement(post);
        allPostElement.push(postElement)
        postContainer.appendChild(postElement);
        main.appendChild(postContainer)
        main.insertBefore(postContainer, main.firstChild.nextSibling)
    });
    listenCommentButton(posts)
    //socketConnect(createPostElement);
}

function listenCommentButton(posts) {
    var currentPosts
    if (allPostElement) {
        currentPosts = allPostElement
    }else{
        currentPosts = allElementPost
    }
    console.log('allpost   ', allElementPost);
    currentPosts.forEach(postElement => {
        const commentButton = postElement.querySelector('.comment');

        if (commentButton) {
            commentButton.addEventListener('click', function (event) {
                event.preventDefault();
                console.log(commentButton.id);
                fetchCommentPost(Number(commentButton.id))
            });
        }
    });
}

export function fetchCommentPost(postId, datas) {
    if (postId > 0) {
        fetch("/commentpost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ postId: postId }),
        })
            .then(response => response.json())
            .then(data => {
                if (data[0].PostId) {
                    changeRoute(`/comment?postId=${postId}`);
                    //createHeaderElement(datas.name, datas.userID, handleLogout);
                    //createCommentSection(data)
                    //loadCategories();
                    if (datas) {
                        data.name = datas.name
                        data.userID = datas.userID
                    }
                    console.log(data);
                    if (document.querySelector('.main-container')) {
                        body.removeChild(document.querySelector('.main-container'))
                    }
                    loadContentPage(data, createCommentSection, true)
                    
                }else{
                    loadErrorPage();
                }
                //socketConnect(createCommentSection);
            })
            .catch(error => {
                console.error('Error sending request:', error);
                        });
    } else {
        loadErrorPage();
    }
}

function changeRoute(newRoute) {
    history.pushState(null, null, newRoute);
}

function updateCategories(categories, postContainer, isComment) {
    const categoriesContainer = document.createElement('aside');
    categoriesContainer.classList.add('categories', 'categoriesSection');
    const categoryElement = document.createElement('ul');
    categoryElement.classList.add('category-list');

    const categoriesArray = Array.isArray(categories) ? categories : [categories];

    if (windowWidth <= 768) {
        var btn = createButtonCategoryElement();
        btn.style.top = '40px';
        categoriesContainer.classList.remove('categories');
        categoriesContainer.classList.add('mobile-menu');
        categoriesContainer.appendChild(btn);
        categoryElement.style.marginTop = '-1em';
    } else {
        categoriesContainer.classList.remove('mobile-menu');
    }

    categoriesArray.forEach(category => {
        categoryElement.appendChild(createCategoryElement(category));
    });

    categoriesContainer.appendChild(categoryElement);

    document.querySelector('main').insertBefore(categoriesContainer, postContainer);

    if (!isComment) {
        var createPostButton = postContainer.querySelector('.profile-create-post');
        if (postContainer && createPostButton) {
            postContainer.insertBefore(formPost(categories), createPostButton.nextSibling);
        }
    }

    checkBtnCreatePost(postContainer);
}


function updateFooter(users) {
    createFooterElement(users);
}

function checkBtnCreatePost(postContainer) {
    const buttonPostForm = postContainer.querySelector('.create_post');
    console.log('Here is the post container');
    if (buttonPostForm) {
        console.log('Retrieving the create post button');
        //console.log(buttonPostForm);
        buttonPostForm.addEventListener('click', function () {
            const formPost = postContainer.querySelector('.formPost');
            buttonPostForm.parentNode.style.display = 'none';
            formPost.style.display = 'block';
            checkToUploadText()
            getContentPost()
        });
    }
}

export function createCommentSection(postContainer, comments, main) {
    if (comments && Array.isArray(comments) && comments.length > 0) {
        comments.forEach(comment => {
           createComment(comment, postContainer, main);
        });
    } else {
        console.error("The variable 'comments' is empty or not an array.");
                const emptyPostElement = document.createElement('div');
        emptyPostElement.innerHTML = "No comments available.";
                postContainer.appendChild(emptyPostElement);
    }
    getContentComment()
}
