package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	db "real-time-forum/database"
	"real-time-forum/models"
)

func ActionPost(w http.ResponseWriter, r *http.Request) {
	errorPage := new(ErrorPage)
	ok, session := RequiereLogin(r)
	var user models.User
	if !ok {
		//} else {
			fmt.Fprintf(w, "You cannot access posts")
			return
	}
	user.Id, _ = strconv.Atoi(session.Data["userID"])
	u, err := user.GetUser(db.OpenDB())
	if err == nil {
		user = u
	}
	if r.URL.Path != "/actionpost" {
		errorPage.StatusCode = http.StatusNotFound
		errorPage.Message = http.StatusText(errorPage.StatusCode)
		errorPage.Description = "The requested URL " + "'" + r.URL.String() + "'" + " was not found on this server. !!!"
		ErrorHandlerHelp(w, errorPage)
		return
	}
	if r.Method != http.MethodPost {
		errorPage.StatusCode = http.StatusMethodNotAllowed
		errorPage.Message = http.StatusText(errorPage.StatusCode)
		errorPage.Description = "The requested method is not allowed for this resource !!!"
		ErrorHandlerHelp(w, errorPage)
		return
	}
	var likeData models.LikeData
	if err := json.NewDecoder(r.Body).Decode(&likeData); err != nil {
		http.Error(w, "JSON decoding error", http.StatusBadRequest)
		return
	}
	var action models.Action
	action.PostId = likeData.PostID
	action.UserId = user.Id
	act, _ := models.GetActionByPostUser(db.OpenDB(), action)
	if act.Id != 0 {
		if (act.Status == 1 && likeData.Etat == 0) || (act.Status == 0 && likeData.Etat == 3) {
			if act.Status == 1 {
				act.Status = 0
			} else {
				act.Status = 1
			}
			_, err := act.DeleteAction(db.OpenDB())
			if err != nil {
				//fmt.Println("Failed to react")
			}
		} else if (act.Status == 1 && likeData.Etat == 2) || (act.Status == 0 && likeData.Etat == 1) {
			if act.Status == 1 {
				act.Status = 0
			} else {
				act.Status = 1
			}
			_, err := act.UpdateAction(db.OpenDB())
			if err != nil {
				//fmt.Println("Failed to react")
			}
		}
	} else {
		if likeData.Etat == 1 {
			action.Status = 1
			_, err := action.InsertAction(db.OpenDB())
			if err != nil {
				//fmt.Println("Failed to like this post")
			}
		} else if likeData.Etat == 2 {
			action.Status = 0
			_, err := action.InsertAction(db.OpenDB())
			if err != nil {
				//fmt.Println("Failed to dislike this post")
			}
		}
	}
	http.Redirect(w, r, "/", http.StatusSeeOther)
}
func ActionComment(w http.ResponseWriter, r *http.Request) {
	ok, session := RequiereLogin(r)
	var user models.User
	if !ok {
		fmt.Fprintf(w, "You cannot access the data")
		return
	}
	user.Id, _ = strconv.Atoi(session.Data["userID"])
	u, err := user.GetUser(db.OpenDB())
	if err == nil {
		user = u
	}
	if r.URL.Path != "/actioncomment" {
		ManaginErr(w, http.StatusNotFound, "The requested URL "+"'"+r.URL.String()+"'"+" was not found on this server. !!!")
	}
	if r.Method != http.MethodPost {
		ManaginErr(w, http.StatusMethodNotAllowed, "The requested method is not allowed for this resource !!!")
	}
	var likeData models.LikeData
	if err := json.NewDecoder(r.Body).Decode(&likeData); err != nil {
		http.Error(w, "JSON decoding error", http.StatusBadRequest)
		return
	}
	var action models.Action
	action.CommentId = likeData.CommentId
	action.UserId = user.Id
	act, _ := models.GetActionByCommentUser(db.OpenDB(), action)
	if act.Id != 0 {
		if (act.Status == 1 && likeData.Etat == 0) || (act.Status == 0 && likeData.Etat == 3) {
			_, err := act.DeleteAction(db.OpenDB())
			if err != nil {
				fmt.Println("Failed to react")
			} else {
				fmt.Println("Success to react")
			}
		} else if act.Status == 1 && likeData.Etat == 2 || (act.Status == 0 && likeData.Etat == 1) {
			if act.Status == 1 {
				act.Status = 0
			} else {
				act.Status = 1
			}
			_, err := act.UpdateAction(db.OpenDB())
			if err != nil {
				//fmt.Println("Failed to react")
			}
		}
	} else {
		if likeData.Etat == 1 {
			action.Status = 1
			_, err := action.InsertAction(db.OpenDB())
			if err != nil {
				//fmt.Println("Failed to like comment this post")
			}
		} else if likeData.Etat == 2 {
			action.Status = 0
			_, err := action.InsertAction(db.OpenDB())
			if err != nil {
				//fmt.Println("Failed to dislike this post")
			}
		}
	}
	http.Redirect(w, r, "/", http.StatusSeeOther)
}
