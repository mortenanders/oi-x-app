const express = require('express');
const path = require('path');
const OAuth2Strategy = require('passport-oauth2');
const passport = require('passport');
const request = require('request')


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
  secret: 'someEncryptionKey',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/provider', passport.authenticate('oauth2Provider'));
app.get('/signin-saxobank/internal',
  passport.authenticate('oauth2Provider', { successRedirect: '/',
                                      failureRedirect: '/failure' }));


app.get('/', function(req, res){
  if(req.isAuthenticated()) {
    request({
      url: "https://blue.openapi.sys.dom/openapi/ref/v1/instruments/?$top=10&AssetTypes=Stock",
      headers:{
        authorization: "bearer " + req.user.accessToken
      },
      json: true
    }, (err, response, body) => {
      console.log(JSON.stringify(body, null, 2));
      res.render('users.html', {
        users: body.Data,
        title: "EJS example",
        header: "Some users"
      });
    })
    
  } else {
    res.redirect('/auth/provider')
  }
  
});




if (!module.parent) {
  app.listen(10086);
  console.log('Express started on port 10086');
}
