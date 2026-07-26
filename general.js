const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Base URL for internal requests (adjust port if necessary)
const BASE_URL = 'http://localhost:5000';

// Task 10: Get all books using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Simulated internal async call or self-fetch
    const response = await axios.get(`${BASE_URL}/books-data`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    // Fallback directly returning books object via Promise
    return Promise.resolve(books)
      .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
      .catch((err) => res.status(500).json({ message: "Error fetching books" }));
  }
});

// Helper endpoint serving book dataset internally
public_users.get('/books-data', function (req, res) {
  return res.status(200).json(books);
});

// Task 11: Get book details based on ISBN using Promises / async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  const findBookByISBN = (isbnKey) => {
    return new Promise((resolve, reject) => {
      if (books[isbnKey]) {
        resolve(books[isbnKey]);
      } else {
        reject("Book not found");
      }
    });
  };

  try {
    const book = await findBookByISBN(isbn);
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 12: Get book details based on Author using Promises / async-await
public_users.get('/author/:author', async function (req, res) {
  const authorParam = req.params.author.toLowerCase();
  
  const findBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const matchingBooks = [];
      Object.keys(books).forEach((key) => {
        if (books[key].author.toLowerCase() === author) {
          matchingBooks.push({
            isbn: key,
            title: books[key].title,
            reviews: books[key].reviews
          });
        }
      });
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found for this author");
      }
    });
  };

  try {
    const matchingBooks = await findBooksByAuthor(authorParam);
    return res.status(200).send(JSON.stringify({ booksbyauthor: matchingBooks }, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 13: Get book details based on Title using Promises / async-await
public_users.get('/title/:title', async function (req, res) {
  const titleParam = req.params.title.toLowerCase();

  const findBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const matchingBooks = [];
      Object.keys(books).forEach((key) => {
        if (books[key].title.toLowerCase() === title) {
          matchingBooks.push({
            isbn: key,
            author: books[key].author,
            reviews: books[key].reviews
          });
        }
      });
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found with this title");
      }
    });
  };

  try {
    const matchingBooks = await findBooksByTitle(titleParam);
    return res.status(200).send(JSON.stringify({ booksbytitle: matchingBooks }, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

module.exports.general = public_users;
