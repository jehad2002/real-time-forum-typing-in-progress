package models

import (
	"database/sql"
)

type LikeData struct {
	UserID    int `json:"userId"`
	PostID    int `json:"postId"`
	CommentId int `json:"commentId"`
	Etat      int `json:"etat"`
}

type Action struct {
	Id        int
	Status    int
	CommentId int
	PostId    int
	UserId    int
}

func (a *Action) InsertAction(db *sql.DB) (int, error) {
	query := "INSERT INTO Action (Status, UserId, PostId, CommentId) VALUES (?, ?, ?, ?)"
	res, err := db.Exec(query, &a.Status, &a.UserId, &a.PostId, &a.CommentId)
	if err != nil {
		return 0, err
	}
	id, er := res.RowsAffected()

	if er != nil {
		return 0, err
	}
	return int(id), nil
}

func (a *Action) UpdateAction(db *sql.DB) (int, error) {
	query := "UPDATE Action SET Status = ? WHERE Id = ?"
	res, err := db.Exec(query, a.Status, a.Id)
	if err != nil {
		return 0, err
	}
	id, err := res.RowsAffected()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}

func (a *Action) DeleteAction(db *sql.DB) (int, error) {
	query := "DELETE FROM Action WHERE Id = ?"
	res, err := db.Exec(query, a.Id)
	if err != nil {
		return 0, err
	}
	id, err := res.RowsAffected()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}

func GetAllAction(db *sql.DB) (int, int, error) {
	query := "SELECT * FROM Action WHERE Etat= 1"
	var actions []Action
	rows, err := db.Query(query)
	if err != nil {
		return 0, 0, err
	}
	defer rows.Close()
	for rows.Next() {
		var a Action
		err := rows.Scan(&a.Id, &a.Status, &a.CommentId, &a.PostId, &a.UserId)
		if err != nil {
			return 0, 0, err
		}
		actions = append(actions, a)
	}
	likes := 0
	unlikes := 0
	for _, a := range actions {
		if a.Status == 1 {
			likes++
		} else {
			unlikes++
		}
	}
	return likes, unlikes, nil
}

func GetNumberLikeByIdPost(db *sql.DB, Id int) (int, int) {
	nLik := 0
	nDisLike := 0
	query := "SELECT * FROM Action WHERE PostId = ?"
	rows, err := db.Query(query, Id)
	if err != nil {
		return 0, 0
	}
	defer rows.Close()
	for rows.Next() {
		var act Action
		err := rows.Scan(&act.Id, &act.Status, &act.UserId, &act.PostId, &act.CommentId)
		if err != sql.ErrNoRows {
			if act.Status == 1 {
				nLik++
			} else if act.Status == 0 {
				nDisLike++
			}
		}
	}
	return nLik, nDisLike
}

func GetNumberLikeByIdComment(db *sql.DB, Id int) int {
	n := 0
	query := "SELECT * FROM Action WHERE CommentId = ? AND Status = 1"
	rows, err := db.Query(query, Id)
	if err != nil {
		return 0
	}
	defer rows.Close()
	for rows.Next() {
		var act Action
		err := rows.Scan(&act.Id, &act.Status, &act.UserId, &act.PostId, &act.CommentId)
		if err != sql.ErrNoRows {
			n++
		}
	}
	return n
}

func GetNumberLikeByIdComments(db *sql.DB, Id int) int {
	n := 0
	query := "SELECT * FROM Action WHERE CommentId = ? AND Status = 1"
	rows, err := db.Query(query, Id)
	if err != nil {
		return 0
	}
	defer rows.Close()
	for rows.Next() {
		var act Action
		err := rows.Scan(&act.Id, &act.Status, &act.UserId, &act.PostId, &act.CommentId)
		if err != sql.ErrNoRows {
			n++
		}
	}
	return n
}

