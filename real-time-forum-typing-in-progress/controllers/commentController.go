package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/utils"
)

type PostComment struct {
	UserId        int
	PostId        int
	UserName      string
	Name          string
	Date          string
	Title         string
	Categories    []models.Category
	ImagePath     string
	VideoPath     string
	Content       string
	Likes         string
	DisLikes      string
	IsLike        bool
	IsDisLike     bool
	Status        bool
	Comments      []models.Comments 
	ErrorRegister string
}

func CommentHandler(w http.ResponseWriter, r *http.Request) {
	var userId int
	ok, session := RequiereLogin(r)
	if ok {
		userId, _ = strconv.Atoi(session.Data["userID"])
	}
	decoder := json.NewDecoder(r.Body)
	var data map[string]int
	err := decoder.Decode(&data)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	postId, ok := data["postId"]
	if !ok {
		http.Error(w, "Missing postId in request", http.StatusBadRequest)
		return
	}

	var p models.Post
	p.Id = postId

	post, _ := p.GetPostById(database.OpenDB())

	usr, _ := models.GetUserById(database.OpenDB(), post.UserId)
	var posts PostComment
	posts.PostId = post.Id
	posts.UserId = post.UserId
	posts.Content = post.Content
	posts.Comments = models.GetCommentsFromDatabase(database.OpenDB(), userId, postId)
	// fmt.Println("comment:", posts.Comments)
	posts.Date = utils.FormatDate(post.Date)
	posts.ImagePath = post.ImagePath
	posts.VideoPath = post.VideoPath
	posts.Title = post.Title
	posts.UserName = usr.Username
	posts.Name = usr.Name
	nLike, nDisLike := models.GetNumberLikeByIdPost(database.Database, posts.PostId)
	posts.Likes = utils.AbregerNombreLikesOrComment(nLike)
	posts.DisLikes = utils.AbregerNombreLikesOrComment(nDisLike)
	posts.IsLike = models.LikePost(database.OpenDB(), posts.PostId, userId)
	posts.IsDisLike = models.DisLikePost(database.OpenDB(), posts.PostId, userId)
	posts.Categories = models.GetCategoriesByIdPost(database.OpenDB(), posts.PostId)
	if Status[posts.UserName] {
		posts.ErrorRegister = ""
		posts.Status = true
	}
	var pts []PostComment
	pts = append(pts, posts)

	jsonPosts, err := json.Marshal(pts)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonPosts)
}

func AddCommentReply(w http.ResponseWriter, r *http.Request) {
	var comment models.Comments
	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	_, err = comment.CreateComment(database.OpenDB())
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	response, err := json.Marshal("Comment added successfully")
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Write(response)
}
