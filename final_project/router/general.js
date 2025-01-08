const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json("User successfully registered, you can now login.");
      } else {
        return res.status(404).json({Error: "User already exists, please try again with a different username."});    
      }
    } 
    return res.status(404).json({Error: "An error ocurred when trying to register user, please try again."});
  });


// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(200).json({books});
});

// Task 2 - Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
       res.json(books[isbn]);
    } else {
       res.status(404).json({Error: "Book not found"});
    }
});

// Task 3 - Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    if(filteredBooks.length > 0) {
        return res.status(200).json({BookByAuthor: filteredBooks});
    } else {
        return res.status(404).json({Error: "No book found"});
    }
});

// Task 4 - Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filteredTitleBooks = Object.values(books).filter(book => book.title === title);  
    if (filteredTitleBooks.length > 0) {
        return res.status(200).json({BooksByTitle: filteredTitleBooks});
    } else {
        return res.status(404).json({Error: "No book found"});
    }
});

// Task 5 - Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews)
  } else {
    return res.status(404).json({message: "No reviews found for this book"});
  }
});

module.exports.general = public_users;
