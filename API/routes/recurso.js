var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var Auth = require('../auth/auth')

// GET /recurso -> Listar todos os recursos
// GET /recurso?tipo=XXXX -> Listar todos os recursos do tipo XXXX
// GET /recurso?autor=XXXX -> Listar todos os recursos do autor XXXX
// GET /recurso?produtor=XXXX -> Listar todos os recursos do produtor XXXX
// GET /recurso?curso=XXXX -> Listar todos os recursos de um curso XXXX
router.get('/', Auth.verificaAcesso, function(req, res, next) {
    if(req.query.tipo)
    {
        Recurso.findByTipo(req.query.tipo)
            .then(data => {
                let result = []
                data.forEach(recurso => {
                    if(recurso.visibilidade == true || recurso.idProdutor == req.user.userID)
                    {
                        result.push(recurso)
                    }
                });
                res.jsonp(result)
            })
            .catch(error => {
                res.jsonp(error)
            })
    }
    else if(req.query.autor)
    {
        Recurso.findByAutor(req.query.autor)
        .then(data => {
            let result = []
                data.forEach(recurso => {
                    if(recurso.visibilidade == true || recurso.idProdutor == req.user.userID)
                    {
                        result.push(recurso)
                    }
                });
            res.jsonp(result)
        })
        .catch(error => {
            res.jsonp(error)
        })
    }
    else if(req.query.produtor)
    {
        Recurso.findByProdutor(req.query.produtor)
        .then(data => {
            let result = []
                data.forEach(recurso => {
                    if(recurso.visibilidade == true || recurso.idProdutor == req.user.userID)
                    {
                        result.push(recurso)
                    }
                });
            res.jsonp(result)
        })
        .catch(error => {
            res.jsonp(error)
        })
    }
    else if(req.query.curso)
    {
        Recurso.findByCurso(req.query.curso)
            .then(data => {
                console.log(req.query.curso)
                console.log(data)
                let result = []
                data.forEach(recurso => {
                    if(recurso.visibilidade == true || recurso.idProdutor == req.user.userID)
                    {
                        result.push(recurso)
                    }
                })
                console.log(result)
                res.jsonp(result)
            }).catch(erro => {
                res.status(500).jsonp(erro)
            })
    }
    else
    {
        Recurso.list()
            .then(data => {
                let result = []
                data.forEach(recurso => {
                    if(recurso.visibilidade == true || recurso.idProdutor == req.user.userID)
                    {
                        result.push(recurso)
                    }
                });
                res.jsonp(result)
            })
            .catch(error => {
                res.jsonp(error)
            })
    }
})

router.get('/info', Auth.verificaAcesso, function(req, res) {
    const queryParams = req.query
    const list = Object.values(queryParams)
    console.log(list)
    Recurso.getRecursosInfo(list)
        .then(info => {
            res.status(200).jsonp(info)
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
})

router.post('/', Auth.verificaAcessoProdutor, function(req, res) {
    Recurso.insert(req.body)
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro))
});


// GET /recurso/tipos -> Listar todos os tipos de recurso
router.get('/tipos', Auth.verificaAcessoProdutor, function(req, res, next) {
    Recurso.listTipos()
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
})

// GET /recurso/tipos/:id -> Listar TIPO pelo seu id
router.get('/tipos/:id', Auth.verificaAcessoProdutor, function(req, res, next) {
    Recurso.findTipoById(req.params.id)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
})


// POST /recurso/tipos -> Adiciona um novo tipo de recurso
router.post('/tipos', Auth.verificaAcessoProdutor, function(req, res, next) {
    Recurso.insertTipo(req.body)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
})

// PUT /recursos/tipos/:id -> Altera a informação de um tipo de recurso pelo seu id
router.put('/tipos/:id', Auth.verificaAcessoProdutor, function(req, res, next) {
    Recurso.updateTipo(req.params.id, req.body)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
})

// DELETE /recursos/tipos/:id -> Apaga a informação de um tipo de recurso pelo seu id
router.delete('/tipos/:id', Auth.verificaAcessoAdmin, function(req, res, next) {
    if (Recurso.findByTipo(req.params.id).length == 0)
    {
        Recurso.deleteTipo(req.params.id)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
    }
    else
    {
        res.status(405).jsonp("Tipo de recurso não pode ser apagado.")
    }
})

// PUT /recursos/classificar/:id -> Adiciona ou altera uma classificação na lista de classificações
router.put('/classificar/:id', Auth.verificaAcesso, function(req, res, next) {
    const { idUtilizador, nrEstrelas } = req.body;
    Recurso.updateClassificacao(req.params.id, idUtilizador, nrEstrelas)
        .then(data => {
            res.jsonp(data)
        })
        .catch(error => {
            res.jsonp(error)
        })
})

// GET /recurso/id -> Procurar o recurso pelo seu id
router.get('/:id', Auth.verificaAcesso, function(req, res, next) {
    Recurso.findById(req.params.id)
        .then(data => {
            if(data.visibilidade == true || data.idProdutor == req.user.userID || req.user.role == 2)
            {
                res.jsonp(data)
            }
            else
            {
                res.status(403).jsonp('')
            }
        })
        .catch(error => {
            res.jsonp(error)
        })
})

// PUT /recurso/:id -> Altera a informação de um recurso pelo seu id
router.put('/:id', Auth.verificaAcessoProdutor, function(req, res, next) {
    Recurso.findById(req.params.id)
        .then(data => {
            if(data.idProdutor == req.user.userID)
            {
                Recurso.update(req.params.id, req.body)
                .then(data => {
                    res.jsonp(data)
                })
                .catch(error => {
                    res.jsonp(error)
                })
            }
            else
            {
                res.status(403).jsonp('Apenas o utilizador produtor de um recurso pode alterar a sua informação')
            }
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
})

// DELETE /recurso/id -> Apaga o registo de um recurso pelo seu id
router.delete('/:id', Auth.verificaAcessoProdutor, function(req, res, next) {
    Recurso.findById(req.params.id)
        .then(data => {
            if(data.idProdutor == req.user.userID || req.user.role == 2)
            {
                Recurso.delete(req.params.id)
                .then(data => {
                    res.jsonp(data)
                })
                .catch(error => {
                    res.jsonp(error)
                })
            }
            else
            {
                res.status(403).jsonp('Apenas o utilizador produtor de um recurso podera eliminar um recurso.')
            }
        })
        .catch(erro => {
            res.jsonp(erro)
        })
})

module.exports = router;