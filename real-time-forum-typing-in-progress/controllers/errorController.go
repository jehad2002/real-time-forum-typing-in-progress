package controllers

import (
	"html/template"
	"net/http"
)

type ErrorPage struct {
	StatusCode  int
	Message     string
	Description string
}

func ManaginErr(w http.ResponseWriter, code int, descript string) {
	errorPage := new(ErrorPage)
	errorPage.StatusCode = code
	errorPage.Message = http.StatusText(errorPage.StatusCode)
	errorPage.Description = descript
	ErrorHandlerHelp(w, errorPage)
	return
}

func ErrorHandlerHelp(w http.ResponseWriter, errorPage *ErrorPage) {
	parse, err := template.ParseFiles("./views/templates/error.html")
	if err != nil {
		ErrorHandlerHelp(w, errorPage)
		return
	}
	if errorPage.StatusCode != 0 {
		if w.Header().Get("Content-Type") == "" {
			w.WriteHeader(errorPage.StatusCode)
		}
	}
	err = parse.Execute(w, errorPage)
	if err != nil {
		http.Error(w, "Error rendering the template", http.StatusInternalServerError)
		return
	}
}

func NotFound(w http.ResponseWriter, r *http.Request) {
	respondWithErrorJSON(w, http.StatusNotFound, "Page not found")
}
