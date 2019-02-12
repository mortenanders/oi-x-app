const express = require('express');
const path = require('path');
const OAuth2Strategy = require('passport-oauth2');
const passport = require('passport');

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://idp.blue.sso.sys.dom/authorize',
  tokenURL: 'https://idp.blue.sso.sys.dom/token',
  clientID: "d28482920be44bdd890a99abea2cd412",
  clientSecret: "cc5c2eb7a02e466e9f11aafd11d4b8f5",
  callbackURL: "http://localhost:10086/signin-saxobank/internal/"
},
function(err, accessToken, refreshToken, profile, cb) {
  console.log(err);
}
));

var app = module.exports = express();
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));

// Dummy users
var users = [
  { name: 'tobi', email: 'tobi@learnboost.com' },
  { name: 'loki', email: 'loki@learnboost.com' },
  { name: 'jane', email: 'jane@learnboost.com' }
];

app.use(passport.authenticate('oauth2', { failureRedirect: '/login' }));

app.get('/', function(req, res){
  res.render('users.html', {
    users: users,
    title: "EJS example",
    header: "Some users"
  });
});


/* istanbul ignore next */
if (!module.parent) {
  app.listen(10086);
  console.log('Express started on port 10086');
}
