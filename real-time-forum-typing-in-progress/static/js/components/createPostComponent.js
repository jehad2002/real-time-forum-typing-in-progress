export function createPostForm() {
    const profileCreatePost = document.createElement("div");
    profileCreatePost.classList.add("profile-create-post");

    const profileImage = document.createElement("div");
    profileImage.classList.add("profile-image");

    profileImage.innerHTML = '<div class="circle"></div><div class="image-container"></div>';

    profileCreatePost.appendChild(profileImage);

    const inputBox = document.createElement("div");
    inputBox.classList.add("input-box");

    const inputText = document.createElement("input");
    inputText.classList.add("input-text");
    inputText.type = "text";
    inputText.value = "Let’s share what's going on your mind...";
    inputText.disabled = true;

    inputBox.appendChild(inputText);

    profileCreatePost.appendChild(inputBox);

    const createPostButton = document.createElement("button");
    createPostButton.classList.add("create_post", "open-popup");
    createPostButton.id = "openPostForm";
    createPostButton.style.display = "flex";
    createPostButton.style.flexDirection = "row";
    createPostButton.style.alignItems = "center";

    const createPostAnchor = document.createElement("a");
    createPostAnchor.classList.add("create-post-button");
    createPostAnchor.textContent = "Create Post";

    const plusIcon = document.createElement("i");
    plusIcon.classList.add("fa-solid", "fa-plus", "fa-beat", "fa-2xl");
    plusIcon.style.color = "red";

    createPostButton.appendChild(createPostAnchor);
    createPostButton.appendChild(plusIcon);

    profileCreatePost.appendChild(createPostButton);

    const formPost = document.createElement("form");
    formPost.action = "/createpost";
    
    formPost.id = "formPost";
    formPost.method = "post";
    formPost.enctype = "multipart/form-data";

    const postContain = document.createElement("div");
    postContain.classList.add("postContain");

    const cancelPostForm = document.createElement("span");
    cancelPostForm.classList.add("cancelPostForm");
    cancelPostForm.innerHTML = "&times;";

    const headPost = document.createElement("section");
    headPost.classList.add("headPost");

    const postText = createOptionPost("postText", "fas fa-pencil-alt", "Post", "3px solid blue");
    const openUploadImVid = createOptionPost("openUploadImVid", "fas fa-camera", "Image & Video", "1px solid lightgray");
    const checkCategories = createCheckCategories();

    headPost.appendChild(postText);
    headPost.appendChild(openUploadImVid);
    headPost.appendChild(checkCategories);

    const titlePost = document.createElement("section");

    const titleInput = document.createElement("input");
    titleInput.value = "";
    titleInput.type = "text";
    titleInput.minlength = "5";
    titleInput.maxlength = "100";
    titleInput.placeholder = "Title 100 caractere max";
    titleInput.name = "title";
    titleInput.id = "titleInput";
    titleInput.style.height = "40px";
    titleInput.style.borderRadius = "10px";
    titleInput.required = true;

    titlePost.appendChild(titleInput);

    const contentPost = document.createElement("section");

    const textareaField = document.createElement("textarea");
    textareaField.name = "content";
    textareaField.minlength = "5";
    textareaField.setAttribute("required", true);
    textareaField.maxlength = "1500";
    textareaField.id = "textareaField";
    textareaField.cols = "49";
    textareaField.rows = "14";
    textareaField.placeholder = "Write your message post  in minimum 5 and  1500 caractere max...";

    const uploadImVid = document.createElement("div");
    uploadImVid.classList.add("UploadImVid");

    const labelForFileInput = document.createElement("label");
    labelForFileInput.for = "fileInput";
    labelForFileInput.textContent = "Choose an image or video:";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "fileInput";
    fileInput.accept = "image/*, video/*";
    fileInput.name = "uploadsFile";

    contentPost.appendChild(textareaField);
    uploadImVid.appendChild(labelForFileInput);
    uploadImVid.appendChild(fileInput);
    contentPost.appendChild(uploadImVid);

    postContain.appendChild(cancelPostForm);
    postContain.appendChild(headPost);
    postContain.appendChild(titlePost);
    postContain.appendChild(contentPost);

    const flexDiv = document.createElement("div");
    flexDiv.style.display = "flex";

    const buttonSubmitFormPrincial = document.createElement("button");
    buttonSubmitFormPrincial.type = "submit";
    buttonSubmitFormPrincial.id = "buttonSubmitFormPrincial";
    buttonSubmitFormPrincial.textContent = "Create Post";

    flexDiv.appendChild(buttonSubmitFormPrincial);

    const aElement = document.createElement("a");
    aElement.appendChild(flexDiv);

    formPost.appendChild(aElement);

    formPost.appendChild(postContain);
    profileCreatePost.appendChild(formPost);

    return profileCreatePost;
}

export function createOptionPost(id, iconClass, linkText, borderBottom) {
    const optionPost = document.createElement("span");
    optionPost.id = id;
    optionPost.classList.add("optionPost");
    optionPost.style.borderBottom = borderBottom;

    const aElement = document.createElement("a");
    aElement.href = "#";

    const iElement = document.createElement("i");
    iElement.classList.add(iconClass);
    iElement.textContent = " " + linkText;

    aElement.appendChild(iElement);
    optionPost.appendChild(aElement);

    return optionPost;
}

export function createCheckCategories() {
    const checkCategories = document.createElement("span");
    checkCategories.classList.add("check-categories");
    checkCategories.onclick = toggleCheckboxDropdown;

    const checkboxDropdown = document.createElement("div");
    checkboxDropdown.classList.add("checkbox-dropdown");

    const aElement = document.createElement("a");
    aElement.href = "#";

    const iElement = document.createElement("i");
    iElement.classList.add("fas", "fa-list");
    iElement.textContent = " Select categories";

    aElement.appendChild(iElement);
    checkboxDropdown.appendChild(aElement);

    const checkboxDropdownContent = document.createElement("div");
    checkboxDropdownContent.id = "checkbox-dropdown-content";
    checkboxDropdownContent.classList.add("checkbox-dropdown-content");

    const categories = ["Category1", "Category2", "Category3"];
    categories.forEach(category => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = "categorieChecked";
        input.onchange = handleCheckboxChange();
        input.value = category;
        label.appendChild(input);
        label.appendChild(document.createTextNode(" " + category));
        checkboxDropdownContent.appendChild(label);
    });

    checkboxDropdown.appendChild(checkboxDropdownContent);
    checkCategories.appendChild(checkboxDropdown);

    return checkCategories;
}


