var axios = require('axios')
const authEnv = require('../config/authEnv')
var jwt = require('jsonwebtoken')

module.exports.verifyAcess = (req, res, next) => {
    let token = req.cookies.token
    if(token)
    {
        jwt.verify(token, authEnv.secretKey, function(error, payload) {
            if (error)
            {
                console.log('Access Error: ' + error)
                res.redirect('/login')
            }
            else
            {
                req.userID = payload.userID
                req.userRole = payload.role
                req.userName = payload.name
                next()
            }
        })
    }
    else
    {
        res.redirect('/login')
    }
}

module.exports.verifyAcessProducer = (req, res, next) => {
    let token = req.cookies.token
    if(token)
    {
        jwt.verify(token, authEnv.secretKey, function(error, payload) {
            if (error)
            {
                console.log('Access Error: ' + error)
                res.redirect('/login')
            }
            else
            {
                req.userID = payload.userID
                req.userRole = payload.role
                req.userName = payload.name
                if(req.userRole == 1 || req.userRole == 2)
                {
                    next()
                }
                else
                {
                    res.render('infoPage',{title : 'Operação negada', infoTitle : 'Operação não autorizada', infoContent : 'Operação dísponivel apenas a produtores', redirectURL : '/home', btnText : 'Voltar ao ínicio'})
                }
            }
        })
    }
    else
    {
        res.redirect('/login')
    }
}

module.exports.verifyAcessAdmin = (req, res, next) => {
    let token = req.cookies.token
    if(token)
    {
        jwt.verify(token, authEnv.secretKey, function(error, payload) {
            if (error)
            {
                console.log('Access Error: ' + error)
                res.redirect('/login')
            }
            else
            {
                req.userID = payload.userID
                req.userRole = payload.role
                req.userName = payload.name
                if(req.userRole == 2)
                {
                    next()
                }
                else
                {
                    res.render('infoPage',{title : 'Operação negada', infoTitle : 'Operação não autorizada', infoContent : 'Operação dísponivel apenas a administradores', redirectURL : '/home', btnText : 'Voltar ao ínicio'})
                }
            }
        })
    }
    else
    {
        res.redirect('/login')
    }
}

module.exports.register = data => {
    return axios.post(authEnv.authRoute('/users/register'), data)
    .then(result => {
        return result
    })
    .catch(error => {
        throw error
    })
}

module.exports.login = (data) => {
    console.log(data)
    return axios.post(authEnv.authRoute('/users/login'), data)
        .then(result => {
            console.log('login then result: ' + result)
            return result
        })
        .catch(error => {
            console.log('login catch result:' + error)
            throw error
        })
}

module.exports.login = (data) => {
    console.log(data)
    return axios.post(authEnv.authRoute('/users/login'), data)
        .then(result => {
            console.log('login then result: ' + result)
            return result
        })
        .catch(error => {
            console.log('login catch result:' + error)
            throw error
        })
}

module.exports.googleLogin = () => {
    return axios.get(authEnv.authRoute('/users/login/google'))
        .then(result => {
            console.log('Google then result: ' + result.data)
            return result
        })
        .catch(error => {
            console.log('Google catch error: ' + error)
            throw error
        })
}

module.exports.getUser = (userID, token) => {
    return axios.get(authEnv.authRoute('/users/' + userID + '?token=' + token))
        .then(result => {
            return result
        })
        .catch(error => {
            throw error
        })
}

module.exports.updatePassword = (userID, newPassword, oldPassword, token) => {
    return axios.put(authEnv.authRoute('/users/' + userID + '/password?token=' + token), {'oldPassword' : oldPassword, 'newPassword' : newPassword})
        .then(result => {
            return result
        })
        .catch(error => {
            throw error
        })
}

module.exports.updateUserInfo = (userID, info, token) => {
    data = {
        userInfo : info,
        token : token
    }
    return axios.put(authEnv.authRoute('/users/' + userID), data)
        .then(result => {
            return result
        })
        .catch(erro => {
            throw erro
        })
}

module.exports.editProfile = (userID, token, info) => {
    data = {
        userInfo : info,
        token : token
    }
    return axios.put(authEnv.authRoute('/users/' + userID), data)
        .then(result => {
            return result
        })
        .catch(erro => {
            throw erro
        })
}