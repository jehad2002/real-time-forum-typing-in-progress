package models

import (
	"database/sql"
)

type PostCategory struct {
	Id         int
	PostId     int
	CategoryId int
}

func CreatePostCategorie(db *sql.DB, postCat PostCategory) (int, error) {
	query := "INSERT INTO PostCategory (PostId, CategoryId) VALUES (?, ?)"
	res, err := db.Exec(query, postCat.PostId, postCat.CategoryId)
	if err != nil {
		return 0, err
	}
	id, er := res.RowsAffected()

	if er != nil {
		return 0, err
	}

	return int(id), nil
}
