var Noticia = require('../models/recurso/noticia')

// Listar todas as notificas
module.exports.list = () => {
    return Noticia
        .find()
        .sort({dataNoticia : -1})
        .exec()
}

// Procurar uma noticia pelo seu id
module.exports.findById = (id) => {
    return Noticia
        .findOne({_id : id})
        .exec()
}

// Alterar uma Noticia
module.exports.update = (id, noticia) => {
    return Noticia
        .findByIdAndUpdate(id, noticia, {new : true})
        .exec()
}

// Inserir uma nova Noticia
module.exports.insert = (noticia) => {
    // TODO: Verificar aqui como vamos gerar o id, se vai ser sequencial OU 
    // se vamos gerar um id aleatorio. TODO2: Verificar se a data da noticia vem
    // pelo "Forms" ou se temos de atribuir aqui támbem!!!
    const newNoticia = new Noticia(noticia)
    return newNoticia.save()
}

// Apagar uma Noticia
module.exports.delete = (id) => {
    return Noticia
        .findByIdAndDelete({_id : id})
}

