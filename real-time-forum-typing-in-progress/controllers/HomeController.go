package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	db "real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/utils"
)

type Post struct {
	Action       string
	UserId       int
	PostId       int
	ParentId     int
	UserName     string
	Name         string
	Date         string
	Title        string
	Categories   []models.Category
	Category     []string
	ImagePath    string
	VideoPath    string
	Content      string
	Likes        string
	DisLikes     string
	IsLike       bool
	IsDisLike    bool
	Comments     string
	Status       string
	ID           int
	Expediteur   int
	Destinataire int
	Contenu      string
	Istyping     string
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	ok, session := RequiereLogin(r)
	if !ok {
		fmt.Fprintf(w, "You cannot access the posts")
		return
	}
	var posts []Post
	pp := models.GetAllPost(db.OpenDB())
	for _, v := range pp {
		var post Post
		post.UserId = v.UserId
		post.PostId = v.Id
		post.Title = v.Title
		post.Content = v.Content
		post.ImagePath = v.ImagePath
		post.VideoPath = v.VideoPath
		userPost, err := models.GetUserById(db.OpenDB(), v.UserId)
		if err != nil {
			post.UserName = "Unknown"
			post.Name = "Unknown"
		} else {
			post.UserName = userPost.Username
			post.Name = userPost.Name
		}
		userId, _ := strconv.Atoi(session.Data["userID"])
		if ok && userId == v.UserId {
			post.Status = "on"
		}
		post.IsLike = models.LikePost(db.OpenDB(), v.Id, userId)
		post.IsDisLike = models.DisLikePost(db.OpenDB(), v.Id, userId)
		post.Comments = utils.AbregerNombreLikesOrComment(models.GetNumberCommentByIdPost(db.Database, v.Id))
		nLike, nDisLike := models.GetNumberLikeByIdPost(db.Database, v.Id)
		post.Likes = utils.AbregerNombreLikesOrComment(nLike)
		post.DisLikes = utils.AbregerNombreLikesOrComment(nDisLike)
		post.Categories = models.GetCategoriesByIdPost(db.Database, v.Id)
		post.Date = utils.FormatDate(v.Date)
		posts = append(posts, post)
	}
	jsonPosts, err := json.Marshal(posts)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	w.Write(jsonPosts)
}

func GetPostComment(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Path[len("/post/"):]
	id, err := strconv.Atoi(idStr)
	ds := strconv.Itoa(4)
	if err != nil && ds == "4" {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	post, err := models.GetPostById(db.OpenDB(), id)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Post not found", http.StatusNotFound)
		} else {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
		return
	}

	jsonPost, err := json.Marshal(post)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	w.Write(jsonPost)
}
