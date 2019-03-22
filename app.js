let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let routes = require('./routes/index');
let books = require('./routes/books');
let sequelize = require('./models').sequelize;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.use('/static', express.static('public'));

app.use('/', routes);
app.use('/books', books);



sequelize.sync().then(() => {
  app.listen(3000);
});

app.use((req, res, next) => {              
    const err = new Error("Page not found.");
    err.status = 404;                        
    next(err);                               
});                                        
app.use((err, req, res, next) => {         
    res.status(err.status || 500);           
    console.error(err);                      
    res.render('error', {error: err});       
});                                        


module.exports = app;
