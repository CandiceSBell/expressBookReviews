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

//Task 10 - Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios
const getBookList = () => {
    return new Promise((resolve,reject)=>{
      resolve(books);
  })
}

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    getBookList().then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send("denied")
  );  
});

//Task 11 - Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios
const getFromISBN = (isbn) => {
    let book_ = books[isbn];  
    return new Promise((resolve,reject)=>{
      if (book_) {
        resolve(book_);
      }else{
        reject("Unable to find book!");
    }    
  })
}

//Task 12 - Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios
const getFromAuthor = (author) => {
    let output = [];
    return new Promise((resolve,reject)=>{
      for (let isbn in books) {
        let book_ = books[isbn];
        if (book_.author === author){
          output.push(book_);
        }
      }
      resolve(output);  
  })
}  

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    getFromAuthor(author)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
  );
});

//Task 13 - Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios
const getFromTitle = (title) => {
    let output = [];
    return new Promise((resolve,reject)=>{
      for (let isbn in books) {
        let book_ = books[isbn];
        if (book_.title === title){
          output.push(book_);
        }
      }
      resolve(output);  
  })
}

// Get all books based on title
public_users.get('/title/:title',(req, res) => {
    const title = req.params.title;
    getFromTitle(title)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
  );
});

module.exports.general = public_users;