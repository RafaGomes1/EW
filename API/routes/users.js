var express = require('express')
var router = express.Router()
var User = require('../controllers/user')
var Auth = require('../auth/auth')

router.get('/:id/favoritos/curso', Auth.verificaAcesso, function(req, res) {
    let userID = req.user.userID
    if(userID == req.params.id)
    {
        if(req.query.id)
        {
            User.verificaCursoFavorito(userID, req.query.id)
                .then(resp => {
                    return res.jsonp({'isFav' : resp})
                })
                .catch(erro => {
                    res.status(500).jsonp(erro)
                })
        }
        else
        {
            User.getCursosFavoritos(userID)
            .then(resp => {
                console.log(resp)
                res.jsonp({favoritos : resp})
            })
            .catch(erro => {
                res.status(500).jsonp(erro)
            })
        }
    }
    else
    {
        res.status(403).jsonp({error : 'Não é possível obter cursos favoritos de outros utilizadores.'})
    }
});

router.get('/:id', Auth.verificaAcesso, function(req, res) {
    User.getName(req.params.id)
        .then(resp => {
            console.log(resp)
            res.jsonp(resp)
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
});

router.post('/:id/favoritos/curso', Auth.verificaAcesso, function(req, res) {
    let userID = req.user.userID
    if(userID == req.params.id)
    {
        User.addCursoFavorito(userID, req.body.id)
            .then(result => {
                console.log('Curso adicionado com sucesso')
                res.status(200).jsonp('Curso adicionado aos favoritos com sucesso!')
            })
            .catch(erro => {
                console.log('Erro ao adicionar curso')
                res.status(500).jsonp('Erro ao adicionar o curso aos favoritos.')
            })
    }
    else
    {
        res.status(403).jsonp({error : 'Não é possível adicionar cursos favoritos de outros utilizadores.'})
    }
})

router.delete('/:id/favoritos/curso', Auth.verificaAcesso, function(req, res) {
    let userID = req.user.userID
    console.log(userID)
    if(userID == req.params.id)
    {
        if(req.query.id)
        {
            User.removeCursoFavorito(userID, req.query.id)
            .then(result => {
                console.log('Curso removido com sucesso')

                res.status(200).jsonp('Curso removido com sucesso dos favoritos')
            })
            .catch(erro => {
                console.log('Erro ao remover curso')

                res.status(500).jsonp('Erro ao remover curso dos favoritos')
            })
        }
        else
        {
            res.status(422).jsonp({erro : 'Informação insuficiente.'})
        }
    }
    else
    {
        res.status(403).jsonp({error : 'Não é possível remover cursos favoritos de outros utilizadores.'})
    }
})


router.get('/:id/favoritos/recurso', Auth.verificaAcesso, function(req, res) {
    let userID = req.user.userID
    if(userID == req.params.id)
    {
        if(req.query.id)
        {
            User.verificaRecursoFavorito(userID, req.query.id)
                .then(resp => {
                    return res.jsonp({'isFav' : resp})
                })
                .catch(erro => {
                    res.status(500).jsonp(erro)
                })
        }
        else
        {
            User.getRecursosFavoritos(userID)
            .then(resp => {
                console.log(resp)
                res.jsonp({favoritos : resp})
            })
            .catch(erro => {
                res.status(500).jsonp(erro)
            })
        }
    }
    else
    {
        res.status(403).jsonp({error : 'Não é possível obter recursos favoritos de outros utilizadores.'})
    }
})

router.post('/:id/favoritos/recurso', Auth.verificaAcesso, function(req, res) {
    let userID = req.user.userID
    if(userID == req.params.id)
    {
        User.addRecursoFavorito(userID, req.body.id)
            .then(result => {
                console.log('Recurso adicionado com sucesso')
                res.status(200).jsonp('Recurso adicionado aos favoritos com sucesso!')
            })
            .catch(erro => {
                console.log('Erro ao adicionar Recurso')
                res.status(500).jsonp('Erro ao adicionar o Recurso aos favoritos.')
            })
    }
    else
    {
        res.status(403).jsonp({error : 'Não é possível adicionar Recursos favoritos de outros utilizadores.'})
    }
})

router.delete('/:id/favoritos/recurso', Auth.verificaAcesso, function(req, res) {
    let userID = req.user.userID
    if(userID == req.params.id)
    {
        if(req.query.id)
        {
            User.removeRecursoFavorito(userID, req.query.id)
            .then(result => {
                res.status(200).jsonp('Recurso removido com sucesso dos favoritos')
            })
            .catch(erro => {
                res.status(500).jsonp('Erro ao remover Recurso dos favoritos')
            })
        }
        else
        {
            res.status(422).jsonp({erro : 'Informação insuficiente.'})
        }
    }
    else
    {
        res.status(403).jsonp({error : 'Não é possível remover Recursos favoritos de outros utilizadores.'})
    }
})

module.exports = router