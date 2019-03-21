let express = require('express');
let router = express.Router();
let Book = require('../models').Book;

router.get('/', (req, res, next) => {
  Book.findAll().then(response => {
    res.send(response[0]);
    //res.render('index');
  });
});
router.get('/:id', (req, res, next) => {
  res.render('book', {bookid: req.params.id});
});
router.get('/new', (req, res, next) => {
  res.render('addbook');
});
router.get('/:id/edit', (req, res, next) => {
  res.render('editbook', {bookid: req.params.id});
});
router.get('/:id/error', (req, res, next) => {
  res.render('formerror', {bookid: req.params.id});
});

module.exports = router;
