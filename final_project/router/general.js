const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message:`User ${username} registered successfully! You can now login.`});
        }
        else {
            return res.status(400).json({message:`User ${username} already exists!`});
        }
    }
    else {
        return res.status(404).json({message: "Unable to register user."});
    }
});

// Task 1 - Get the book list available in the shop
// public_users.get('/',function (req, res) {
//    res.send(JSON.stringify(books, null, 4));
// });

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    try {
      const result = JSON.stringify(books, null, 4);
      res.send(result);
    } catch (error) {
      res.send(`An error ocurred ${error.message}`);
    }
});


// Task 2 - Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//    const isbn = req.params.isbn;
//   res.send(books[isbn]);
// });

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    // Retrieve the ISBN parameter from the request URL and send the corresponding Book's details
    const isbn = req.params.isbn;
    const book = await books[isbn];
  
    if (isbn in books) {
      res.send(book);
    } else {
      res.status(404).json(`The isbn ${isbn} does not exist`);
    }
  });


// Task 3 - Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//    const authors = req.params.author;
//    const bookDetails = Object.values(books);
//    const book = bookDetails.filter((book) => book.author === authors);
//    res.status(200).json(book);
// });

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    // Retrieve the author parameter from the request URL and send the corresponding Book's details
    const author = req.params.author;
    const arrayBooks = Object.values(books);
    const findAuthor = arrayBooks.filter(
      (book) => book.author.toLocaleLowerCase() === author.toLocaleLowerCase()
    );
  
    if (findAuthor.length > 0) {
      res.send(findAuthor);
    } else {
      res.status(404).json(`The author '${author}' does not exist`);
    }
  });


// Task 4 - Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//    const title = req.params.title;
//    const bookDetails = Object.values(books);
//    const book = bookDetails.filter((book) => book.title === title);
//    res.status(200).json(book);
// });

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    // Retrieve the title parameter from the request URL and send the corresponding Book's details
    const title = req.params.title;
    const arrayBooks = Object.values(books);
    const findTitle = arrayBooks.filter(
      (book) => book.title.toLocaleLowerCase() === title.toLocaleLowerCase()
    );
  
    if (findTitle.length > 0) {
      res.send(findTitle);
    } else {
      res.status(404).json(`The title '${title}' does not exist`);
    }
  });


// Task 5 - Get book review
// public_users.get('/review/:isbn',function (req, res) {
//    const isbn = req.params.isbn;
//    if (!books[isbn]) {
//        return res.status(404).json({ message: "Book not found" });
//    }
//   const reviews = books[isbn].reviews;
//    return res.status(200).json({ reviews: reviews });
// });

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    // Retrieve the ISBN parameter from the request URL and send the corresponding Book's review
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (isbn in books) {
      if (book.reviews.length > 0) {
        res.send(book);
      } else {
        res.status(404).send(`The book ${book.title} has no reviews`);
      }
    } else {
      res.status(404).json({ message: `The isbn ${isbn} not exist` });
    }
  });

module.exports.general = public_users;
