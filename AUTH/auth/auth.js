var jwt = require('jsonwebtoken')
const secret = require('../config/keys')

module.exports.verificaAcesso = function (req, res, next){
    var myToken = req.query.token || req.body.token
    if(myToken){
      jwt.verify(myToken, secret.secretKey , function(e, payload){
        if(e){
          res.status(401).jsonp({error: e})
        }
        else{
          req.userID = payload.userID
          next()
        }
      })
    }
    else{
        console.log('Token inexistente!')
      res.status(401).jsonp({error: "Token inexistente!"})
    }
  }

