//import { createCommentSection } from '../app.js';
var  commentData = null;
export function createComment(post,contentSection, main ) {
    const postElement = document.createElement('div');
    postElement.classList.add('content-comment', 'post-comment', 'post');

    const userCircleStyle = post.Status ? 'background-color: green;' : 'background-color: red; padding-left: 4px;';
    var commentNumber = 0;
    if (post.Comments) {
        commentNumber = post.Comments.length
    }
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
        <h2>${post.Title}</h2>
        ${post.Categories.map(category => `
            ${category.Icon}<span>${category.Libelle}</span>
        `).join('')}
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
                    <div id="userId">${post.UserId}</div>
                    <div class="postId">${post.PostId}</div>
                    <div class="commentId">${post.PostId}</div>
                </div>
                ${post.IsLike ? 
                    `<button id="open-popup-like" style="background-color: green;" class="open-popup vote-button like">
                        <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                    </button>` : 
                    `<button id="open-popup-like" style="background-color: white" class="open-popup vote-button like">
                        <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                    </button>`
                }
                <span class="likeNumber">${post.Likes}</span>
                <pre style="border-right: 0.1px solid gray; height: 80%;"> </pre>
                ${post.IsDisLike ? 
                    `<button id="open-popup-dislike" style="background-color: rgb(175, 99, 99);" class="open-popup vote-button dislike">
                        <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                    </button>` : 
                    `<button id="open-popup-dislike" style="background-color: white" class="open-popup vote-button dislike">
                        <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
                    </button>`
                }
                <span class="dislikeNumber">${post.DisLikes}</span>
            </div>
            <div class="comment-count">
                <button disabled id="open-popup-comment" class="open-popup vote-button comment">
                    <i class="fas fa-comment-dots text-secondary" aria-hidden="true"></i>
                    <i style="color: black;">${commentNumber}</i>
                </button>
            </div>
        </div>
    </div>

    <div class="comment-form">
        <div class="user-icon">
            <div class="user-circle" style="background-color: gray;">
                <img src="" alt="" class="user-avatar" style="max-width: 60%; height: auto;">
            </div>
        </div>
        <form method="POST" id="formPostcomment" class="open-popup">
            <input type="hidden"  id="postid"  value="${post.PostId}">
            <input type="hidden"  id="parentid"  value="0">
            <input type="hidden"  id="userid"   value="1">
            <input type="hidden"  id="date"   value="">
            <textarea id="contenu" class="comment-input" minlength="2" maxlength="500" id="textareaFieldd" placeholder="Add a comment (maximum 500 characters)" required></textarea>
            <div class="comment-button">
                <button  type="submit">answer</button>
            </div>
        </form>
    </div>`;

    const commentSection = document.createElement('div');
    commentSection.classList.add('comment-section');

    const commentList = document.createElement('ul');
    commentList.classList.add('list');
    commentList.style.setProperty('--depth', '0');

    commentSection.appendChild(commentList);
    postElement.appendChild(commentSection);

    if (post.Comments && Array.isArray(post.Comments) && post.Comments.length > 0) {
        post.Comments.forEach(comment => {
            commentList.appendChild(createCommentDiv(comment));
        });
    } 
    contentSection.appendChild(postElement);
    main.appendChild(contentSection)
}

export function createCommentDiv(comment) {
    const commentElement = document.createElement('li');
            commentElement.classList.add('comment', '--nested');
            var Date = 'less than a minute ago';
            var IsLikeComment = false;
            var IsLikeComment = false;
            var IsDisLikeComment = false;
            var Likes = 0;
            var DisLikes = 0;
            if (comment.DateFormat) {
                Date = comment.DateFormat
                IsLikeComment = comment.IsLikeComment 
                Likes = comment.Likes
                IsDisLikeComment = comment.IsDisLikeComment
                DisLikes = comment.Dislikes
            }
            commentElement.innerHTML = `
                <div class="comment" style="display: flex; flex-direction: column;">
                    <div class="comment">
                        <div> <i class="fa fa-comment" aria-hidden="true"></i></div>
                        <div class="comment-bloc">
                            <!-- body -->
                            <div class="comment__body">
                                <p><strong>${comment.Name}</strong></p>
                                <div class="user-time">${Date}</div>
                                <p>${comment.Content}</p>
                            </div>
                            <!-- actions -->
                            <div class="comment__actions votes">
                                <div class="content-like-dislike">
                                    <div class="content-like-dislike react_to_comment">
                                        <div style="display: none;">
                                            <div class="userId">${comment.UserID}</div>
                                            <div class="postId">${comment.PostID}</div>
                                            <div class="commentId">${comment.ID}</div>
                                        </div>
                                        ${IsLikeComment ? 
                                            `<button id="open-popup-like" style="background-color: green;" class="open-popup vote-button like">
                                                <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                                            </button>` : 
                                            `<button id="open-popup-like" style="background-color: white" class="open-popup vote-button like">
                                                <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                            </button>`
                                        }
                                        <span class="likeNumber">${Likes}</span>
                                        <pre style="border-right: 0.1px solid gray; height: 80%;"> </pre>
                                        ${IsDisLikeComment ? 
                                            `<button id="open-popup-dislike" style="background-color: rgb(175, 99, 99);" class="open-popup vote-button dislike">
                                                <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                                            </button>` : 
                                            `<button id="open-popup-dislike" style="background-color: white" class="open-popup vote-button dislike">
                                                <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
                                            </button>`
                                        }
                                        <span class="dislikeNumber">${DisLikes}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            return commentElement
}