/**
 * Module dependencies.

 AppKey/AppSecrets for application 'oixtestapp (565)':
AppKey1: ad0737c5bd1a46618a68351d5ba6c2ac
Secret: 8534053a39894b2099cab1ff31c0d6c0 (Valid from 12/02/2019 00:00:00 to 12/02/2019 23:59:59)

 */


var express = require('express');
var path = require('path');
const OAuth2Strategy = require('passport-oauth2');
const passport = require('passport');

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://idp.blue.sso.sys.dom/authorize',
  tokenURL: 'https://idp.blue.sso.sys.dom/token',
  clientID: "d28482920be44bdd890a99abea2cd412",
  clientSecret: "cc5c2eb7a02e466e9f11aafd11d4b8f5",
  callbackURL: "/signin-saxobank/internal/"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ exampleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

var app = module.exports = express();

// Register ejs as .html. If we did
// not call this, we would need to
// name our views foo.ejs instead
// of foo.html. The __express method
// is simply a function that engines
// use to hook into the Express view
// system by default, so if we want
// to change "foo.ejs" to "foo.html"
// we simply pass _any_ function, in this
// case `ejs.__express`.

app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views

app.set('views', path.join(__dirname, 'views'));

// Path to our public directory

app.use(express.static(path.join(__dirname, 'public')));

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

// Dummy users
var users = [
  { name: 'tobi', email: 'tobi@learnboost.com' },
  { name: 'loki', email: 'loki@learnboost.com' },
  { name: 'jane', email: 'jane@learnboost.com' }
];

app.get('/', function(req, res){
  res.render('users', {
    users: users,
    title: "EJS example",
    header: "Some users"
  });
});

app.get('/auth/example',
  passport.authenticate('oauth2'));

/* istanbul ignore next */
if (!module.parent) {
  app.listen(10086);
  console.log('Express started on port 10086');
}
