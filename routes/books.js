let express = require('express');
let sequelize = require('../models').sequelize;
let router = express.Router();
let Book = require('../models').Book;

const perPage = 10;

/* A function used for paginating a list.
 * @param   {Array}   books - an array of SQL entries in JSON format
 * @param   {Integer} perPage - the number of book entries to break the list into per page
 * @param   {Integer} page - the page to display (not array syntax - page 1 = index 1 = page 2)
 * @return  {Array}   newBooks - an array of the partition of the list
*/
function getMeAPage(books, perPage, page = 1) {
  const newBooks = [];
  const start = (page - 1) * perPage;
  const finish = start + perPage;

  if (books.length < perPage) {
    return books;
  } else {
    for (let i = start; i < finish; i++) {
      if (i < books.length) { newBooks.push(books[i]); }
    }
    return newBooks;
  }
}


// ***************************************
//              Homepage.
// ***************************************
router.get('/page/:pageNum?', (req, res) => {
  Book.findAll().then(response => {
    const pages = Math.ceil(response.length / perPage);
    const books = getMeAPage(response, perPage, req.params.pageNum);

    res.render('index', {
      books,
      pages,
      perPage
    });
  }).catch(err => {
    res.send(500);
  });
});

// ***************************************
//           Adding a new book.
// ***************************************
router.get('/new', (req, res) => {
  res.render('new-book', { book: Book.build() });
});
router.post('/new', (req, res) => {
  Book.create(req.body).then(book => {
    res.redirect(`/books/page/1`);
  }).catch(err => {
    if (err.name === "SequelizeValidationError") {
      res.render('new-book', {
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
      res.render('page-not-found');
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
      res.render('page-not-found');
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
      res.render('update-book', {
        newBook: book,
        oldBook: book,
        bookid: req.params.id
      });
    } else {
      res.render('page-not-found');
    }
  }).catch(() => {
    res.send(500);
  });
});
router.post('/:id/editbook', (req, res) => {
  Book.findByPk(req.params.id).then(oldBook => {
    return oldBook.update(req.body);
  }).then(() => {
    res.redirect(`/books/page/1`);
  }).catch(err => {
    if (err.name === "SequelizeValidationError") {
      Book.findByPk(req.params.id).then(oldBook => {
        res.render('update-book', {
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

router.post('/search', (req, res) => {
  const user_search = req.body.search.toLowerCase();
  const search_type = req.body.search_option;

  sequelize.query(`SELECT * FROM Books WHERE lower(${search_type}) LIKE '%${user_search}%'`,
    { type: sequelize.QueryTypes.SELECT })
    .then(response => {
      const pages = Math.ceil(response.length / perPage);
      const books = getMeAPage(response, perPage);

      res.render('index', {
        books,
        pages,
        perPage
      });
    });
});

module.exports = router;
