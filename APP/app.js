var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var noticiaRouter = require('./routes/noticia');
var recursoRouter = require('./routes/recurso');
var publicacaoRouter = require('./routes/publicacao');
var cursoRouter = require('./routes/curso');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'EngWeb2024', // Troque isso por um segredo seguro em produção
  resave: false,
  saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/noticia', noticiaRouter);
app.use('/recurso', recursoRouter);
app.use('/publicacao', publicacaoRouter);
app.use('/curso', cursoRouter);

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
