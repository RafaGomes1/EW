var express = require('express');
var router = express.Router();
var axios = require("axios");
const { v4: uuidv4 } = require('uuid');
var API = require('../config/apiEnv')
var Auth = require('../controllers/auth');

/* GET home page. */
router.get('/', Auth.verifyAcess, function(req, res, next) {
    axios.get(API.apiRoute('/noticia?token=' + req.cookies.token))
        .then(resp => {
            var noticias = resp.data
            for(let i = 0; i < noticias.length; i++) {
                noticias[i].dataNoticia = new Date(noticias[i].dataNoticia).toISOString().split("T")[0];
            }
            const message = req.session.message;
            delete req.session.message;
            res.status(200).render("listaNoticias", {title : 'Noticias' ,"lNoticias": noticias, "message": message, userRole : req.userRole})
        })
        .catch(erro => {
            res.status(501).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
        })
});

router.get('/adicionar', Auth.verifyAcess, function(req, res, next) {
    axios.get(API.apiRoute('/curso?token=' + req.cookies.token))
        .then(resp => {
            var cursos = resp.data
            axios.get(API.apiRoute('/recurso?token=' + req.cookies.token))
                .then(resp1 => {
                    var recursos = resp1.data
                    res.status(200).render("adicionarNoticia", {title : 'Adicionar Noticia', "Cursos" : cursos, "Recursos" : recursos, userRole : req.userRole})
                })
        })
    
});

router.post('/adicionar', Auth.verifyAcess, function(req, res, next) {
    console.log(req.body)

    const uniqueId = uuidv4();

    req.body._id = uniqueId
    req.body.dataNoticia = Date.now()
    req.body.autor = req.userName

    var result = req.body

    console.log(result)

    axios.post(API.apiRoute('/noticia?token=' + req.cookies.token), result)
        .then(resp => {
            console.log("Noticia publicada com sucesso!")
            req.session.message = "Noticia publicada com sucesso!"
            res.status(200).redirect('/noticia/' + result._id)
        })
        .catch(erro => {
            res.status(503).render("error", {title : 'Erro', "error" : error, userRole : req.userRole})
        })
});

router.get('/edit/:id', Auth.verifyAcessAdmin, function(req, res, next) {
    axios.get(API.apiRoute('/noticia/' + req.params.id + '?token=' + req.cookies.token))
        .then(resp => {
            noticia = resp.data
            noticia.dataNoticia = new Date(noticia.dataNoticia).toISOString().split('T')[0]
            console.log(noticia)
            res.status(200).render("editarNoticia", {title : 'Editar Noticia', "Noticia" : noticia, userRole : req.userRole})
        })
        .catch(erro => {
            res.status(502).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
        })
});

router.post('/edit/:id', Auth.verifyAcessAdmin, function(req, res, next) {

    var noticia = req.body
    console.log(noticia)

    axios.put(API.apiRoute('/noticia/' + req.params.id + '?token=' + req.cookies.token), noticia)
        .then(resp => {
            req.session.message = "Noticia editada com sucesso!";
            res.redirect('/noticia/' + req.params.id)
        })
        .catch(erro => {
            res.status(503).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
        })
});

router.get('/delete/:id', Auth.verifyAcessAdmin, function(req, res, next) {
    axios.delete(API.apiRoute('/noticia/' + req.params.id + '?token=' + req.cookies.token))
        .then(resp => {
            console.log("Noticia eliminada com sucesso!")
            req.session.message = "Noticia eliminada com sucesso!";
            res.redirect('/noticia')
        })
        .catch(erro => {
            res.status(503).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
        })
});

router.get('/:id', Auth.verifyAcess, function(req, res, next) {
    axios.get(API.apiRoute('/noticia/' + req.params.id + '?token=' + req.cookies.token))
        .then(resp => {
            var noticia = resp.data
            noticia.dataNoticia = new Date(noticia.dataNoticia).toISOString().split("T")[0];
            const message = req.session.message;
            delete req.session.message;
            res.status(200).render("paginaNoticia", {title : 'Noticia', "Noticia": noticia, "message" : message, userRole : req.userRole})
        })
        .catch(erro => {
            res.status(504).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
        })
});

module.exports = router;
