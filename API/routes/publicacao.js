var express = require('express')
var router = express.Router();
var Publicacao = require('../controllers/publicacao')
var Auth = require('../auth/auth')

router.get('/', Auth.verificaAcesso, function(req, res, next) {
    if(req.query.idRecurso){
        Publicacao.listByRecurso(req.query.idRecurso)
            .then(data => {
                res.jsonp(data)
            })
            .catch(error => {
                res.jsonp(error)
            })
    }
    else{
        Publicacao.list()
            .then(data => {
                res.jsonp(data)
            })
            .catch(error => {
                res.jsonp(error)
            })
        }
});

router.get('/:id', Auth.verificaAcesso, function(req, res, next) {
    Publicacao.findById(req.params.id)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
})

router.post('/', Auth.verificaAcesso, function(req, res, next) {
    Publicacao.insert(req.body)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
});

router.post('/:id/comentario', Auth.verificaAcesso, function(req, res, next) {
    const comentario = {
        idUser: req.body.idUser,
        nomeUser: req.body.nomeUser,
        comentario: req.body.comentario
    };
    Publicacao.addComentario(req.params.id, comentario)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
});

router.put('/atualiza-nome/:id', Auth.verificaAcesso, function(req, res, next) {
    const novoNome = req.body.name;
    Publicacao.updateNomeUser(req.params.id, novoNome)
        .then(data => {
            res.jsonp(data);
        })
        .catch(error => {
            res.jsonp(error);
        });
});

router.put('/:id', Auth.verificaAcesso, function(req, res, next) {
    Publicacao.findById(req.params.id)
        .then(data => {
            if((data.idAutor == req.user.userID) || req.user.role == 2)
            {
                Publicacao.update(req.params.id,req.body)
                .then(data => {
                    res.status(200).jsonp(data)
                })
                .catch(error => {
                    res.status(500).jsonp(error)
                })
            }
            else
            {
                res.status(403).jsonp({error : 'Não é possível editar publicações de outros utilizadores.'})
            }
        })
        .catch(error => {
            res.status(500).jsonp(error)
        })
});

router.delete('/:id', Auth.verificaAcesso, function(req, res, next) {
    Publicacao.findById(req.params.id)
        .then(data => {
            if((data.idAutor == req.user.userID) || req.user.role == 2)
            {
                Publicacao.delete(req.params.id)
                .then(data => {
                    res.jsonp(data)
                })
                .catch(error => {
                    res.jsonp(error)
                })
            }
            else
            {
                res.status(403).jsonp({error : 'Não é possível apagar publicações de outros utilizadores.'})
            }
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
    

});

module.exports = router