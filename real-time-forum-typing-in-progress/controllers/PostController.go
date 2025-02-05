package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	db "real-time-forum/database"
	"real-time-forum/models"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var clients []websocket.Conn

func CreatePost(w http.ResponseWriter, r *http.Request) {
	conn, _ := upgrader.Upgrade(w, r, nil)
	clients = append(clients, *conn)

	//jsonDataChannel := make(chan controllers.Post)
	//formDataChannel := make(chan *multipart.Form)
	//done := make(chan bool) 

	go func() {
		for {
			msgType, msg, err := conn.ReadMessage()
			if err != nil {
				return
			}
			//if msgType == websocket.TextMessage {
			var postData Post
			err = json.Unmarshal(msg, &postData)
			if err != nil {
				log.Println("Erreur lors de la décodage JSON:", err)
				return
			}

			//jsonDataChannel <- postData
			//fmt.Println("Status:", postData.Status)
			fmt.Printf("%s send: %s\n", conn.RemoteAddr(), string(postData.Content))
			//controllers.CreatePost(w, r, postData)
			for _, client := range clients {
				if err = client.WriteMessage(msgType, msg); err != nil {
					return
				}
			}
			//}
		}
	}()
}

func createPost(w http.ResponseWriter, r *http.Request, post Post) {
	errorPage := new(ErrorPage)
	ok, session := RequiereLogin(r)
	var user models.User
	if ok {
		user.Id, _ = strconv.Atoi(session.Data["userID"])
		u, err := user.GetUser(db.OpenDB())
		if err == nil {
			user = u
		}
	} else {
		ManaginErr(w, http.StatusUnauthorized, "Access to this resource is Unauthorized. Please ensure you have the required permissions or credentials to access it.")
	}

	var postModel models.Post
	postModel.UserId = post.UserId
	postModel.Title = post.Title
	postModel.Content = post.Content
	if post.Title == "" || post.Content == "" {
		ManaginErr(w, http.StatusBadRequest, "empty title or content")
	}
	if len(post.Title) > 100 {
		ManaginErr(w, http.StatusBadRequest, "The title must not exceed 100 characters.")
	}

	if len(post.Content) > 1500 {
		ManaginErr(w, http.StatusBadRequest, "The content must not exceed 1500 characters.")
	}

	post.UserId = user.Id
	var categories []models.Category
	for _, v := range post.Category {
		val, atoi := strconv.Atoi(v)
		if atoi != nil {
			errorPage.StatusCode = http.StatusBadRequest
			errorPage.Message = http.StatusText(errorPage.StatusCode)
			errorPage.Description = "Error values of  categories"
			// utils.ErrorHandling(w, errorPage)
			return
		} else {
			cat, err := models.GetCategorieById(db.OpenDB(), val)
			if err == nil {
				categories = append(categories, cat)
			}
		}
	}
	if len(categories) == 0 {
		ManaginErr(w, http.StatusBadRequest, "Nothing categories for this post")
	}
	postModel.ImagePath = post.ImagePath
	//postModel.ImagePath = UploadsImage(post.ImagePath, extension, r)
	//file, header, err := r.FormFile("uploadsFile")
	//if header != nil {
	//	if err != nil {
	//		ManaginErr(w, http.StatusBadRequest, "Erreur lors de la récupération du fichier")
	//	}
	//	defer file.Close()

	//	extension := strings.ToLower(filepath.Ext(header.Filename))

	//	if extension == ".jpeg" || extension == ".jpg" || extension == ".png" || extension == ".gif" {
	//		post.ImagePath = UploadsImage(file, header, extension, r)
	//		if post.ImagePath == "" {
	//			ManaginErr(w, http.StatusBadRequest, "File size exceeds 20 MB limit")
	//		}
	//	} else if extension == ".avi" || extension == ".mp4" || extension == ".mov" {
	//		post.VideoPath = UploadsVideo(file, header, extension, r)
	//		if post.VideoPath == "" {
	//			ManaginErr(w, http.StatusBadRequest, "File size exceeds 20 MB limit")
	//		}
	//	} else {
	//		fmt.Println("Format de fichier non pris en charge, Error: ", http.StatusInternalServerError)
	//		http.Error(w, "Format de fichier non pris en charge", http.StatusInternalServerError)
	//		return
	//	}
	//}

	_, test := models.CreatePost(db.OpenDB(), postModel, categories)
	if test != nil {
		ManaginErr(w, http.StatusBadRequest, "")
	}
	db.OpenDB().Close()
	//http.Redirect(w, r, "/", http.StatusSeeOther)
}

