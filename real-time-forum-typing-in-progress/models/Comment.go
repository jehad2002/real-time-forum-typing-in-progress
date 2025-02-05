package models

import (
	"database/sql"
	"real-time-forum/utils"
	"time"
)

type Comments struct {
	ID               int
	Content          string
	Date             time.Time
	DateFormat       string
	PostID           int
	UserID           int
	Name             string
	Likes            int
	Dislikes         int
	IsLikeComment    bool
	IsDisLikeComment bool
	Replies          []Comments
	ParentID         int
}

func (c *Comments) CreateComment(db *sql.DB) (int, error) {
	query := "INSERT INTO Comment (UserId, PostId, Content, Date,ParentID) VALUES (?, ?, ?, ?,?)"
	date, _ := time.Parse("2006-01-02 15:04:05", time.Now().Format("2006-01-02 15:04:05"))
	res, err := db.Exec(query, c.UserID, c.PostID, c.Content, date, c.ParentID)
	if err != nil {
		return 0, err
	}
	id, er := res.RowsAffected()

	if er != nil {
		return 0, err
	}

	return int(id), nil
}

func (c *Comments) DeleteComment(db *sql.DB) (int, error) {
	query := "DELETE FROM Comment WHERE Id = ?"

	res, err := db.Exec(query, c.ID)
	if err != nil {
		return 0, err
	}
	id, er := res.RowsAffected()

	if er != nil {
		return 0, err
	}

	return int(id), nil
}

func (c *Comments) UpdateComment(db *sql.DB) (int, error) {
	query := "UPDATE Comment Set Content= ? WHERE Id = ?"

	res, err := db.Exec(query, c.Content, c.ID)
	if err != nil {
		return 0, err
	}
	id, er := res.RowsAffected()

	if er != nil {
		return 0, err
	}

	return int(id), nil
}

// func (c *Comments) GetCommentById(db *sql.DB) (Comments, error) {
// 	var comment Comments
// 	query := "SELECT * FROM Comment WHERE Id= ?"
// 	row := db.QueryRow(query, c.ID)
// 	err := row.Scan(
// 		&comment.ID, &comment.Content, &comment.Date, &comment.PostID, &comment.ParentID, &comment.UserID,
// 	)
// 	if err == nil {
// 		return comment, err
// 	}
// 	return comment, nil
// }

func GetCommentById(db *sql.DB, Id int) (Comments, error) {
	query := "SELECT * FROM Comment WHERE Id = ?"
	row := db.QueryRow(query, Id)
	var comment Comments
	err := row.Scan(
		&comment.ID, &comment.Content, &comment.Date, &comment.PostID, &comment.ParentID, &comment.UserID)
	if err != nil || err == sql.ErrNoRows {
		return comment, err
	}
	return comment, nil
}

func (c *Comments) GetAllComment(db *sql.DB) ([]Comments, error) {
	var comments []Comments
	query := "SELECT * FROM Comment"
	rows, err := db.Query(query)
	if err != nil {
		return comments, err
	}
	defer rows.Close()
	for rows.Next() {
		var com Comments
		err := rows.Scan(&com.ID, &com.Content, &com.PostID, &com.Date, &com.UserID)
		if err == sql.ErrNoRows {
			return comments, err
		}
		comments = append(comments, com)
	}
	return comments, nil
}

func GetNumberCommentByIdPost(db *sql.DB, Id int) int {
	n := 0
	query := "SELECT * FROM Comment WHERE PostId = ? AND ParentId = 0"
	rows, err := db.Query(query, Id)
	if err != nil {
		return 0
	}
	defer rows.Close()
	for rows.Next() {
		var com Comments
		err := rows.Scan(&com.ID, &com.Content, &com.PostID, &com.Date, &com.UserID)
		if err != sql.ErrNoRows {
			n++
		}
	}
	return n
}

func GetCommentsFromDatabase(db *sql.DB, userID, PostId int) []Comments {
	query := `
        SELECT * FROM comment WHERE PostId=? ORDER BY Date DESC;
    `
	rows, err := db.Query(query, PostId)
	if err != nil {
		return nil
	}
	defer rows.Close()
	var comments []Comments

	for rows.Next() {
		var comment Comments
		err := rows.Scan(
			&comment.ID, &comment.Content, &comment.Date, &comment.PostID, &comment.ParentID, &comment.UserID,
		)
		if err != nil {
			return nil
		}
		comment.Likes, comment.Dislikes = GetNumberLikeDislikeByIdComment(db, comment.ID)
		user, _ := GetUserById(db, comment.UserID)
		comment.IsLikeComment = LikeComment(db, comment.ID, userID)
		comment.IsDisLikeComment = DisLikeComment(db, comment.ID, userID)
		comment.DateFormat = utils.FormatDate(comment.Date)
		comment.Name = user.Name
		if comment.ParentID == 0 {
			organizedComment := OrganizeCommentWithReplies(comment, userID, db)
			comments = append(comments, organizedComment)
		}
	}
	return comments
}

func OrganizeCommentWithReplies(comment Comments, userID int, db *sql.DB) Comments {
	replies := GetCommentReplies(db, userID, comment.ID)

	for i, reply := range replies {
		organizedReply := OrganizeCommentWithReplies(reply, userID, db)
		replies[i] = organizedReply
	}
	comment.Replies = replies

	return comment
}

func GetCommentReplies(db *sql.DB, userID, commentID int) []Comments {
	query := `
        SELECT * FROM comment WHERE ParentID=?;
    `
	rows, err := db.Query(query, commentID)
	if err != nil {
		return nil
	}
	defer rows.Close()
	var replies []Comments

	for rows.Next() {
		var reply Comments
		err := rows.Scan(
			&reply.ID, &reply.Content, &reply.Date, &reply.PostID, &reply.ParentID, &reply.UserID,
		)
		if err != nil {
			return nil
		}
		reply.Likes, reply.Dislikes = GetNumberLikeDislikeByIdComment(db, reply.ID)
		user, _ := GetUserById(db, reply.UserID)
		reply.Name = user.Name
		reply.IsLikeComment = LikeComment(db, reply.ID, userID)
		reply.IsDisLikeComment = DisLikeComment(db, reply.ID, userID)
		reply.DateFormat = utils.FormatDate(reply.Date)
		reply.Name = user.Name

		replies = append(replies, reply)
	}

	return replies
}
