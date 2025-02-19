var jwt = require('jsonwebtoken')
const secret = require('../config/keys')

module.exports.verificaAcesso = function(req, res, next) {
    var myToken = req.query.token || req.body.token
    delete req.query.token
    delete req.body.token
    if(myToken){
      jwt.verify(myToken, secret.secretKey , function(e, payload){
        if(e){
          res.status(401).jsonp({error: e})
        }
        else{
          req.user = payload
          next()
        }
      })
    }
    else{
        console.log('Token inexistente!')
      res.status(401).jsonp({error: "Token inexistente!"})
    }
}

module.exports.verificaAcessoProdutor = function(req, res, next) {
  var myToken = req.query.token || req.body.token
    delete req.query.token
    delete req.body.token
    if(myToken){
      jwt.verify(myToken, secret.secretKey , function(e, payload){
        if(e){
          res.status(401).jsonp({error: e})
        }
        else{
          if (payload.role == 1 || payload.role == 2)
          {
            req.user = payload
            next()
          }
          else
          {
            res.status(401).jsonp({error : 'Operação não autorizada.'})
          }
        }
      })
    }
    else{
        console.log('Token inexistente!')
      res.status(401).jsonp({error: "Token inexistente!"})
    }
}

module.exports.verificaAcessoAdmin = function(req, res, next) {
  var myToken = req.query.token || req.body.token
    delete req.query.token
    delete req.body.token
    if(myToken){
      jwt.verify(myToken, secret.secretKey , function(e, payload){
        if(e){
          res.status(401).jsonp({error: e})
        }
        else{
          if (payload.role == 2)
          {
            req.user = payload
            next()
          }
          else
          {
            res.status(401).jsonp({error : 'Operação não autorizada.'})
          }
        }
      })
    }
    else{
        console.log('Token inexistente!')
      res.status(401).jsonp({error: "Token inexistente!"})
    }
}