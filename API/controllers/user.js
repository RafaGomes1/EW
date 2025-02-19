var User = require('../models/utilizador/user')

module.exports.list = () => {
    return User
        .find()
        .sort({_id : 1})
        .exec()
};

module.exports.findById = id => {
    return User
        .findOne({_id : id})
        .exec()
};

module.exports.getName = id => {
    return User.findOne({_id : id})
        .then(user => {
            return user.name
        })
        .catch(erro => {
            throw erro
        })
};

module.exports.create = util => {
    var newUser = new User(util)
    return newUser
        .save()
};

module.exports.update = (id,util) => {
    return User
        .findByIdAndUpdate(id, util, {new : true})
        .exec()
};

module.exports.remove = id => {
    return User
        .findByIdAndDelete({_id : id})
        .exec()
};

module.exports.getCursosFavoritos = (id) => {
    return User.findById(id)
        .then(user => {
            return user.cursosFavoritos
        })
        .catch(erro => {
            throw erro
        })
}

module.exports.getRecursosFavoritos = (id) => {
    return User.findById(id)
        .then(user => {
            return user.recursosFavoritos
        })
        .catch(erro => {
            throw erro
        })
}

module.exports.addCursoFavorito = (id, idCurso) => {
    return User.updateOne({_id : id}, 
    {
        $push : 
        {
            cursosFavoritos : {
                $each : [idCurso],
                $position : 0
            }
        }
    })
    .then(result => {
        return result
    })
    .catch(erro => {
        throw erro
    })
}

module.exports.removeCursoFavorito = (id, idCurso) => {
    return User.updateOne({_id : id} , {
        $pull : {
            cursosFavoritos : idCurso
        }
    })
    .then(result => {
        return result
    })
    .catch(erro => {
        throw erro
    })
}

module.exports.verificaCursoFavorito = (id, idCurso) => {
    return User.findOne({_id : id})
        .then(user => {
            return user.cursosFavoritos.includes(idCurso)
        })
        .catch(erro => {
            throw erro
        })
}

module.exports.addRecursoFavorito = (id, idRecurso) => {
    return User.updateOne({_id : id}, 
    {
        $push : 
        {
            recursosFavoritos : {
                $each : [idRecurso],
                $position : 0
            }
        }
    })
    .then(result => {
        return result
    })
    .catch(erro => {
        throw erro
    })
}

module.exports.removeRecursoFavorito = (id, idRecurso) => {
    return User.updateOne({_id : id} , {
        $pull : {
            recursosFavoritos : idRecurso
        }
    })
    .then(result => {
        return result
    })
    .catch(erro => {
        throw erro
    })
}

module.exports.verificaRecursoFavorito = (id, idRecurso) => {
    return User.findOne({_id : id})
        .then(user => {
            return user.recursosFavoritos.includes(idRecurso)
        })
        .catch(erro => {
            throw erro
        })
}