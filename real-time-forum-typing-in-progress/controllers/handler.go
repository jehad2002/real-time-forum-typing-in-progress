package controllers

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"
	db "real-time-forum/database"
	"real-time-forum/models"

	_ "github.com/mattn/go-sqlite3"
)

var layout, err = template.ParseFiles("./templates/index.html")

type pageData struct {
	Title string
}

type AssideContent struct {
	Cat []models.Category
	Use []User
}

type User struct {
	Id             int
	Name           string
	Username       string
	Email          string
	Password       string
	Age            int
	Gender         string
	FirstName      string
	LastName       string
	Status         string
	UnreadMessages int
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	data := pageData{
		Title: "JehadReal",
	}

	err = layout.ExecuteTemplate(w, "index.html", data)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		log.Printf("Error executing the model: %v", err)
	}
}

func GetAllPost(w http.ResponseWriter, r *http.Request) {
	posts := models.GetAllPost(db.OpenDB())

	jsonPosts, err := json.Marshal(posts)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	w.Write(jsonPosts)
}

func GetAssideContent(w http.ResponseWriter, r *http.Request) {
	var allUsers []User
	vrai, session := RequiereLogin(r)
	if (!vrai){
		fmt.Fprintf(w, "You cannot access the data")
		return
	}
	var assideContent AssideContent
	users, _ := models.GetUsersWithLastMessage(db.OpenDB(), session.Data["userID"])
	userID, _ := strconv.Atoi(session.Data["userID"])
	for _, user := range users {
		var newUser User
		currentUserId := strconv.Itoa(user.Id)
		newUser.Id = user.Id
		newUser.Name = user.FirstName + " " + user.LastName
		newUser.Username = user.Username
		newUser.Email = user.Email
		newUser.Password = user.Password
		newUser.Age = user.Age
		newUser.Gender = user.Gender
		newUser.FirstName = user.FirstName
		newUser.LastName = user.LastName

		if isInArray(currentUserId, GetConnectedUsers()) {
			newUser.Status = "on"
		} else {
			newUser.Status = "off"
		}

		unreadMessagesCount, _ := models.GetUnreadMessagesCount(db.OpenDB(), userID, user.Id)
		newUser.UnreadMessages = unreadMessagesCount

		allUsers = append(allUsers, newUser)
	}

	assideContent.Cat = models.GetAllCategories(db.OpenDB())
	assideContent.Use = allUsers

	jsonPosts, err := json.Marshal(assideContent)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	w.Write(jsonPosts)
}

func isInArray(value string, array []string) bool {
	for _, element := range array {
		if element == value {
			return true
		}
	}
	return false
}
