var express = require("express");
var router = express.Router();
var Curso = require("../controllers/curso");
var Auth = require("../auth/auth");

router.get("/", Auth.verificaAcesso, function (req, res, next) {
  Curso.list()
    .then((data) => {
      res.jsonp(data);
    })
    .catch((error) => {
      res.jsonp(error);
    });
});

router.get('/produtor/:idProd', Auth.verificaAcessoProdutor, function(req, res) {
  let userID = req.user.userID
  if(userID == req.params.idProd)
  {
    Curso.getCursosProdutor(userID)
      .then(info => {
        res.status(200).jsonp(info)
      })
      .catch(erro => {
        res.status(500).jsonp(erro)
      })
  }
  else
  {
    res.status(403).jsonp({error : 'Não é possível obter cursos de outros produtores.'})
  }
})

router.get('/info', Auth.verificaAcesso, function(req, res) {
  const queryParams = req.query
  const list = Object.values(queryParams)
  console.log(list)
  Curso.getCursosInfo(list)
      .then(info => {
          res.status(200).jsonp(info)
      })
      .catch(erro => {
          console.log(erro)
          res.status(500).jsonp(erro)
      })
})

router.get("/:id", Auth.verificaAcesso, function (req, res, next) {
  Curso.findById(req.params.id)
    .then((data) => {
      res.jsonp(data);
    })
    .catch((error) => {
      res.jsonp(error);
    });
});

router.post("/", Auth.verificaAcessoProdutor, function (req, res, next) {
  Curso.insert(req.body)
    .then((data) => {
      res.jsonp(data);
    })
    .catch((error) => {
      res.jsonp(error);
    });
});

router.put("/:id/recurso", Auth.verificaAcessoProdutor, function (req, res, next) {
  Curso.findById(req.params.id)
    .then(data => {
      if ((data.idProdutor == req.user.userID) || req.user.role == 2)
      {
        Curso.insertList(req.params.id, req.body.recursoId, req.user.userID)
        .then((data) => {
          res.status(200).jsonp(data);
        })
        .catch((error) => {
          res.status(500).jsonp(error);
        });
      }
      else
      {
        res.status(403).jsonp({erro : 'Apenas o produtor de um curso pode alterar os seus recursos'})
      }
    })
    .catch(erro => {
      res.status(500).jsonp(erro)
    })
});

router.put("/:id", Auth.verificaAcessoProdutor, function (req, res, next) {
  Curso.findById(req.params.id)
    .then(data => {
      if((data.idProdutor == req.user.userID) || req.user.role == 2)
      {
        Curso.update(req.params.id, req.body)
        .then((data) => {
          res.jsonp(data);
        })
        .catch((error) => {
          res.jsonp(error);
        });
      }
      else
      {
        res.status(403).jsonp({erro : 'Apenas o produtor pode alterar a informação de um curso'})
      }
    })
  
  
});

router.delete("/:id", Auth.verificaAcessoProdutor, function (req, res, next) {
  Curso.findById(req.params.id)
    .then(data => {
      if((data.idProdutor == req.user.userID) || req.user.role == 2)
      {
        Curso.delete(req.params.id)
        .then((data) => {
          res.jsonp(data);
        })
        .catch((error) => {
          res.jsonp(error);
        });
      }
      else
      {
        res.status(403).jsonp({erro : 'Apenas o produtor pode apagar o seu curso'})
      }
    })
});

module.exports = router;
