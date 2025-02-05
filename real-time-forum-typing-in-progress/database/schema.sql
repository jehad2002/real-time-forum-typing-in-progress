DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Post;
DROP TABLE IF EXISTS PostCategory;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS Action;
DROP TABLE IF EXISTS Message;

-- Create the User table
CREATE TABLE User (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name VARCHAR(150),
    Username VARCHAR(50),
    Email VARCHAR(100),
    Password VARCHAR(250),
    Age INTEGER,
    Gender VARCHAR(20),
    FirstName VARCHAR(50),
    LastName VARCHAR(50)
);


-- Create the Category table
CREATE TABLE Category (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Libelle VARCHAR(100),
    Icon VARCHAR(10)
);

-- Create the Post table
CREATE TABLE Post (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Title VARCHAR(250),
    Content TEXT,
    ImagePath VARCHAR(50),
    VideoPath VARCHAR(50),
    Date DATETIME,
    UserId INTEGER,
    FOREIGN KEY (UserId) REFERENCES User(id)
);

-- Create the Post Post_Category
CREATE TABLE PostCategory (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    PostId INTEGER,
    CategoryId INTEGER,
    FOREIGN KEY (PostId) REFERENCES Post(id)
    FOREIGN KEY (CategoryId) REFERENCES Category(id)
);

CREATE TABLE Comment (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Content TEXT,
    Date DATETIME,
    PostId INTEGER,
    ParentID INTEGER,
    UserId INTEGER,
    FOREIGN KEY (PostId) REFERENCES Post(id)
    FOREIGN KEY (UserId) REFERENCES User(id)
);


CREATE TABLE Action (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Status INTEGER,
    UserId INTEGER,
    PostId INTEGER,
    CommentId INTEGER,
    FOREIGN KEY (UserId) REFERENCES User(id)
    FOREIGN KEY (PostId) REFERENCES Post(id)
    FOREIGN KEY (CommentId) REFERENCES Comment(id)
);
CREATE TABLE Message (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Expediteur INTEGER,
    Destinataire INTEGER,
    Contenue TEXT,
    Date DATETIME,
    Lu BOOLEAN DEFAULT 0,
    FOREIGN KEY (Expediteur) REFERENCES User(id),
    FOREIGN KEY (Destinataire) REFERENCES User(id)
);

