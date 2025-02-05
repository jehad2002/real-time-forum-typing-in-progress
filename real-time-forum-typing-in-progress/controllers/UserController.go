package controllers

import (
	"encoding/json"
	"net/http"
	"regexp"
	"strconv"
	"sync"
	"real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/utils"
	"time"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

type LoginResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

var ERRORREGISTER = ""

type Session struct {
	ID       string
	Data     map[string]string
	ExpireAt time.Time
}

var sessions = make(map[string]Session)
var mu sync.Mutex

func CheckPasswordHash(hash, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

var Status = make(map[string]bool)

func CheckSession(w http.ResponseWriter, user models.User) (string, int, error) {
	if Status[user.Username] {
		for sessionID, session := range sessions {
			if session.Data["userID"] == strconv.Itoa(user.Id) {
				delete(sessions, sessionID)
			}
		}
	}

	sessionID, userID, err := CreateSession(w, user)
	return sessionID, userID, err

}

func CreateSession(w http.ResponseWriter, user models.User) (string, int, error) {
	Status[user.Username] = true
	sessionID, _ := uuid.NewV7()
	expiration := time.Now().Add(1 * time.Hour)
	session := Session{
		ID:       sessionID.String(),
		Data:     make(map[string]string),
		ExpireAt: expiration,
	}
	session.Data["userID"] = strconv.Itoa(user.Id)
	session.Data["username"] = user.Username
	session.Data["Name"] = user.Name
	sessions[session.ID] = session
	cookie := &http.Cookie{
		Name:     "sessionID",
		Value:    sessionID.String(),
		Expires:  expiration,
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
	}
	http.SetCookie(w, cookie)

	return sessionID.String(), user.Id, nil
}

func RequiereLogin(r *http.Request) (bool, Session) {
	sessionCookie, err := r.Cookie("sessionID")
	if err != nil {
		return false, Session{}
	}
	mu.Lock()
	defer mu.Unlock()
	session, found := sessions[sessionCookie.Value]
	if !found {
		return false, Session{}
	} else if session.ExpireAt.Before(time.Now()) {
		delete(sessions, sessionCookie.Value)
		return false, Session{}
	}
	_, ok := session.Data["userID"]
	return ok, session
}

func CheckSessionHandler(w http.ResponseWriter, r *http.Request) {
	loggedIn, session := RequiereLogin(r)
	if loggedIn {
		utils.RespondWithJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"name":    session.Data["Name"],
			"userID":  session.Data["userID"],
		})
	} else {
		utils.RespondWithJSON(w, http.StatusOK, map[string]interface{}{
			"success": false,
			"name":    "",
			"userID":  "",
		})
		notifyUserStatusUpdate(session.Data["userID"], "off")
	}
}

func CheckLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	usr, err := models.CheckUser(database.OpenDB(), user.Username)
	var sessionID string
	var userID int

	if err != nil || !CheckPasswordHash(usr.Password, user.Password) {
		utils.RespondWithError(w, http.StatusUnauthorized, "Invalid username or password")
		return
	} else {
		sessionID, userID, err = CheckSession(w, usr)
	}

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := map[string]interface{}{
		"success":   true,
		"message":   "Login successful",
		"sessionID": sessionID,
		"userID":    userID,
		"name":      usr.Name,
	}

	utils.RespondWithJSON(w, http.StatusOK, response)
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	_, session := RequiereLogin(r)
	sessionID, err := r.Cookie("sessionID")
	if err == nil {
		notifyUserStatusUpdate(session.Data["userID"], "off")
		mu.Lock()
		delete(sessions, sessionID.Value)
		mu.Unlock()
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Logout successful",
	}
	utils.RespondWithJSON(w, http.StatusOK, response)
}

func GetUserIDHandler(w http.ResponseWriter, r *http.Request) {
	loggedIn, session := RequiereLogin(r)
	if loggedIn {
		userID := session.Data["userID"]
		utils.RespondWithJSON(w, http.StatusOK, map[string]interface{}{
			"userID": userID,
		})
	} else {
		utils.RespondWithJSON(w, http.StatusOK, map[string]interface{}{
			"userID": nil,
		})
	}
}

func isValidEmail(email string) bool {
	pattern := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	regex := regexp.MustCompile(pattern)
	return regex.MatchString(email)
}

func CheckPassWord(password string) bool {
	re := regexp.MustCompile(`^[A-Za-z0-9!@#$^()_+]*[A-Z][A-Za-z0-9!@#$^()_+]*[a-z][A-Za-z0-9!@#$^()_+]*[!@#$^()_+][A-Za-z0-9!@#$^()_+]*$`)
	if !re.MatchString(password) || len(password) < 5 {
		return false
	}
	return true
}

func HashPassword(psword string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(psword), bcrypt.DefaultCost)
	return string(bytes), err
}

type ErrorResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func CheckRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithErrorJSON(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		respondWithErrorJSON(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	user.Id = 1

	if user.Name == "" || user.Username == "" || user.Email == "" || user.Password == "" || user.Age <= 0 {
		respondWithErrorJSON(w, http.StatusBadRequest, "Invalid registration data")
		return
	}

	if !isValidEmail(user.Email) {
		respondWithErrorJSON(w, http.StatusBadRequest, "format email invalide")
		return
	}

	if user.Age < 0 {
		respondWithErrorJSON(w, http.StatusBadRequest, "Age must be greater than 0")

		return
	}

	_, err := models.CheckUser(database.OpenDB(), user.Username)
	if err == nil {
		respondWithErrorJSON(w, http.StatusConflict, "Username already exists, choose another")
		return
	}

	_, err = models.CheckUser(database.OpenDB(), user.Email)
	if err == nil {
		respondWithErrorJSON(w, http.StatusConflict, "Email already exists, choose another")
		return
	}

	hashedPassword, err := HashPassword(user.Password)
	if err != nil {
		respondWithErrorJSON(w, http.StatusInternalServerError, "Internal server error")
		return
	}
	user.Password = hashedPassword

	userID, err := models.Register(database.OpenDB(), user)
	if err != nil {
		respondWithErrorJSON(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Registration successful",
		"userID":  userID,
	}

	respondWithJSON(w, http.StatusOK, response)
}

func respondWithErrorJSON(w http.ResponseWriter, status int, message string) {
	response := ErrorResponse{
		Success: false,
		Message: message,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(response)
}

func respondWithJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
