package models

import (
	"database/sql"
	"fmt"
	"log"
)

type Category struct {
	Id      int
	Libelle string
	Icon    string
}

func CreateCategory(db *sql.DB, categorie Category) (int, error) {
	query := "INSERT INTO Category (libelle, Icon) VALUES (?,?)"

	res, err := db.Exec(query, categorie.Libelle, categorie.Icon)
	if err != nil {
		return 0, err
	}

	id, er := res.RowsAffected()

	if er != nil {
		return 0, err
	}

	return int(id), nil
}

func GetCategorieById(db *sql.DB, Id int) (Category, error) {
	query := "SELECT * FROM Category WHERE Id = ?"
	row := db.QueryRow(query, Id)
	var category Category
	err := row.Scan(&category.Id, &category.Libelle, &category.Icon)
	if err != nil {
		if err == sql.ErrNoRows {
			return category, fmt.Errorf("Category not found")
		}
		return category, err
	}
	return category, nil
}

func GetAllCategories(db *sql.DB) []Category {
	query := "SELECT * FROM Category ORDER BY Libelle ASC"
	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var category Category
		err := rows.Scan(&category.Id, &category.Libelle, &category.Icon)
		if err != nil {
			log.Fatal(err)
		}
		categories = append(categories, category)
	}

	return categories
}

func GetCategoriesByIdPost(db *sql.DB, Id int) []Category {
	query := "SELECT * FROM PostCategory WHERE PostId = ?"
	rows, err := db.Query(query, Id)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var postcat PostCategory
		err := rows.Scan(&postcat.Id, &postcat.PostId, &postcat.CategoryId)
		if err != sql.ErrNoRows {
			category, _ := GetCategorieById(db, postcat.CategoryId)
			categories = append(categories, category)
		}

	}

	return categories
}
