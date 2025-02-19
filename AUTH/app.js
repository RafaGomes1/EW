var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy
var mongoConfig = require('./config/mongoDbEnv')
var session = require('express-session')
const FileStore = require('session-file-store')(session)
const key = require('./config/keys')
const { v4 : uuidv4 } = require('uuid')
var regAdmin = require('./config/createAdmin')

mongoose.connect(mongoConfig.mongoURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na conexão ao MongoDB'));
db.once('open', () => {
    console.log("Conexão ao MongoDB realizada com sucesso!");
    regAdmin.createAdmin()
});

var User = require('./model/user');
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));

passport.use(new GoogleStrategy({
  clientID: key.googleClientID,
  clientSecret: key.googleClientSecret,
  callbackURL: 'http://localhost:9090/users/login/google/callback',
  profileFields: ['id', 'displayName', 'emails', 'name']
},
async function(accessToken, refreshToken, profile, cb) {
  try {
    const googleID = profile.id;
    const email = profile.emails[0].value;
    let user = await User.findOne({ googleID: googleID });

    if (!user) {
      user = await User.findOne({ email: email });

      if (user) {
        // Update the user to add googleID if found by email
        user.googleID = googleID;
        await user.save();
      } else {
        // Create a new user if not found by googleID and email
        user = new User({
          _id: uuidv4(),
          email: email,
          name: profile.displayName,
          role: -1,
          active: true,
          googleID: googleID,
          dateCreated: new Date().toISOString().substring(0, 10)
        });
        await user.save();
      }
    }

    return cb(null, user);
  } catch (error) {
    return cb(error, null);
  }
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var usersRouter = require('./routes/users');

var app = express();

app.use(session({
    genid: (req) => {
      console.log(`New session: ${req.sessionID}`);
      return uuidv4();
    },
    store: new FileStore(),
    secret: key.secretKey,
    resave: false,
    saveUninitialized: true,
  }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRouter);

module.exports = app;
