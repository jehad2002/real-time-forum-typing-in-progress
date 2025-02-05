import { createPostElement, createPostButton, formPost } from './components/postComponent.js';

document.addEventListener('DOMContentLoaded', (e) => {
    const buttonPostForm = document.getElementById('openPostForm');
    const postForum = document.getElementById('formPost');
    const postContent = document.querySelector('.profile-create-post')
    if (buttonPostForm) {
        buttonPostForm.addEventListener('click', function () {
            console.log('test getcontentpost');
            
            postForum.style.display = 'block';
            postContent.style.display = 'none';
        });
    }
});

function toggleCheckboxDropdown() {
    var dropdownContent = document.getElementById("checkbox-dropdown-content");
    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
}


/*/
function handleCheckboxChange(checkbox) {
    var checkboxes = document.querySelectorAll('input[name="categorieChecked"]');
    var isChecked = false;

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            isChecked = true;
            break;
        }
    }

    if (!isChecked) {
alert("Please select at least one category.");
        checkbox.checked = true; 
    }
}
/*/
export function handleCheckboxChange() {
    var selectedItems = [];
    var selectedLabel = [];
    var ItemsInput = document.getElementById("checkbox-dropdown-content");
    var checkboxes = ItemsInput.querySelectorAll("label");
    //console.log('checkboxes:', checkboxes);
    checkboxes.forEach(function (checkbox) {
        if (checkbox.querySelector("input").checked) {
            selectedItems.push(checkbox.querySelector("input").value);
            selectedLabel.push({ 'Libelle': checkbox.textContent, 'Icon': checkbox.nextElementSibling.textContent })
        }
    });
    return [selectedItems, selectedLabel]
}
// end script js categories

export function checkToUploadText() {
    const openUpload = document.getElementById('openUploadImVid');
    const textPost = document.getElementById('postText');
    const uploadContainer = document.querySelector('.UploadImVid');
    const fileInput = document.getElementById('fileInput');
    const contentTextarea = document.querySelector('#textareaField');
    const containerImage = document.querySelector('.preview-container');
    const openCheckCategories = document.getElementById('openCheckCategories');
    if (openUpload) {
        openUpload.addEventListener('click', () => {
            if (!fileInput.value) {
                uploadContainer.style.display = 'block';
            }
            postText.style.borderBottom = "1px solid lightgray";
            openUpload.style.borderBottom = "3px solid blue";
            contentTextarea.style.display = 'none'
            contentTextarea.style.marginBottum = '5em';
            openCheckCategories.style.borderBottom = "1px solid lightgray";
        });
    }
    if (textPost) {
        textPost.addEventListener('click', () => {
            postText.style.borderBottom = "3px solid blue";
            openUpload.style.borderBottom = "1px solid lightgray";
            openCheckCategories.style.borderBottom = "1px solid lightgray";
            uploadContainer.style.display = 'none';
            contentTextarea.style.display = 'block';
            //papaDiv.lastChild.style.display = 'none';
        });
    }

    if (openCheckCategories) {
        openCheckCategories.addEventListener('click', () => {
            openCheckCategories.style.borderBottom = "3px solid blue";
            openUpload.style.borderBottom = "1px solid lightgray";
            uploadContainer.style.display = 'none';
            postText.style.borderBottom = "1px solid lightgray";
            toggleCheckboxDropdown()
            //papaDiv.lastChild.style.display = 'none';
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', () => {
            ImageVideoDisplay()
            // previewContainer.appendChild(previewElement);
            // previewContainer.appendChild(deleteButton);

            // papaDiv.appendChild(previewContainer);
            // uploadContainer.style.display = 'none';

            //fileInput.addEventListener('change', function() {

            //});
        });

    }

    document.querySelectorAll(".checkbox-dropdown-content label").forEach((element) => {
        element.querySelector("input").addEventListener('change', (e) => {
            e.preventDefault();
            document.getElementById("checkbox-dropdown-content").style.display = "block";
        });
    })
    //getContentPost()
    cancelFormButton();
}
// ###################" End script post form"


