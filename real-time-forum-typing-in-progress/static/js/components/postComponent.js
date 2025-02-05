export function createPostElement(post) {
    const postElement = document.createElement("div");
    postElement.classList.add("post");

    postElement.innerHTML = `
        <div class="user-info-post">
            <div class="user-icon">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/${post.UserId}_copy.jpg" />
            </div>
            <div class="user-details">
                <div class="user-name">
                    <div class="user-name-text">${post.Name}</div>
                </div>
                <div class="user-time">${post.Date}</div>
            </div>
        </div>
        <h2>
            <a>${post.Title}</a>
        </h2>
        <div class="card">
            ${post.Categories.map(category => `
                ${category.Icon}<span>${category.Libelle}</span>
            `).join('')}
        </div>
        ${post.Content ? `<p>${post.Content}</p>` : ''}
        ${post.ImagePath ? `<img src="/static/uploads/posts/${post.ImagePath}" alt="Post image" class="post-image">` : ''}
        ${post.VideoPath ? `
            <video class="video-container" controls>
                <source src="/static/uploads/posts/${post.VideoPath}" class="post-video" type="video/mp4">
            </video>` : ''
        }
        <div class="votes">
            <div class="content-like-dislike">
                <div style="display: none;">
                    <div class="postId">${post.PostId}</div>
                    <div class="commentId">${post.PostId}</div>
                </div>
                <button id="open-popup-like" style="background-color: ${post.IsLike ? 'green' : 'white'}" class="open-popup vote-button like">
                    <i class="${post.IsLike ? 'fa fa-thumbs-up' : 'fa fa-thumbs-o-up'}" aria-hidden="true"></i>
                </button>
                <span class="likeNumber">${post.Likes}</span>
                <pre style="border-right: 0.1px solid gray; height: 80%;"></pre>
                <button id="open-popup-dislike" style="background-color: ${post.IsDisLike ? 'rgb(175, 99, 99)' : 'white'}" class="open-popup vote-button dislike">
                    <i class="${post.IsDisLike ? 'fa fa-thumbs-down' : 'fa fa-thumbs-o-down'}" aria-hidden="true"></i>
                </button>
                <span class="dislikeNumber">${post.DisLikes}</span>
            </div>
            <div class="comment-count comment" id="${post.PostId}">
                <button class="open-comment-popup vote-button comment" data-postid="${post.PostId}">
                <i class="fas fa-comment-dots text-secondary" aria-hidden="true"></i>
                <i style="color: black;"> ${post.Comments}</i>
             </button>
           </div>
        </div>
    `;

    return postElement;
}

export const createPostButton = (userId) => {
    var createPostBtn = document.createElement('div');
    createPostBtn.classList.add('profile-create-post');

    createPostBtn.innerHTML = `
    <div class="profile-image">
        <img class="" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/${userId}_copy.jpg" />
    </div>
    <div class="input-box">
        <input class="input-text" type="text" value="Let’s share what's going on your mind..." disabled>
    </div>
    <button style="display: flex; flex-direction: row; align-items: center;" class="create_post open-popup"
        id="openPostForm">
        <a class="create-post-button">
            Create Post
        </a>
        <i class="fa-solid fa-plus fa-beat fa-2xl" style="color: red;"></i>
    </button>`;

    return createPostBtn;
}

export const formPost = (categories) => {
    var form = document.createElement("div");
    form.action = "/createpost";
    form.id = "formPost";
    form.classList.add('formPost');
    form.method = "post";
    form.enctype = "multipart/form-data";
    form.style.display = 'none';

    var contentCtg = "";
    categories.forEach(category => {
        contentCtg += `<label><input type="checkbox" name="categorieChecked"
            value="${category.Id}"> ${category.Libelle}</label>
            <span style= "display: none;">${category.Icon}</span>`;
    });

    form.innerHTML = `
        <div class="postContain">
            <span class="cancelPostForm">&times;</span>
            <section class="headPost">
                <span style="border-bottom: 3px solid blue;" class="optionPost" id="postText">
                    <a id="postLink">
                        <i class="fas fa-pencil-alt"> </i> Post
                    </a>
                </span>
                <span style="border-bottom: 1px solid lightgray;" class="optionPost" id="openUploadImVid">
                    <a id="imagevideoLink">
                        <i class="fas fa-camera"> </i> Image &amp; Video
                    </a>
                </span>
                <span class="check-categories" id="openCheckCategories">
                    <div class="checkbox-dropdown">
                        <a>
                            <i class="fas fa-list"></i> Select categories
                        </a>
                        <div id="checkbox-dropdown-content" class="checkbox-dropdown-content">
                            ${contentCtg}
                        </div>
                    </div>
                </span>
            </section>
            <section class="titlePost">
                <input value="" type="text" minlength="5" maxlength="100" placeholder="Title 100 characters max" name="title" id="titleInput" style="height: 40px; border-radius: 10px;" required>
            </section>
            <section class="contentPost">
                <textarea name="content" minlength="5" maxlength="1500" id="textareaField" cols="49" rows="14" placeholder="Write your message post in minimum 5 and 1500 characters max..."></textarea>
                <div class="UploadImVid" id="uploadSection" style="display: none;">
                    <label for="fileInput">Choose an image or video:</label>
                    <input type="file" id="fileInput" accept="image/*, video/*" name="uploadsFile">
                </div>
            </section>
        </div>
        <a>
            <div style="display: flex;">
                <button type="" id="buttonSubmitFormPrincial">Create Post</button>
            </div>
        </a>
    `;

    // Add event listener to toggle the image/video upload section
    form.querySelector('#openUploadImVid').addEventListener('click', () => {
        const uploadSection = form.querySelector('#uploadSection');
        uploadSection.style.display = uploadSection.style.display === 'none' ? 'block' : 'none';
    });

    return form;
}
