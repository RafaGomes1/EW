var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')
var UserModel = require('../model/user')
var auth = require('../auth/auth')
var User = require('../controller/user')
const key = require('../config/keys');
const { error } = require('console');
const { v4 : uuidv4 } = require('uuid')


/* Lista todos os users*/
router.get('/', auth.verificaAcesso, function(req, res) {
  User.list()
    .then(dados => res.jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  jwt.sign({userID : req.user._id, role : req.user.role, name : req.user.name},
    key.secretKey,
    {expiresIn : '1h'}, // 1 hora
    function(e, token) {
      if(e)
      {
        res.status(501).jsonp({error : "Erro na geração do token " + error})
      }
      else
      {
        res.status(201).jsonp({token : token})
      }
    })
})

router.get('/login/google', function(req, res, next) {
  res.cookie('redirectUrl', req.query.redirect, {httpOnly : true, secure : true})
  passport.authenticate('google', {scope : ['profile', 'email']})(req, res)
});

router.get('/login/google/callback', passport.authenticate('google', {scope : ['profile', 'email']}), function(req, res, next) {
    console.log('Utilizador autenticado com o google: ' + req.user)

    jwt.sign(
      {
        userID : req.user._id,
        role : req.user.role,
        name : req.user.name
      },
      key.secretKey,
      {
        expiresIn : '1h'
      },
      function(erro, token)
      {
        if (erro)
        {
          return res.status(500).jsonp({error: "Erro na geração do token jwt: " + erro})
        }
        console.log(res.locals.redirectUrl)
        res.token = token
        res.cookie('token', token, {httpOnly : true, secure : true})
        res.redirect('http://localhost:8080/login/callback')
      }
    )
  })

/* GET de um utilizador */
router.get('/:id', auth.verificaAcesso, function(req, res) {
  if(req.params.id === req.userID)
  {
    User.findById(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
  }
  else
  {
    res.status(403).jsonp({
      error : "Unauthorized access."
    })
  }
  
})

/* POST de um utilizador */
router.post('/', auth.verificaAcesso, function(req, res) {
  User.insert(req.body)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(e => {
      res.status(500).jsonp(e)
    })
})

/* POST para registo de um utilizador */
router.post('/register', function(req, res) {
  if(req.body == 0 || req.body == 1)
  {
    var d = new Date().toISOString().substring(0,10)
    UserModel.register(new UserModel({
        _id : uuidv4(),
        email : req.body.email,
        name : req.body.name,
        role : req.body.role,
        active : true,
        dateCreated : d
    }), req.body.password,
    function(err, user) {
      if(err)
      {
        res.jsonp({error : err})
      }
      else
      {
        passport.authenticate("local")(req, res, () => {
          jwt.sign({userID : req.user._id, role : req.user.role},
            key.secretKey,
            {expiresIn : '1h'}, // 1 hora
            function(e, token) {
              if(e)
              {
                res.jsonp({error : e, message : 'Erro na geração do token'})
              }
              else
              {
                res.status(201).jsonp({token : token})
              }
            })
        })
      }
    })
  }
  else
  {
    res.status(500).jsonp({error : 'Registo de conta com tipo de conta não autorizado', message : 'O tipo de conta pedido está reservado ao uso por administradores.'})
  }

})

/* PUT de um utilizador */
router.put('/:id', auth.verificaAcesso, function(req, res) {
  console.log(req.body.userInfo)
  User.updateUser(req.params.id, req.body.userInfo)
    .then(dados => {
      jwt.sign({userID : dados._id, role : dados.role, name : dados.name},
        key.secretKey,
        {expiresIn : '1h'},
        function(e, token)
        {
          if (e)
          {
            res.status(501).jsonp({error: e})
          }
          else
          {
            res.status(201).jsonp({user : dados, token : token})
          }
        })
    })
    .catch(error => {
      res.status(500).jsonp(error)
    })
})

/* PUT para alterar a password de um utilizador */
router.put('/:id/password', auth.verificaAcesso, async (req, res) => {
  try {
    if (req.userID === req.params.id) {
      const dados = await User.updatePassword(req.params.id, req.body);
      console.log('200 ' + JSON.stringify(dados));
      res.status(200).jsonp(dados);
    } else {
      console.log('401 Acesso não autorizado');
      res.status(401).jsonp({ error: "Acesso não autorizado" });
    }
  } catch (erro) {
    console.log('500 ' + JSON.stringify(erro));
    res.status(500).jsonp(erro.message);
  }
});


/* DELETE de um utilizador */
router.delete('/:id', auth.verificaAcesso, function(req, res) {
  User.delete(req.params.id)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.status(500).jsonp(error)
    })
})

module.exports = router;
