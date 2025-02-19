var mongoose = require('mongoose');

var tipoSchema = new mongoose.Schema({
    _id : String,
    designacao : String
}, {versionKey: false});

module.exports = mongoose.model('tipo', tipoSchema, 'tipo')