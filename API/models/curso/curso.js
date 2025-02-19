var mongoose = require('mongoose');

var cursoSchema = new mongoose.Schema({
    _id : String,
    designacao : String, // Nome do Curso
    descricao : String, // Breve descrição do curso
    idProdutor : String, // id do utilizador produtor responsavel (user.role == 1)
    listaRecursos : [String]
}, { versionKey: false });

module.exports = mongoose.model('curso', cursoSchema, 'curso')
