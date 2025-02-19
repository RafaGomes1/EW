const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

var userSchema = new mongoose.Schema({
    _id : String,
    email : {
        type : String,
        unique : true,
        index : true
    },
    password : String,
    name : String,
    role : Number,
    googleID : Number,
    active : Boolean, // Para dizer se é um utilizador ativo ou não (para não ter de apagar registo de users)
    dateCreated : String
}, { versionKey : false , collection : 'user'})

userSchema.plugin(passportLocalMongoose, {usernameField : 'email'})

module.exports = mongoose.model('user', userSchema, 'user')