// ################ Beginning of Post form cancel button

function cancelFormButton() {
    const postFormButtonCancel = document.getElementsByClassName('cancelPostForm')[0];
    const postForm = document.getElementById('formPost');
    //const openPostFormButton = document.getElementsByClassName('profile-create-post')[0];
    if (postFormButtonCancel) {
        postFormButtonCancel.addEventListener('click', () => {
            postForm.style.display = 'none';
            //openPostFormButton.style.display = 'flex';
            document.getElementById('openPostForm').parentNode.style.display = 'flex'
            //postForm.parentNode.replaceChild(createPostButton(),postForm)
        })
    }

}
// #############" End script Post form cancel button"

function checkToUplioadImageVideo() {
    var contentTextareaa = document.querySelector('#textareaField');
    var imagevideoLink = document.getElementById("openUploadImVid");
    var postSpan = document.getElementById("postText");
    imagevideoLink.addEventListener("click", function (event) {
        event.preventDefault();
        postSpan.style.borderBottom = "1px solid lightgray";
        imagevideoLink.style.borderBottom = "3px solid blue";
        contentTextareaa.style.height = '5em';
        ImageVideoDisplay()
    });
    //stylizePostElements();
}

function checkToUploadCategories() {
    var categoriesElement = document.querySelector('check-categories')
    if (categoriesElement) {
        categoriesElement.addEventListener('click', () => {
            categoriesElement.style.borderBottom = "3px solid blue";
        })
    }
}

function stylizePostElements() {
    var postLink = document.getElementById("postLink");
    var imagevideoLinkked = document.getElementById("imagevideoLink");
    var imagevideoLink = document.getElementById("openUploadImVid");
    var contentTextareaa = document.querySelector('#textareaField');
    var postSpan = document.getElementById("postText");
    postSpan.addEventListener("click", function (event) {
        event.preventDefault();
        imagevideoLink.style.borderBottom = "1px solid lightgray";
        postSpan.style.borderBottom = "3px solid blue";
        contentTextareaa.style.height = '25em';
    });

    postLink.addEventListener("click", function (event) {
        event.preventDefault();
        postSpan.style.borderBottom = "3px solid blue";
    });

    imagevideoLinkked.addEventListener("click", function (event) {
        event.preventDefault();
        checkToUplioadImageVideo();
        imagevideoLink.style.borderBottom = "3px solid blue";
        imagevideoLinkked.nextElementSibling.addEventListener('click', (e) => {
            toggleCheckboxDropdown()
        })
    });
}

function ImageVideoDisplay() {
    const papaDiv = document.querySelector('.contentPost');
    const uploadContainer = document.querySelector('.UploadImVid');
    const selectedFiles = fileInput.files;
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';

    const file = selectedFiles[0];
    const fileType = file.type.split('/')[0];
    const previewElement = document.createElement('div');
    previewElement.className = 'preview-item';

    if (fileType === 'image') {
        const image = document.createElement('img');
        image.src = URL.createObjectURL(file);
        image.className = 'testImage';
        previewElement.appendChild(image);
    } else if (fileType === 'video') {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.controls = true;
        video.className = 'testVideo';
        previewElement.appendChild(video);
    }

    var deleteButton = createDeleteButton()
    deleteButton.addEventListener('click', () => {
        const fileInput = document.getElementById('fileInput');
        fileInput.value = ''; 
        previewContainer.remove();
        uploadContainer.style.display = 'block';
    });
    previewContainer.appendChild(previewElement);
    previewContainer.appendChild(deleteButton);
    papaDiv.appendChild(previewContainer);
    uploadContainer.style.display = 'none';
}

function createDeleteButton() {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.style.backgroundColor = '#f20d0df7';
    deleteButton.style.border = 'solid 1px darkviolet';
    deleteButton.style.borderRadius = '15%';
    deleteButton.style.color = 'white';
    deleteButton.style.padding = '8px 16px';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.transition = 'background-color 0.3s, border-color 0.3s';
    return deleteButton
}

