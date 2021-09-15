var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var express = require('express');
var timeout = require('connect-timeout');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "praca"
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(timeout('1s'));
app.use(cookieParser());
app.use(haltOnTimedout);

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/addQuest', function (req, res) {
  let user = req.body;
  if(user[1]===true)user[1]=1;
  else user[1]=0;

  con.query(`INSERT INTO quest (value, active) VALUES ('${user[0]}','${user[1]}')`, function (err, result, fields) {
    if (err) throw err;
  });
})

app.get('/getList', function (req, res) {
  con.query(`SELECT * FROM quest ORDER BY active ASC`, function (err, result, fields) {
    if (err) throw err;
    global.globalId = result;
    console.log(result)
  });
  res.end(JSON.stringify(globalId));
});

app.post('/updateQuest', function (req, res) {
  let user = req.body;
  console.log(user);
  if(user[1]===1)user[1]=0;
  else user[1]=1;

  con.query(`UPDATE quest SET active='${user[1]}' WHERE id='${user[0]}'`, function (err, result, fields) {
    if (err) throw err;
  });
})

app.post('/deleteQuest', function (req, res) {
  let user = req.body;

  con.query(`DELETE FROM quest WHERE id='${user[0]}'`, function (err, result, fields) {
    if (err) throw err;
  });
})

con.connect(function(err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
