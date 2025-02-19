var express = require('express');
var router = express.Router();
var axios = require("axios");
const { v4: uuidv4 } = require('uuid');
var API = require('../config/apiEnv');
var Auth = require('../controllers/auth');


router.get('/', Auth.verifyAcess, function(req, res, next) {
    console.log("userId: " + req.userID)
    axios.get(API.apiRoute('/publicacao?token=' + req.cookies.token))
        .then(resp1 => {
            var publicacoes = resp1.data
            const message = req.session.message;
            delete req.session.message;
            axios.get(API.apiRoute('/curso?token=' + req.cookies.token))
                .then(resp2 => {
                    var cursos = resp2.data
                    res.status(200).render("listaPublicacoes", {title : 'Página de Publicações', "lPublicacoes" : publicacoes, "lCursos" : cursos, "message" : message, userRole : req.userRole, userId : req.userID})
                })
        })
        .catch(error => {
            res.status(500).render("error", {title : 'Erro', "error" : error, userRole : req.userRole})
        })
});

router.post('/:id/adicionar-comentario', Auth.verifyAcess, function(req, res, next) {
    req.body.idUser = req.userID;
    req.body.nomeUser = req.userName;
    console.log(req.body)

    var result = req.body

    axios.post(API.apiRoute('/publicacao/' + req.params.id + '/comentario?token=' + req.cookies.token), result)
        .then(resp => {
            req.session.message = "Comentario adicionado com sucesso!"
            res.status(200).redirect('/publicacao/' + req.params.id)
        })
        .catch(erro => {
            res.status(504).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
        })
});

router.get('/adicionar', Auth.verifyAcess, function(req, res, next) {
    axios.get(API.apiRoute('/curso?token=' + req.cookies.token))
        .then(resp => {
            var cursos = resp.data
            axios.get(API.apiRoute('/recurso?token=' + req.cookies.token))
                .then(resp1 => {
                    var recursos = resp1.data
                    res.status(200).render("adicionarPublicacao", {title : 'Adicionar nova Publicação', "Cursos" : cursos , "Recursos" : recursos, userRole : req.userRole})
                })
                .catch(erro => {
                    res.status(501).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
                })
        })
        .catch(error => {
            res.status(502).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
        })
});

router.post('/adicionar', Auth.verifyAcess, function(req, res, next) {
    console.log(req.body)

    const uniqueId = uuidv4();

    req.body._id = uniqueId
    req.body.dataRegisto = Date.now()
    req.body.idAutor = req.userID
    req.body.autor = req.userName
    req.body.listaComentarios = []

    var result = req.body

    console.log(result)

    axios.post(API.apiRoute('/publicacao?token=' + req.cookies.token), result)
        .then(resp => {
            console.log("Publicação criada com sucesso!")
            req.session.message = "Publicação criada com sucesso!"
            res.status(200).redirect('/publicacao/' + result._id)
        })
        .catch(erro => {
            res.status(503).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
        })
});

router.get('/edit/:id', Auth.verifyAcess, function(req, res, next) {
    axios.get(API.apiRoute('/publicacao/' + req.params.id + '?token=' + req.cookies.token))
        .then(resp => {
            publicacao = resp.data
            publicacao.dataRegisto = new Date(publicacao.dataRegisto).toISOString().split('T')[0]
            axios.get(API.apiRoute('/curso?token=' + req.cookies.token))
                .then(resp1 => {
                    cursos = resp1.data
                    axios.get(API.apiRoute('/recurso?token=' + req.cookies.token))
                        .then(resp2 => {
                            recursos = resp2.data
                            res.status(200).render("editarPublicacao", {title : 'Editar Publicação',"Publicacao" : publicacao, "Cursos" : cursos, "Recursos" : recursos, userRole : req.userRole})
                        })
                })
        })
        .catch(erro => {
            res.status(502).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
        })
});

router.post('/edit/:id', Auth.verifyAcess, function(req, res, next) {

    var publicacao = req.body
    console.log(publicacao)

    axios.put(API.apiRoute('/publicacao/' + req.params.id + '?token=' + req.cookies.token), publicacao)
        .then(resp => {
            req.session.message = "Publicação editada com sucesso!";
            res.redirect('/publicacao/' + req.params.id)
        })
        .catch(erro => {
            res.status(503).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
        })
});


router.get('/delete/:id', Auth.verifyAcess, function(req, res, next) {
    axios.delete(API.apiRoute('/publicacao/' + req.params.id + '?token=' + req.cookies.token))
        .then(resp => {
            console.log("Publicação eliminada com sucesso!")
            req.session.message = "Publicação eliminada com sucesso!";
            res.redirect('/publicacao')
        })
        .catch(erro => {
            res.status(503).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
        })
});



router.get('/:id', Auth.verifyAcess, function(req, res, next) {
    console.log("userId: " + req.userID)
    axios.get(API.apiRoute('/publicacao/' + req.params.id + '?token=' + req.cookies.token))
        .then(resp => {
            var publicacao = resp.data
            publicacao.dataRegisto = new Date(publicacao.dataRegisto).toISOString().split('T')[0]
            const message = req.session.message;
            delete req.session.message;
            axios.get(API.apiRoute('/recurso/' + publicacao.idRecurso + '?token=' + req.cookies.token))
                .then(resp1 => {
                    var recurso = resp1.data
                    res.status(200).render("paginaPublicacao", {title : 'Ver publicação', "Publicacao": publicacao, "Recurso" : recurso, "message" : message, userRole : req.userRole, userId : req.userID, userRole : req.userRole})
                })
        })
        .catch(erro => {
            res.status(501).render("error", {title : 'Erro', "error" : erro, userRole : req.userRole})
        })
});

module.exports = router;

