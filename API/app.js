var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')

var mongoDB = 'mongodb://mongodb:27017/proj'
mongoose.connect(mongoDB)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Erro na conexão ao MongoDB'))
db.once('open', () => {
    console.log("Conexão ao MongoDB realizada com sucesso!")
})

var indexRouter = require('./routes/index');
var noticiaRouter = require('./routes/noticia');
var recursoRouter = require('./routes/recurso');
var publicacaoRouter = require('./routes/publicacao');
var tipoRecursoRouter = require('./routes/tipoRecurso');
var cursoRouter = require('./routes/curso');
var userRouter = require('./routes/users')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/noticia', noticiaRouter);
app.use('/recurso', recursoRouter);
app.use('/publicacao', publicacaoRouter);
app.use('/tipoRecurso', tipoRecursoRouter);
app.use('/curso', cursoRouter);
app.use('/users', userRouter)


module.exports = app;
