var express = require('express');
var router = express.Router();
var Noticia = require('../controllers/noticia')
var Auth = require('../auth/auth')

/* GET de todas as noticias */
router.get('/', Auth.verificaAcesso, function(req, res, next) {
  Noticia.list()
    .then(data => {
        res.jsonp(data)
    })
    .catch(error => {
        res.jsonp(error)
    })
});

// Get de uma noticia pelo seu ID
router.get('/:id', Auth.verificaAcesso, function(req, res, next) {
    Noticia.findById(req.params.id)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
});

router.post('/', Auth.verificaAcessoAdmin, function(req, res, next) {
    // TODO: Verificar o TODO da função insert no controller da noticia.
    Noticia.insert(req.body)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
});

router.put('/:id', Auth.verificaAcessoAdmin, function(req, res, next) {
    console.log(req.body)
    Noticia.update(req.params.id,req.body)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
});

router.delete('/:id', Auth.verificaAcessoAdmin, function(req, res, next) {
    Noticia.delete(req.params.id)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
});

module.exports = router;