func GetNumberLikeDislikeByIdComment(db *sql.DB, Id int) (int, int) {
	nLik := 0
	nDisLike := 0
	query := "SELECT * FROM Action WHERE CommentId = ?"
	rows, err := db.Query(query, Id)
	if err != nil {
		return 0, 0
	}
	defer rows.Close()
	for rows.Next() {
		var act Action
		err := rows.Scan(&act.Id, &act.Status, &act.UserId, &act.PostId, &act.CommentId)
		if err != sql.ErrNoRows {
			if act.Status == 1 {
				nLik++
			} else if act.Status == 0 {
				nDisLike++
			}
		}
	}
	return nLik, nDisLike
}

func LikePost(db *sql.DB, PostId, UserId int) bool {

	query := "SELECT * FROM Action WHERE PostId = ? AND UserId = ? AND Status = 1"
	rows, err := db.Query(query, PostId, UserId)
	if err != nil {
		return false
	}
	defer rows.Close()
	for rows.Next() {
		var act Action
		err := rows.Scan(&act.Id, &act.Status, &act.UserId, &act.PostId, &act.CommentId)
		if err != sql.ErrNoRows {
			return true
		}
	}
	return false
}

func LikeComment(db *sql.DB, CommentId, UserId int) bool {
	query := "SELECT * FROM Action WHERE CommentId = ? AND UserId = ? AND Status = 1"
	rows, err := db.Query(query, CommentId, UserId)
	if err != nil {
		return false
	}
	defer rows.Close()
	for rows.Next() {
		var act Action
		err := rows.Scan(&act.Id, &act.Status, &act.UserId, &act.PostId, &act.CommentId)
		if err != sql.ErrNoRows {
			return true
		}
	}
	return false
}

func DisLikePost(db *sql.DB, PostId, UserId int) bool {

	query := "SELECT * FROM Action WHERE PostId = ? AND UserId = ? AND Status = 0"
	rows, err := db.Query(query, PostId, UserId)
	if err != nil {
		return false
	}
	defer rows.Close()
	for rows.Next() {
		var act Action
		err := rows.Scan(&act.Id, &act.Status, &act.UserId, &act.PostId, &act.CommentId)
		if err != sql.ErrNoRows {
			return true
		}
	}
	return false
}

func DisLikeComment(db *sql.DB, CommentId, UserId int) bool {

	query := "SELECT * FROM Action WHERE CommentId = ? AND UserId = ? AND Status = 0"
	rows, err := db.Query(query, CommentId, UserId)
	if err != nil {
		return false
	}
	defer rows.Close()
	for rows.Next() {
		var act Action
		err := rows.Scan(&act.Id, &act.Status, &act.UserId, &act.PostId, &act.CommentId)
		if err != sql.ErrNoRows {
			return true
		}
	}
	return false
}

func GetActionByPostUser(db *sql.DB, action Action) (Action, error) {
	var act Action
	query := "SELECT * FROM Action WHERE PostId = ? AND UserId = ?"
	rows := db.QueryRow(query, action.PostId, action.UserId)
	err := rows.Scan(&act.Id, &act.Status, &act.UserId, &act.PostId, &act.CommentId)
	if err != nil {
		return Action{}, err
	}
	return act, nil
}

func GetActionByCommentUser(db *sql.DB, action Action) (Action, error) {
	var act Action
	query := "SELECT * FROM Action WHERE CommentId = ? AND UserId = ?"
	rows := db.QueryRow(query, action.CommentId, action.UserId)
	err := rows.Scan(&act.Id, &act.Status, &act.UserId, &act.PostId, &act.CommentId)
	if err != nil {
		return Action{}, err
	}
	return act, nil
}

func GetActionByUser(db *sql.DB, id int) ([]Action, error) {
	var act []Action
	query := "SELECT * FROM Action WHERE Status = 1 AND UserId=? "
	rows, err := db.Query(query, id)
	if err != nil {
		return act, err
	}
	for rows.Next() {
		var a Action
		err = rows.Scan(&a.Id, &a.Status, &a.CommentId, &a.PostId, &a.UserId)
		if err == nil {
			act = append(act, a)
		}
	}
	return act, nil
}
