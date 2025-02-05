package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

func IsAlphanumericCaractere(input string) bool {
	for _, v := range input {
		if !(v >= 65 && v <= 90) && !(v >= 97 && v <= 122) && !(v >= 48 && v <= 57) && v != 95 {
			return false
		}
	}
	return true
}

func SplitWhiteSpaces(s string) []string {
	var tab []string
	splite := ""
	for i, str := range s {
		if str > 32 {
			splite += string(str)
		} else if splite != "" {
			tab = append(tab, splite)
			splite = ""
		}
		if i == len(s)-1 {
			tab = append(tab, splite)
		}
	}
	return tab
}

func FormatDate(dbDate time.Time) string {
	currentTime := time.Now()

	diff := currentTime.Sub(dbDate)

	var formattedDate string
	if diff.Hours() > 24 {
		days := int(diff.Hours() / 24)
		formattedDate = fmt.Sprintf("%d day ago", days)
	} else if diff.Hours() >= 1 {
		hours := int(diff.Hours())
		formattedDate = fmt.Sprintf("%d h ago", hours)
	} else if diff.Minutes() >= 1 {
		minutes := int(diff.Minutes())
		formattedDate = fmt.Sprintf("%d mn ago", minutes)
	} else {
		formattedDate = "less than a minute ago"
	}

	return formattedDate
}

func AbregerNombreLikesOrComment(likes int) string {
	if likes < 1000 {
		return strconv.Itoa(likes) 
	} else if likes < 1000000 {
		return fmt.Sprintf("%.1fk", float64(likes)/1000) 
	} else if likes < 1000000000 {
		return fmt.Sprintf("%.1fM", float64(likes)/1000000) 
	}
	return strconv.Itoa(likes)
}

func GetContentTab(tab []string) string {
	finalStr := ""
	for i := 0; i < len(tab); i++ {
		finalStr += tab[i]
		if i < len(tab)-1 {
			finalStr += " "
		}
	}
	return finalStr
}

func RespondWithError(w http.ResponseWriter, code int, message string) {
	RespondWithJSON(w, code, map[string]interface{}{"success": false, "error": message})
}

func RespondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}
