var Publicacao = require('../models/recurso/publicacao')

module.exports.list = () => {
    return Publicacao
        .find()
        .sort({_id : 1})
        .exec()
}

module.exports.findById = (id) => {
    return Publicacao
        .findOne({_id : id})
        .exec()
}

module.exports.update = (id, publicacao) => {
    return Publicacao
        .findByIdAndUpdate(id, publicacao, {new : true})
        .exec()
}

module.exports.insert = (publicacao) => {
    const newPublicacao = new Publicacao(publicacao)
    return newPublicacao.save()
}

module.exports.delete = (id) => {
    return Publicacao
        .findByIdAndDelete({_id : id})
        .exec()
}

module.exports.listByRecurso = (recursoId) => {
    return Publicacao
        .find({idRecurso : recursoId})
        .sort({dataRegisto : -1})
        .exec()
}

module.exports.addComentario = (id, comentario) => {
    return Publicacao
        .findByIdAndUpdate(
            id, 
            { $push: { listaComentarios: comentario } }, 
            { new: true }
        )
        .exec();
}

module.exports.updateNomeUser = (idUser, novoNome) => {
    return Publicacao.find().exec()
        .then(publicacoes => {
            let promises = [];
            publicacoes.forEach(publicacao => {
                if (publicacao.idAutor === idUser) {
                    publicacao.autor = novoNome;
                }
                publicacao.listaComentarios.forEach(comentario => {
                    if (comentario.idUser === idUser) {
                        comentario.nomeUser = novoNome;
                    }
                });
                promises.push(publicacao.save());
            });
            return Promise.all(promises);
        });
}