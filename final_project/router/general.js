const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (username && password) {
        if (isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User sucessfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists"});
        } 
    }

    return res.status(404).json({message: "Unable to register user."})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];

    Object.keys(books).forEach((key) => {
        if (books[key].author === author) {
        matchingBooks.push(books[key]);
        }
    });

    if (matchingBooks.length > 0) {
        res.send(matchingBooks);
    } else {
        res.status(404).send({ error: 'No books found for this author' });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
        matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    res.send(matchingBooks);
  } else {
    res.status(404).send({ error: 'No books found for this title'});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].review);
});

module.exports.general = public_users;
