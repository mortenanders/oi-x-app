const express = require('express');
const path = require('path');
const OAuth2Strategy = require('passport-oauth2');
const passport = require('passport');


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use('oauth2Provider', new OAuth2Strategy({
  authorizationURL: 'https://idp.blue.sso.sys.dom/authorize',
  tokenURL: 'https://idp.blue.sso.sys.dom/token',
  clientID: "d28482920be44bdd890a99abea2cd412",
  clientSecret: "cc5c2eb7a02e466e9f11aafd11d4b8f5",
  callbackURL: "http://localhost:10086/signin-saxobank/internal/"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(accessToken);
  console.log(profile);
  var user = 
  {
    name: "anonymous",
    accessToken: accessToken
  }
  cb(null, user);
}
));

var app = module.exports = express();
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));

var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));


// Dummy users
var users = [
  { name: 'tobi', email: 'tobi@learnboost.com' },
  { name: 'loki', email: 'loki@learnboost.com' },
  { name: 'jane', email: 'jane@learnboost.com' }
];

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/provider', passport.authenticate('oauth2Provider'));
app.get('/signin-saxobank/internal',
  passport.authenticate('oauth2Provider', { successRedirect: '/',
                                      failureRedirect: '/failure' }));


app.get('/', function(req, res){
  if(req.isAuthenticated()) {
    res.render('users.html', {
      users: users,
      title: "EJS example",
      header: "Some users"
    });
  } else {
    res.redirect('/auth/provider')
  }
  
});




if (!module.parent) {
  app.listen(10086);
  console.log('Express started on port 10086');
}
