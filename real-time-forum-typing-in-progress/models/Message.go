package models

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"
)

type Message struct {
	ID           int
	Expediteur   int
	Destinataire int
	Contenu      string
	Date         time.Time
	Lu           bool
}

type Chat struct {
	ID           int
	Expediteur   int
	Destinataire int
	Contenu      string
	Date         string
}

func GetAllMessage(db *sql.DB) ([]Message, error) {
	//query := "SELECT DISTINCT Id, Expediteur, Destinataire, Contenue, Date FROM Message ORDER BY Date DESC"
	query := "SELECT MAX(Id) AS Id, Expediteur, Destinataire, MAX(Contenue) AS Contenue, MAX(Date) AS Date FROM Message GROUP BY Expediteur, Destinataire ORDER BY Date DESC"

	//query := "SELECT * FROM Message ORDER BY Date DESC"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []Message

	for rows.Next() {
		var message Message
		err := rows.Scan(&message.ID, &message.Expediteur, &message.Destinataire, &message.Contenu, &message.Date)
		if err != nil {
			return nil, err
		}
		messages = append(messages, message)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return messages, nil
}

func GetMessage(db *sql.DB, expediteur, destinataire int, startIndex string) ([]Message, error) {
	limit, _ := strconv.Atoi(startIndex)
	query := "SELECT * FROM Message WHERE (Expediteur = ? AND Destinataire = ?) OR (Expediteur = ? AND Destinataire = ?) ORDER BY Date DESC LIMIT " + strconv.Itoa(limit+10) + " OFFSET " + startIndex
	rows, err := db.Query(query, expediteur, destinataire, destinataire, expediteur)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []Message

	for rows.Next() {
		var message Message
		err := rows.Scan(&message.ID, &message.Expediteur, &message.Destinataire, &message.Contenu, &message.Date, &message.Lu)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		messages = append(messages, message)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return messages, nil
}

func InserMessage(db *sql.DB, message Chat) (int, error) {
	query := "INSERT INTO Message (Expediteur, Destinataire, Contenue, Date) VALUES (?, ?, ?, ?)"
	date, _ := time.Parse("2006-01-02 15:04:05", time.Now().Format("2006-01-02 15:04:05"))
	res, err := db.Exec(query, message.Expediteur, message.Destinataire, message.Contenu, date)
	if err != nil {
		return 0, err
	}
	//fmt.Println("seccess!")

	id, er := res.RowsAffected()

	if er != nil {
		return 0, err
	}
	return int(id), nil
}

type UserWithLastMessage struct {
	User
	LastMessage     string `json:"last_message"`
	LastMessageTime string `json:"last_message_time"`
}

func GetUsersWithLastMessage(db *sql.DB, userId string) ([]UserWithLastMessage, error) {
	var connectedUser, _ = strconv.Atoi(userId)
	query := `
	SELECT
		u.Id,
		u.Name,
		u.Username,
		u.Email,
		u.Password,
		u.Age,
		u.Gender,
		u.FirstName,
		u.LastName,
		COALESCE(m.contenue, '') AS last_message,
		COALESCE(MAX(m.date), CAST('1970-01-01' AS TIMESTAMP)) AS last_message_time
	FROM
		User u
	LEFT JOIN
		Message m ON (u.Id = m.destinataire AND m.expediteur = ?) OR (u.Id = m.expediteur AND m.destinataire = ?)
	
	GROUP BY
		u.Id, u.Username, u.Email
	ORDER BY
		COALESCE(last_message_time, CAST('1970-01-01' AS TIMESTAMP)) DESC,
		u.Username ASC;
`

	//fmt.Println("connected user id  ", connectedUser)

	rows, err := db.Query(query, connectedUser, connectedUser)

	if err != nil {
		fmt.Println("Error executing the query:", err)
		return nil, err
	}

	defer rows.Close()

	var usersWithLastMessage []UserWithLastMessage
	for rows.Next() {
		var userWithLastMessage UserWithLastMessage

		err := rows.Scan(
			&userWithLastMessage.Id,
			&userWithLastMessage.Name,
			&userWithLastMessage.Username,
			&userWithLastMessage.Email,
			&userWithLastMessage.Password,
			&userWithLastMessage.Age,
			&userWithLastMessage.Gender,
			&userWithLastMessage.FirstName,
			&userWithLastMessage.LastName,
			&userWithLastMessage.LastMessage,
			&userWithLastMessage.LastMessageTime,
		)

		if err != nil {
			return nil, err
		}

		if strconv.Itoa(userWithLastMessage.Id) != userId {
			usersWithLastMessage = append(usersWithLastMessage, userWithLastMessage)
		}

	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return usersWithLastMessage, nil
}

// func GetUnreadMessagesCount(db *sql.DB, userId int) (int, error) {
// 	// Utilisez la fonction COUNT pour compter les messages non lus
// 	query := "SELECT COUNT(Id) FROM Message WHERE Expediteur = ? AND Lu = 0"

// 	var unreadCount int
// 	err := db.QueryRow(query, userId).Scan(&unreadCount)
// 	if err != nil {
// 		return 0, err
// 	}

// 	return unreadCount, nil
// }

func GetUnreadMessagesCount(db *sql.DB, userId int, otherUserId int) (int, error) {
	query := "SELECT COUNT(Id) FROM Message WHERE (Expediteur = ? AND Destinataire = ? AND Lu = 0)"

	var unreadCount int
	err := db.QueryRow(query, otherUserId, userId).Scan(&unreadCount)
	if err != nil {
		return 0, err
	}

	return unreadCount, nil
}

func UpdateMessagesAsRead(db *sql.DB, userId, senderId int) error {
	query := "UPDATE Message SET Lu = 1 WHERE Destinataire = ? AND Expediteur = ? AND Lu = 0"

	_, err := db.Exec(query, userId, senderId)
	return err
}
