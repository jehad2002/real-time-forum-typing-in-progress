package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strconv"
	db "real-time-forum/database"
	"real-time-forum/models"
	"time"
)

func RecupChatHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		ok, session := RequiereLogin(r)
		if !ok {
			return
		}

		var payload map[string]string
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, "Error reading the request body", http.StatusBadRequest)
			return
		}

		destinataire, ok := payload["destinataire"]
		index, _ := payload["index"]
		if !ok {
			http.Error(w, "Missing 'recipient' parameter in the request", http.StatusBadRequest)
			return
		}

		expediteur, err := strconv.Atoi(session.Data["userID"])
		indexInt, _ := strconv.Atoi(index)
		if err != nil {
			http.Error(w, "Error converting the sender to an integer", http.StatusBadRequest)
			return
		}

		dest, err := strconv.Atoi(destinataire)
		if err != nil {
			http.Error(w, "Error converting the recipient to an integer", http.StatusBadRequest)
			return
		}

		messages, err := models.GetMessage(db.OpenDB(), expediteur, dest, index)
		if err != nil {
			http.Error(w, "Error retrieving messages", http.StatusInternalServerError)
			return
		}

		groupedMessage := GetLast10Messages(messages, indexInt)
		jsonPosts, err := json.Marshal(groupedMessage)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonPosts)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func GetHourMinute(dateTime string) (string, error) {

	parsedDateTime, err := time.Parse("2006-01-02 15:04:05", dateTime)

	if err != nil {
		fmt.Println("error", err)
		return "", err
	}

	hourMinute := parsedDateTime.Format("15:04")

	return hourMinute, nil
}

func GetLast10Messages(messages []models.Message, startIndex int) map[string][]models.Chat {
	groupedMessages := make(map[string][]models.Chat)
	sortedMessages := sortByDateDesc(messages)

	for i := 0; i < len(sortedMessages) && i < 10; i++ {
		var chat models.Chat
		message := sortedMessages[i]
		chat.ID = message.ID
		chat.Expediteur = message.Expediteur
		chat.Destinataire = message.Destinataire
		chat.Contenu = message.Contenu
		currentDate := message.Date.Format("2006-01-02 15:04:05")
		chat.Date, _ = GetHourMinute(currentDate)
		dateKey := message.Date.Format("2006-01-02")
		dateKeyWithSuffix := dateKey + " " + message.Date.Weekday().String()
		groupedMessages[dateKeyWithSuffix] = append(groupedMessages[dateKeyWithSuffix], chat)
	}

	return groupedMessages
}

func sortByDateDesc(messages []models.Message) []models.Message {
	sort.Slice(messages, func(i, j int) bool {
		return messages[i].Date.After(messages[j].Date)
	})
	return messages
}

func CloseChatHandler(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		UserID   int `json:"userId"`
		SenderID int `json:"senderId"`
	}

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&requestData)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Failed to decode JSON data", http.StatusBadRequest)
		return
	}

	err = models.UpdateMessagesAsRead(db.OpenDB(), requestData.UserID, requestData.SenderID)
	if err != nil {
		http.Error(w, "Failed to update messages status", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
