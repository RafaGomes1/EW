var express = require('express')
var router = express.Router()
var TipoRecurso = require('../controllers/tipoRecurso')
var Auth = require('../auth/auth')

router.get('/', Auth.verificaAcessoProdutor, function(req, res, next) {
    TipoRecurso.list()
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
});

router.get('/:id', Auth.verificaAcesso, function(req, res, next) {
    TipoRecurso.findById(req.params.id)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
});

router.post('/', Auth.verificaAcessoProdutor, function(req, res, next) {
    TipoRecurso.insert(req.body)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
});

router.put('/:id', Auth.verificaAcessoAdmin, function(req,res,next) {
    TipoRecurso.update(req.params.id, req.body)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
});

router.delete('/:id', Auth.verificaAcessoAdmin, function(req, res, next) {
    TipoRecurso.delete(req.params.id)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
});

module.exports = router