// export function getContentPost() {
//     const buttonSubmitFormPrincial = document.getElementById('buttonSubmitFormPrincial');
//     buttonSubmitFormPrincial.addEventListener('click', () => {
//         var titlePost = document.querySelector('.titlePost input')
//         var contentPost = document.querySelector('.contentPost textarea')
//         var fileInput = document.querySelector('.UploadImVid input')
//         //var userId = document.getElementById('useID').textContent
//         console.log(titlePost, contentPost, fileInput.files[0], handleCheckboxChange());
//         var metadata = {
//             'UserId': Number(document.getElementById('userID').textContent),
//             'Status': 'on',
//             'UserName': document.querySelector('.username').textContent,
//             'Name': document.querySelector('.username').textContent,
//             'Date': FormatDate(new Date()),
//             'Title': titlePost.value,
//             'Categories': handleCheckboxChange()[1],
//             'Category': handleCheckboxChange()[0],
//             'Content': contentPost.value,
//             'ImagePath': '',
//             'VideoPath': "",
//             'IsLike': false,
//             'Likes': '',
//             'DisLikes': '',
//             'IsDisLike': false,
//             'PostId': 0,
//             'Comments': ""
//         };
//         var datas = {
//             'Action':'chat',
//             'Data': metadata
//         }
//         socketSend(titlePost, contentPost, fileInput, datas)
//     })
// }
// var socket;
// export const socketConnect = (func) => {
//     //alert('in process to connect ...')
//     socket = new WebSocket("ws://localhost:8888/ws");
//     console.log(socket);
//     socket.onopen = function () {
//         //alert('Status : You CONNECTED')
//     };
//     var element
//     socket.onmessage = function (e) {
//         var data = JSON.parse(e.data);
//         console.log(data)
//         handleMessage(data)
//     };

// }

// function handleMessage(datas) {
//     if (datas.Action == "createPost") {
//         var data = datas.Data
//         element = func(data)
//         const formPost = document.getElementById('formPost');
//         if (data.Title) {
//             document.getElementById('postContains').insertBefore(element, formPost.nextSibling);
//         }
//         document.getElementById('openPostForm').parentNode.style.display = 'flex';
//         formPost.style.display = 'none';
//     } else if (datas.Action=='chat') {
//         // var data = JSON.parse(e.data);
//         var data = datas.Data
//         console.log('data socket: ', data);
//         var element = chatElement(data)
//         const chatview = document.getElementById('chat-messages');
//         chatview.appendChild(element);
//     }
// }

function creatImagePath(fileInput) {
    var filename = fileInput.value.split('\\')[2]
    return filename;
}

// function socketSend(title, content, fileInput, metadata) {
//     var file = fileInput.files[0];
//     //var formData = new FormData();

//     //formData.append("uploadsFile", file);

//     socket.send(JSON.stringify(metadata));
//     // Ensuite, envoyer le fichier
//     //socket.send(formData);
//     title.value = '';
//     content.value = '';
//     fileInput.value = '';
// }

function uploadImage(fileInput) {
    if (fileInput.files && fileInput.files[0]) {
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append("uploadsFile", file);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/createpost", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log("The image has been uploaded successfully!");
            } else {
                console.error("Error during image upload:", xhr.statusText);
            }
        };
        xhr.send(formData);
    }
}


export function FormatDate(dbDate) {
    let currentTime = new Date();

    let diff = currentTime - dbDate;

    let formattedDate;
    if (diff / 3600000 > 24) {
        let days = Math.floor(diff / 86400000);
        formattedDate = `${days} day ago`;
    } else if (diff / 3600000 >= 1) {
        let hours = Math.floor(diff / 3600000);
        formattedDate = `${hours} h ago`;
    } else if (diff / 60000 >= 1) {
        let minutes = Math.floor(diff / 60000);
        formattedDate = `${minutes} mn ago`;
    } else {
        formattedDate = "Now";
    }

    return formattedDate;
}

