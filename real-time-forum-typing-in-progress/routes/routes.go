package routes

import (
	"fmt"
	"log"
	"net/http"
	"real-time-forum/controllers"
)

func SetupRoutes() {
	colorGreen := "\033[32m" 
	colorBlue := "\033[34m"
	colorYellow := "\033[33m"

	fmt.Println(string(colorBlue), "[SERVER_INFO] : Starting local Server...")
	staticDir := http.Dir("./static/")
	staticHandler := http.StripPrefix("/static/", http.FileServer(staticDir))
	http.Handle("/static/", staticHandler)

	//http.HandleFunc("/createpost", controllers.CreatePost)
	http.HandleFunc("/ws", controllers.Message)
	http.HandleFunc("/recupChat", controllers.RecupChatHandler)

	http.HandleFunc("/", controllers.IndexHandler)
	http.HandleFunc("/get_all_posts", controllers.HomeHandler)
	http.HandleFunc("/get_asside_content", controllers.GetAssideContent)
	http.HandleFunc("/login", controllers.CheckLogin)
	http.HandleFunc("/check_session", controllers.CheckSessionHandler)
	http.HandleFunc("/actionpost", controllers.ActionPost)
	http.HandleFunc("/actioncomment", controllers.ActionComment)
	http.HandleFunc("/logout", controllers.LogoutHandler)
	http.HandleFunc("/get_post_comment", controllers.GetPostComment)
	http.HandleFunc("/commentreply", controllers.AddCommentReply)
	http.HandleFunc("/commentpost", controllers.CommentHandler)
	http.HandleFunc("/get_user_id", controllers.GetUserIDHandler)
	http.HandleFunc("/register", controllers.CheckRegister)
	http.HandleFunc("/s", controllers.CloseChatHandler)
	http.HandleFunc("/404", controllers.NotFound)

	fmt.Println(string(colorGreen), "[SERVER_READY] : on http://localhost:3000 ✅ ") 
	fmt.Println(string(colorYellow), "[SERVER_INFO] : To stop the program : Ctrl + c \033[00m")
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatal(err)
	}
}
