const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');


mongoose.connect(config.database);
let db = mongoose.connection;

//Check connection
db.once('open', function(){
  console.log('Connected to MongoDB...');
});


//Check for DB errors
db.on('error', function(err){
  console.log(err);
});
//Init App
const app = express();

//Bring in models
let Article = require('./models/article');


//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//parse application/json
app.use(bodyParser.json())

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//Home route
app.get('/', function(req, res){

    Article.find({}, function(err, articles){
      if(err){
        console.log(err);
      }else{
        res.render('index',{
          title:'Articles',
          articles: articles
        });
      }
    });

    // let articles = [
    //   {
    //     id: 1,
    //     title:'Article One',
    //     author:'Eu',
    //     body:'This is article one'
    //   },
    //   {
    //     id: 2,
    //     title:'Article two',
    //     author:'Eu',
    //     body:'This is article two'
    //   },
    //   {
    //     id: 3,
    //     title:'Article three',
    //     author:'Eu',
    //     body:'This is article three'
    //   }
    // ];

});

//Route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

//Start server
app.listen(3000, function(){
    console.log('Server started on port 3000...');
});
