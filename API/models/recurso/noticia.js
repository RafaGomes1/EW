var mongoose = require('mongoose');

var noticiaSchema = new mongoose.Schema({
    _id : String, // Gerado automaticamente
    dataNoticia : Date, // Data da noticia
    cursoId : {type : String, required : false}, // _id do curso a que se refere a noticia
    idRecurso : {type : String, required : false}, // _id do recurso pertencente ao curso no valor cursoId
    conteudo : String, // Conteudo da noticia
    autor : String // Pode ser "Sistema" ou "Administrador"
}, { versionKey: false });

module.exports = mongoose.model('noticia', noticiaSchema, 'noticia')
