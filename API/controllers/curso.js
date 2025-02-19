var Curso = require('../models/curso/curso')

module.exports.list = () => {
    return Curso
        .find()
        .sort({designacao : 1})
        .exec()
}

module.exports.findById = (id) => {
    return Curso
        .findOne({_id : id})
        .exec()
}

module.exports.update = (id, curso) => {
    return Curso
        .findByIdAndUpdate(id, curso, {new : true})
        .exec()
}

module.exports.insert = (curso) => {
    const newCurso = new Curso(curso)
    return newCurso.save()
}

module.exports.delete = (id) => {
    return Curso
        .findByIdAndDelete({_id : id})
        .exec()
}

module.exports.insertList = (id, recursoId) => {
    return Curso
        .findByIdAndUpdate(id, { $push: { listaRecursos : recursoId}}, {new : true, useFindAndModify : false})
        .exec()
}

module.exports.getCursosInfo = lista => {
    return Curso.find({_id : {
        $in : lista 
    }}, {_id : 1, designacao : 1, descricao : 1})
    .sort('designacao')
        .then(info => {
            return info
        })
        .catch(erro => {
            throw erro
        })
}

module.exports.getCursosProdutor = idProdutor => {
    return Curso.find({idProdutor : idProdutor})
        .exec()
}