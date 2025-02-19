var TipoRecurso = require('../models/recurso/tipoRecurso')

module.exports.list = () => {
    return TipoRecurso
        .find()
        .sort({designacao : 1})
        .exec()
}

module.exports.findById = (id) => {
    return TipoRecurso
        .findOne({_id : id})
        .exec()
}

module.exports.update = (id, tipoRecurso) => {
    return TipoRecurso
        .findByIdAndUpdate(id, tipoRecurso, {new : true})
        .exec()
}

module.exports.insert = (tipoRecurso) => {
    const newTipoRecurso = new TipoRecurso(tipoRecurso)
    return newTipoRecurso.save()
}

module.exports.delete = (id) => {
    return TipoRecurso
        .findByIdAndDelete({_id : id})
        .exec()
}