func UploadsVideo(file multipart.File, header *multipart.FileHeader, extension string, r *http.Request) string {
	err := r.ParseMultipartForm(500 << 20) 
	//err := r.ParseMultipartForm(20 << 20)
	if err != nil {
		fmt.Println("Unable to parse form, Error: ", http.StatusInternalServerError)
		// http.Error(w, "Unable to parse form", http.StatusInternalServerError)
		return ""
	}
	//fmt.Println("File size exceeds 20 MB limit, Error: ", header.Size)
	if header.Size > 20*1024*1024 { // 100 MB in bytes
		fmt.Println("File size exceeds 20 MB limit, Error: ", header.Size, http.StatusBadRequest)
		// http.Error(w, "File size exceeds 100 MB limit", http.StatusBadRequest)
		return ""
	}
	newFileName := "video-" + fmt.Sprintf("%d", time.Now().Unix()) + extension
	newFilePath := filepath.Join("static", "uploads", "posts", newFileName)

	// Create the uploads directory if it doesn't exist
	err = os.MkdirAll(filepath.Dir(newFilePath), os.ModePerm)
	if err != nil {
		fmt.Println("Unable to create directories, Error: ", http.StatusInternalServerError)
		// http.Error(w, "Unable to create directories", http.StatusInternalServerError)
		return ""
	}

	newFile, err := os.Create(newFilePath)
	if err != nil {
		fmt.Println("Unable to create file, Error: ", http.StatusInternalServerError)
		// http.Error(w, "Unable to create file", http.StatusInternalServerError)
		return ""
	}
	defer newFile.Close()

	_, err = io.Copy(newFile, file)
	if err != nil {
		fmt.Println("Unable to copy file data, Error: ", http.StatusInternalServerError)
		// http.Error(w, "Unable to copy file data", http.StatusInternalServerError)
		return ""
	}
	return newFileName
}

func UploadsImage(file multipart.File, header *multipart.FileHeader, extension string, r *http.Request) string {
	if header.Size > 20*1024*1024 {
		fmt.Println("The file size exceeds the 20 MB limit")
		return ""
	}

	newFileName := "post-" + fmt.Sprintf("%d", time.Now().Unix()) + extension

	newFilePath := filepath.Join("static", "uploads", "posts", newFileName)

	out, err := os.Create(newFilePath)
	if err != nil {
		fmt.Println("Error saving the image: ", err)
		return ""
	}
	defer out.Close()

	_, err = io.Copy(out, file)
	if err != nil {
		fmt.Println("Error copying the file: ", err)
		return ""
	}

	return newFileName
}

func DeletePost(w http.ResponseWriter, r *http.Request) {
	var post models.Post
	post.Id = 2
	db.OpenDB().Close()
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func UpdatePost(w http.ResponseWriter, r *http.Request) {
	var post models.Post
	post.Id = 3
	post.Title = "Sport"
	post.Content = "Update Description for Sport"
	post.ImagePath = "updateImage.png"
	db.OpenDB().Close()
	http.Redirect(w, r, "/", http.StatusSeeOther)
}


func notifyNewPost(conn *websocket.Conn, post models.Post) {
	message := fmt.Sprintf("New post created: %s", post.Title)

	err := conn.WriteMessage(websocket.TextMessage, []byte(message))
	if err != nil {
		fmt.Println("Error sending WebSocket message:", err)
	}
}

