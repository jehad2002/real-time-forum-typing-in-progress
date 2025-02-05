package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	db "real-time-forum/database"
	"real-time-forum/models"

	"github.com/gorilla/websocket"
)

var clientsChat = make(map[string]*websocket.Conn)

func Message(w http.ResponseWriter, r *http.Request) {
	ok, session := RequiereLogin(r)
	if !ok {
		return
	}

	conn, _ := upgrader.Upgrade(w, r, nil)
	clientsChat[session.Data["userID"]] = conn

	if err != nil {
		return
	}

	connectedUserID := session.Data["userID"]
	clientsChat[connectedUserID] = conn
	notifyUserStatusUpdate(connectedUserID, "on")

	go func() {
		for {
			msgType, msg, err := conn.ReadMessage()
			if err != nil {
				return
			}
			var data Post
			err = json.Unmarshal(msg, &data)
			if err != nil {
				log.Println("Error decoding JSON:", err)
				return
			}
			if data.Action == "chat" {
				InsertDataChat(data)
				if err = conn.WriteMessage(msgType, msg); err != nil {
					return
				}
				id := strconv.Itoa(data.Destinataire)
				client := clientsChat[id]

				if client != nil {
					if err = client.WriteMessage(msgType, msg); err != nil {
						return
					}
				}
			} else if data.Action == "createPost" {
				InsertDataPost(data)
				for _, client := range clientsChat {
					if err = client.WriteMessage(msgType, msg); err != nil {
						return
					}
				}
			} else if data.Action == "comment" {
				InsertDataComment(data)
				//fmt.Println("TEST TEST TEST COMMENT", data.Contenu)
				for _, client := range clientsChat {
					if err = client.WriteMessage(msgType, msg); err != nil {
						return
					}
				}
			} else {
				fmt.Println("TEST TEST TEST: it's not working", data)
			}
		}
	}()
}

func InsertDataChat(data Post) {
	if data.Istyping != "true" {
		var chatData models.Chat
		chatData.Destinataire = data.Destinataire
		chatData.Expediteur = data.Expediteur
		chatData.Contenu = data.Contenu
		if data.Contenu != "" {
			_, err = models.InserMessage(db.OpenDB(), chatData)
			if err != nil {
				fmt.Println("can't insert the message in the database:", err)
			}
		}
	}
}

func InsertDataPost(data Post) {
	if data.Content != "" {
		var PostData models.Post
		PostData.Title = data.Title
		PostData.Content = data.Content
		PostData.ImagePath = data.ImagePath
		PostData.VideoPath = data.VideoPath
		PostData.UserId = data.UserId
		_, err = models.CreatePost(db.OpenDB(), PostData, data.Categories)
		if err != nil {
			fmt.Println("can't insert the post in the database:", err)
		}
	}
}

func InsertDataComment(data Post) {
	if data.Contenu != "" {
		var commentData models.Comments
		commentData.Content = data.Content
		commentData.UserID = data.UserId
		commentData.PostID = data.PostId
		commentData.ParentID = data.ParentId
		_, err = commentData.CreateComment(db.OpenDB())
		if err != nil {
			fmt.Println("can't insert the comment in the database:", err)
		}
	}
}

func GetConnectedUsers() []string {
	var connectedUsers []string
	for userID := range clientsChat {
		connectedUsers = append(connectedUsers, userID)
	}
	return connectedUsers
}

func notifyUserStatusUpdate(userID string, status string) {
	updateMsg := map[string]interface{}{
		"action": "userStatusUpdate",
		"userID": userID,
		"status": status,
	}
	if status == "off" {
		delete(clientsChat, userID)
	}

	updateMsgJSON, err := json.Marshal(updateMsg)
	if err != nil {
		log.Println("Error creating user status update message:", err)
		return
	}
	for _, client := range clientsChat {
		err := client.WriteMessage(websocket.TextMessage, updateMsgJSON)
		if err != nil {
			log.Println("Error sending user status update:", err)
		}
	}

}
