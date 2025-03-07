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
            users.push({ username: username, password: password });
            return res
            .status(200)
            .json({ message: 'User successfully registred. Now you can login' });
        } else {
            return res.status(404).json({ message: 'User already exists!' });
        }
    }
    return res.status(404).json({ message: 'Unable to register user.' });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    const bookList = JSON.stringify(books, null, 4)
    res.status(200).send(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params
    const book = books[isbn]
    return res.status(200).send(book);
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const { author } = req.params
    const results = Object.values(books).filter(book => book.author === author);
    return res.status(200).send(results);
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
    const { title } = req.params
    const results = Object.values(books).filter(book => book.title === title);
    return res.status(200).send(results);
});

//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
    const { isbn } = req.params
    const book = books[isbn]
    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
