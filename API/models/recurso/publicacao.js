var mongoose = require('mongoose');

var publicacaoSchema = new mongoose.Schema({
    _id : String, // Gerado automaticamente
    cursoId : String, // _id do curso
    idRecurso : String, // _id do recurso pertencente ao curso
    conteudo : String, // Conteudo da publicação
    dataRegisto : Date, // Data de registo da publicação
    idAutor : String, // Id do utilizador que criou o post
    autor : String, // Nome do utilizador com o id referenciado em idAutor
    listaComentarios : [{
        idUser : String,
        nomeUser : String,
        comentario : String
    }],
}, { versionKey: false });

module.exports = mongoose.model('publicacao', publicacaoSchema, 'publicacao')
