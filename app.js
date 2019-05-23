var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var flash = require('connect-flash');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var mongoDB = 'mongodb://127.0.0.1/noderestfulljwtoken';
mongoose.connect(mongoDB, { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection Error'));

var indexRouter = require('./routes/main');
// var usersRouter = require('./routes/register');
var movies = require('./routes/movies');
var dashboardRouter = require('./routes/dashboard');
// var authRouter = require('./routes/authenticate');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('secretKey', 'nodeRestApi');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

app.use('/', indexRouter);
// app.use('/register', usersRouter);
app.use('/movies', validateUser, movies);
app.use('/dashboard', dashboardRouter);
// app.use('/authenticate', authRouter);

function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'],
        req.app.get('secretKey'),
        function(err, decoded) {
            if (err) {
                res.json({
                    status: 'error',
                    message: err.message,
                    data: null
                })
            } else {
                req.body.userId = decoded.id;
                next();
            }
        });
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