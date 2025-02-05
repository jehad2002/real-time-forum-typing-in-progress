package main

import (
	"real-time-forum/database"
	"real-time-forum/routes"
)

func main() {
	database.CreateTables()
	routes.SetupRoutes()
}
