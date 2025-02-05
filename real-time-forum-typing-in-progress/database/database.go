// package database

// import (
// 	"database/sql"
// 	"fmt"
// 	"io/ioutil"
// 	"log"
// 	"real-time-forum/models"

// 	_ "modernc.org/sqlite"
// )

// var (
// 	Database *sql.DB
// 	err      error
// )

// func OpenDB() *sql.DB {
// 	Database, err = sql.Open("sqlite", "./database/forum.db")
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	return Database
// }

// func CreateTables() {
// 	Database, err = sql.Open("sqlite", "./database/forum.db")
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer Database.Close()

// 	fmt.Println("Database created successfully")

// 	// Read the queries from schema.sql
// 	schemaSQL, err := ioutil.ReadFile("./database/schema.sql")
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	_, err = Database.Exec(string(schemaSQL))
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	fmt.Println("Schema created successfully")

// 	// Sample data initialization
// 	var (
// 		users = []models.User{
// 			{Name: "jehad", Username: "jehada1", Email: "jehadalami11@gmail.com", Password: "$2a$10$PImP96Yugx0JLBKX7jtNuOWZNBM5Tza7/NaiOrx6S9XrkDj/032G.", Age: 22, Gender: "M", FirstName: "jehad", LastName: "alami"},
// 			{Name: "noor", Username: "noora1", Email: "noor1@gmail.com", Password: "$2a$10$9Tlj6GnZETsMKjwL1teBg.kXXv6hA6frc3vzKXvqbUKXvFBptX4fu", Age: 20, Gender: "M", FirstName: "noor", LastName: "al1"},
// 		}
// 		categories = []models.Category{
// 			{Libelle: "Health", Icon: "&#128657;"},
// 			{Libelle: "Sciences", Icon: "&#128300;"},
// 			// Add other categories...
// 		}
// 		posts = []models.Post{
// 			{
// 				Title:     "Two new targets to support LeBron James at the Lakers",
// 				Content:   "After a series of excellent signings at the start of NBA Free Agency...",
// 				ImagePath: "",
// 				VideoPath: "",
// 				UserId:    2,
// 			},
// 		}
// 	)

// 	if InitUser(users) {
// 		fmt.Println("Users created successfully")
// 	} else {
// 		fmt.Println("Failed to create users")
// 	}

// 	if InitCategorie(categories) {
// 		fmt.Println("Categories created successfully")
// 	} else {
// 		fmt.Println("Failed to create categories")
// 	}

// 	if InitPosts(posts) {
// 		fmt.Println("Posts created successfully")
// 	} else {
// 		fmt.Println("Failed to create posts")
// 	}
// }

// func InitUser(users []models.User) bool {
// 	ok := true
// 	for _, user := range users {
// 		_, err := models.Register(Database, user)
// 		if err != nil {
// 			ok = false
// 		}
// 	}
// 	return ok
// }

// func InitCategorie(categories []models.Category) bool {
// 	ok := true
// 	for _, category := range categories {
// 		_, err := models.CreateCategory(Database, category)
// 		if err != nil {
// 			ok = false
// 		}
// 	}
// 	return ok
// }

// func InitPosts(posts []models.Post) bool {
// 	ok := true
// 	for _, post := range posts {
// 		_, err := models.CreatePost(Database, post, nil)
// 		if err != nil {
// 			ok = false
// 		}
// 	}
// 	return ok
// }

//=================sec====================================

package database

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"real-time-forum/models"

	_ "github.com/mattn/go-sqlite3"
)

var (
	Database *sql.DB
	err      error
)

func OpenDB() *sql.DB {
	Database, err = sql.Open("sqlite3", "./database/forum.db")
	if err != nil {
		log.Fatal(err)
	}

	// defer Database.Close()

	return Database
}

func CreateTables() {
	// Create the database named forum.db in database
	Database, err = sql.Open("sqlite3", "./database/forum.db")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Database create successfully")

	defer Database.Close()

	// Read the queries in schema.sql
	schemaSQL, err := ioutil.ReadFile("./database/schema.sql")
	if err != nil {
		log.Fatal(err)
	}
	// Execute the queries in schema.sql
	_, err = Database.Exec(string(schemaSQL))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Schema create successfully")

	var (
		users = []models.User{
			{Name: "jehad", Username: "jehada1", Email: "jehadalami11@gmail.com", Password: "$2a$10$li2iQoCTVxEJa2/oK/OuDuyHXU5.uPntFvmFTcqxU0.5xLeiWcED.", Age: 22, Gender: "M", FirstName: "jehad", LastName: "alami"},
			{Name: "noor", Username: "noora1", Email: "noor1@gmail.com", Password: "$2a$10$li2iQoCTVxEJa2/oK/OuDuyHXU5.uPntFvmFTcqxU0.5xLeiWcED.", Age: 20, Gender: "M", FirstName: "noor", LastName: "al1"},
		}

		categories = []models.Category{
			{Libelle: "Health", Icon: "&#128657;"},
			{Libelle: "Sciences", Icon: "&#128300;"},
			{Libelle: "Musics", Icon: "&#127932;"},
			{Libelle: "Sports", Icon: "&#127937;"},
			{Libelle: "Humors", Icon: "&#128526;"},
			{Libelle: "Religions", Icon: "&#128332;"},
			{Libelle: "Researchs", Icon: "&#128373;"},
			{Libelle: "News", Icon: "&#127760;"},
			{Libelle: "Kitchens", Icon: "&#127858;"},
			{Libelle: "Politics", Icon: "&#127757;"},
			{Libelle: "Natures", Icon: "&#127966;"},
			{Libelle: "Technologies", Icon: "&#128752;"},
			{Libelle: "Travels", Icon: "&#128747;"},
		}

		posts = []models.Post{
			{
				Title:     "Two new targets to support .",
				Content:   "After a series of excellent signings at the start of NBA Free Agency,",
				ImagePath: "",
				VideoPath: "",
				UserId:    2,
			},
		}
	)

	if InitUser(users) {
		fmt.Println("Creation users successfully")
	} else {
		fmt.Println("Failed to create users")
	}

	if InitCategorie(categories) {
		fmt.Println("Creation categories successfully")
	} else {
		fmt.Println("Failed to create categories")
	}

	if InitPosts(posts) {
		fmt.Println("Creation posts successfully")
	} else {
		fmt.Println("Failed to create posts")
	}
}

func InitUser(users []models.User) bool {
	ok := true
	for _, v := range users {
		_, err := models.Register(Database, v)
		if err != nil {
			ok = false
		}
	}

	return ok
}

func InitPosts(posts []models.Post) bool {
	ok := true
	for _, v := range posts {
		cat := []models.Category{
			{Id: 4, Libelle: "Sports", Icon: "&#127937;"},
		}
		_, err := models.CreatePost(Database, v, cat)
		if err != nil {
			ok = false
		}
	}

	return ok
}

func InitCategorie(categories []models.Category) bool {
	ok := true
	for _, v := range categories {
		_, err := models.CreateCategory(Database, v)
		if err != nil {
			ok = false
		}
	}

	return ok
}
