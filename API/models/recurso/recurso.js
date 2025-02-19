var mongoose = require('mongoose');

var recursoSchema = new mongoose.Schema({
    _id : String,
    tipo : String,
    tema : String,
    cursoId : String, 
    titulo : String,
    subtitulo : { type: String, required: false },
    dataCriacao : Date,
    dataRegisto : Date,
    idProdutor : String,
    autor : String,
    visibilidade : Boolean,
    classificacao : [
        {
            idUtilizador : String,
            nrEstrelas : Number
        }
    ],
    filePath : String,
    customFields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: false
    }
}, { versionKey: false });

module.exports = mongoose.model('recurso', recursoSchema, 'recurso');
