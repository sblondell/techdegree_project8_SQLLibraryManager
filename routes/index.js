let express = require('express');
let router = express.Router();


router.get('/', (req, res, next) => {
  res.redirect('/books/page/1');
});

module.exports = router;
