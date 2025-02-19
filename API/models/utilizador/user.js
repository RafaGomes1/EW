var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id : String,
    name : String,
    email : {
        type : String,
        unique : true,
        index : true
    },
    role : Number,
    cursosFavoritos : [String],
    recursosFavoritos : [String]
}, { versionKey: false, collection : 'user' });

module.exports = mongoose.model('user', userSchema, 'user')