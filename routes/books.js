let express = require('express');
let router = express.Router();
let Book = require('../models').Book;


// Homepage.
router.get('/', (req, res, next) => {
  Book.findAll().then(response => {
   	res.render('index', {books: response});
  });
});

// Displaying one book. To be edited, deleted, or cancelled back to homepage.
router.get('/:id', (req, res, next) => {
  const bookid = req.params.id;

  Book.findByPk(bookid).then(book => {
    res.render('book', {bookid, book});
  });
});

// Adding a new book.
router.get('/new', (req, res, next) => {
  res.render('addbook', {book: Book.build()});
});

// Deleting a book.
router.get('/:id/delete', (req, res, next) => {
  res.render('delete');
});
router.post('/:id/delete', (req, res, next) => {
  Book.findByPk(req.params.id).then(book => {
    return book.destroy();
  }).then(() => {
    res.redirect('/');
  });
});

// Confirming the edit of a book.
router.post('/:id/edit', (req, res, next) => {
  const bookid = req.params.id;

  Book.findByPk(bookid).then(oldBook => {
    res.render('editbook', {bookid, oldBook, modifiedBook: req.body});
  });
});


/* This route handles both the updating and creating of a book entry.
 * The 'whoCalled' variable is a hidden input tag in the corresponding parent routes ('addbook', 'editbook')
 * that identifies which submit form activated.
*/
router.post('/', function(req, res, next) {
  const whoCalled = req.body.caller;
  const { title, author, year, genre } = req.body; // Have to destructure and create a new book object manually...
  const newBook = { title, author, year, genre };  // because 'whoCalled' and 'bookid' are not valid model entries

  if (whoCalled === "addbook") {
    Book.create(newBook).then(book => {
      res.redirect(`/books/${book.id}`);
    });
  }else {
    const bookid = req.body.bookid;

    Book.findByPk(bookid).then(book => {
      book.update(newBook);
    }).then(() => {
      res.redirect('/');
    });
  }
});


router.get('/:id/error', (req, res, next) => {
  res.render('formerror', {bookid: req.params.id});
});








module.exports = router;
