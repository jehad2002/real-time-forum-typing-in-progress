package models

import (
	"database/sql"
	"log"
	"time"
)

type Post struct {
	Id        int
	Title     string
	Content   string
	ImagePath string
	VideoPath string
	Date      time.Time
	UserId    int
}

func (p *Post) GetPostById(db *sql.DB) (Post, error) {
	query := "SELECT * FROM Post WHERE Id = ?"
	var post Post
	row := db.QueryRow(query, p.Id)
	err := row.Scan(&post.Id, &post.Title, &post.Content, &post.ImagePath, &post.VideoPath, &post.Date, &post.UserId)
	if err == sql.ErrNoRows {
		return post, err
	}

	return post, nil
}

func GetPostById(db *sql.DB, Id int) (Post, error) {
	query := "SELECT * FROM Post WHERE Id = ?"
	row := db.QueryRow(query, Id)
	var post Post
	err := row.Scan(&post.Id, &post.Title, &post.Content, &post.ImagePath, &post.VideoPath, &post.Date, &post.UserId)
	if err != nil || err == sql.ErrNoRows {
		return post, err
	}
	return post, nil
}

func GetAllPost(db *sql.DB) []Post {
	query := "SELECT * FROM Post ORDER BY Date DESC"
	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		err := rows.Scan(&post.Id, &post.Title, &post.Content, &post.ImagePath, &post.VideoPath, &post.Date, &post.UserId)
		if err != nil {
			log.Fatal(err)
		}
		posts = append(posts, post)
	}

	return posts
}

func CreatePost(db *sql.DB, post Post, cat []Category) (int, error) {
	query := "INSERT INTO post (Title, Content, ImagePath, VideoPath, Date, UserId) VALUES (?, ?, ?, ?, ?, ?)"
	date, _ := time.Parse("2006-01-02 15:04:05", time.Now().Format("2006-01-02 15:04:05"))
	res, err := db.Exec(query, post.Title, post.Content, post.ImagePath, post.VideoPath, date, post.UserId)
	if err != nil {
		return 0, err
	}
	id, er := res.RowsAffected()
	idP, e := res.LastInsertId()

	if er != nil || e != nil {
		return 0, err
	}
	for _, v := range cat {
		postcat := PostCategory{
			PostId:     int(idP),
			CategoryId: v.Id,
		}
		CreatePostCategorie(db, postcat)
	}
	return int(id), nil
}

func (p *Post) DeletePost(db *sql.DB) (int, error) {
	query := "DELETE FROM Post WHERE Id= ?"

	res, err := db.Exec(query, p.Id)
	if err != nil {
		return 0, err
	}
	id, er := res.RowsAffected()

	if er != nil {
		// fmt.Println("la")
		return 0, err
	}

	return int(id), nil
}

func (p *Post) UpdatePost(db *sql.DB) (int, error) {
	query := "UPDATE Post Set Title = ?, Content = ?, image = ?, File = ? WHERE Id = ?"

	res, err := db.Exec(query, p.Title, p.Content, p.ImagePath, p.VideoPath, p.Id)
	if err != nil {
		return 0, err
	}
	id, er := res.RowsAffected()

	if er != nil {
		// fmt.Println("la")
		return 0, err
	}

	return int(id), nil
}
