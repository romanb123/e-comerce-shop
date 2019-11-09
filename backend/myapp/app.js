var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var productsRout = require('./routes/productsrout');
var userrout = require('./routes/userrout');
var cartrout = require('./routes/cartrouter');
var orderrout=require('./routes/ordersrouter');
var User = require('./models/usermodel');
var app = express();
mongoose.connect('mongodb://localhost:27017/project4', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("connected");
}).catch(() => {
  console.log("connention failed");
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images", express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
  var usrtid=req.body.userid;
  User.findById(usrtid)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
// app.use((req, res, next) => {
//  console.log(req.body);
// });
app.use('/', indexRouter);
app.use('/', productsRout);
app.use('/', userrout);
app.use('/', cartrout);
app.use('/', orderrout);

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
