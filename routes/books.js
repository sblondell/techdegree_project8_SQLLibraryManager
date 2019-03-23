let express = require('express');
let router = express.Router();
let Book = require('../models').Book;


// ***************************************
//              Homepage.
// ***************************************
router.get('/', (req, res) => {
  Book.findAll().then(response => {
    res.render('index', { books: response });
  }).catch(err => {
    res.send(500);
  });
});

// ***************************************
//           Adding a new book.
// ***************************************
router.get('/new', (req, res) => {
  res.render('addbook', { book: Book.build() });
});
router.post('/', (req, res) => {
  Book.create(req.body).then(book => {
    res.redirect(`/books`);
  }).catch(err => {
    if (err.name === "SequelizeValidationError") {
      res.render('addbook', {
        errors: err.errors,
        book: Book.build(req.body)
      });
    } else {
      throw err;
    }
  });
});

// ***********************************************************
//  Displaying one book with edit, cancel, and delete options
// ***********************************************************
router.get('/:id', (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    if (book) {
      res.render('book', { bookid: req.params.id, book });
    } else {
      res.send(404);
    }
  }).catch(() => {
    res.send(500);
  });
});

// ***************************************
//           Deleting a book.
// ***************************************
router.post('/:id/delete', (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    if (book) {
      return book.destroy();
    } else {
      res.send(404);
    }
  }).then(() => {
    res.redirect('/');
  }).catch(() => {
    res.send(500);
  });
});

// ***************************************
//      Editing and Updating a book.
// ***************************************
router.get('/:id/editbook', (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    if (book) {
      res.render('editbook', {
        newBook: book,
        oldBook: book,
        bookid: req.params.id
      });
    } else {
      res.send(404);
    }
  }).catch(() => {
    res.send(500);
  });
});
router.post('/:id/editbook', (req, res) => {
  Book.findByPk(req.params.id).then(oldBook => {
    return oldBook.update(req.body);
  }).then(() => {
    res.redirect(`/books/${req.params.id}`);
  }).catch(err => {
    if (err.name === "SequelizeValidationError") {
      Book.findByPk(req.params.id).then(oldBook => {
        res.render('editbook', {
          oldBook,
          newBook: Book.build(req.body),
          bookid: req.params.id,
          errors: err.errors
        });
      });
    } else {
      throw err;
    }
  });
});

module.exports = router;
