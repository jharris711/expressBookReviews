const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({ message: 'Error logging in' });
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          data: password,
        },
        'access',
        { expiresIn: 60 }
      );
  
      req.session.authorization = {
        accessToken,
        username,
      };
      return res.status(200).json({message: 'User successfully logged in'});
    } else {
      return res
        .status(208)
        .json({ message: 'Invalid Login. Check username and password' });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const { username } = req.session.authorization;

    if (username) {
        if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];
    
        // Check if the book already has a review by the same user
        if (book.reviews.hasOwnProperty(username)) {
            // Modify the existing review
            book.reviews[username] = review;
            res.status(200).json({message:"Review modified successfully."});
        } else {
            // Add a new review
            book.reviews[username] = review;
            res.status(200).json({message: "Review added successfully."});
        }
        } else {
            res.status(404).json({message: "Book not found."});
        }
    } else {
        res.status(401).json({message: "Unauthorized: Please log in."});
    }
});

regd_users.delete("/auth/review/:isbn", async (req, res) => {
    const { isbn } = req.params;
    const { username } = req.session.authorization;
  
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
  
      // Check if the book has a review by the current user
      if (book.reviews.hasOwnProperty(username)) {
        // Delete the review
        delete book.reviews[username];
        res.status(200).json({message: "Review deleted successfully."});
      } else {
        res.status(404).json({message: "Review not found."});
      }
    } else {
      res.status(404).json({message: "Book not found."});
    }
});
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
