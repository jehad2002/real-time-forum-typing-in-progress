package models

import (
	"database/sql"
	"log"
	"strconv"
	"strings"
)

type User struct {
	Id        int
	Name      string
	Username  string
	Email     string
	Password  string
	Age       int
	Gender    string
	FirstName string
	LastName  string
}

func Register(db *sql.DB, user User) (int, error) {
	query := "INSERT INTO User (Name,username, Email,Password, Age, Gender, FirstName, LastName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
	res, err := db.Exec(query, user.Name, user.Username, user.Email, user.Password, user.Age, user.Gender, user.FirstName, user.LastName)
	if err != nil {
		return 0, err
	}
	id, er := res.RowsAffected()
	if er != nil {
		return 0, err
	}
	return int(id), nil
}

func Login(db *sql.DB, login, password string) (User, error) {
	query := "SELECT * FROM User WHERE Username=? AND Password=?"
	var user User
	row := db.QueryRow(query, login, password)
	err := row.Scan(&user.Id, &user.Name, &user.Username, &user.Email, &user.Password)
	if err == sql.ErrNoRows {
		return user, err
	}
	return user, nil
}

func UnLogin() {

}

func CheckUser(db *sql.DB, parm string) (User, error) {
	query := "SELECT * FROM User WHERE Username=?"
	if strings.Contains(parm, "@") {
		query = "SELECT * FROM User WHERE Email=?"
	}
	var user User
	row := db.QueryRow(query, parm)
	err := row.Scan(&user.Id, &user.Name, &user.Username, &user.Email, &user.Password, &user.Age, &user.Gender, &user.FirstName, &user.LastName)
	if err == sql.ErrNoRows {
		return user, err
	}
	return user, nil
}

func (u *User) GetUser(db *sql.DB) (User, error) {
	query := "SELECT * FROM User WHERE Id= ?"
	var user User
	row := db.QueryRow(query, u.Id)
	err := row.Scan(&user.Id, &user.Name, &user.Username, &user.Email, &user.Password, &user.Age, &user.Gender, &user.FirstName, &user.LastName)
	if err == sql.ErrNoRows {
		return user, err
	}
	return user, nil
}

func GetUserById(db *sql.DB, Id int) (User, error) {
	query := "SELECT * FROM User WHERE Id = ?"
	row := db.QueryRow(query, Id)
	var user User
	err := row.Scan(&user.Id, &user.Name, &user.Username, &user.Email, &user.Password, &user.Age, &user.Gender, &user.FirstName, &user.LastName)
	if err != nil || err == sql.ErrNoRows {
		return user, err
	}
	return user, nil
}

func GetAllUser(db *sql.DB, userId string) []User {
	query := "SELECT * FROM User"
	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.Id, &user.Name, &user.Username, &user.Email, &user.Password, &user.Age, &user.Gender, &user.FirstName, &user.LastName)
		if err != nil {
			log.Fatal(err)
		}
		if strconv.Itoa(user.Id) != userId {
			users = append(users, user)
		}
	}

	return users
}
