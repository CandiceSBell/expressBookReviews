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
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});


// Task 2 - Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});


// Task 3 - Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authors = req.params.author;
    const bookDetails = Object.values(books);
    const book = bookDetails.filter((book) => book.author === authors);
    res.status(200).json(book);
});

// Task 4 - Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bookDetails = Object.values(books);
    const book = bookDetails.filter((book) => book.title === title);
    res.status(200).json(book);
});


// Task 5 - Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    const reviews = books[isbn].reviews;
    return res.status(200).json({ reviews: reviews });
});

// Task 10 
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios
function getBookList(){
    return new Promise((resolve,reject)=>{
      resolve(books);
    })
  }
  
  // Get the book list available in the shop
  public_users.get('/',function (req, res) {
    getBookList().then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send("denied")
    );  
  });
  
// Task 11
// Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.
function getFromISBN(isbn){
    let book_ = books[isbn];  
    return new Promise((resolve,reject)=>{
      if (book_) {
        resolve(book_);
      }else{
        reject("Unable to find book!");
      }    
    })
  }
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getFromISBN(isbn).then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send(error)
    )
   });
  
// Task 12
// Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.
function getFromAuthor(author){
    let output = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let book_ = books[isbn];
        if (book_.author === author){
          output.push(book_);
        }
      }
      resolve(output);  
    })
  }
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getFromAuthor(author)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
    );
  });
  
// Task 13
// Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios. 
function getFromTitle(title){
    let output = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let book_ = books[isbn];
        if (book_.title === title){
          output.push(book_);
        }
      }
      resolve(output);  
    })
  }
  
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getFromTitle(title)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
    );
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
