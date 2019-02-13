const express = require('express');
const path = require('path');
const request = require('request')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var api = require('./api')
var passport = require('./passport')(api);

var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(session({
  secret: 'someEncryptionKey',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/provider', passport.authenticate('oauth2Provider'));
app.get('/signin-saxobank/internal', passport.authenticate('oauth2Provider', { successRedirect: '/', failureRedirect: '/failure' }));

app.get('/', (req, res) => {
  if(req.isAuthenticated()) {
    api.getInstruments(req.user.accessToken, (err, instruments) => {
      res.render('users.html', {
        user: req.user,
        users: instruments,
        title: "Stocks",
        header: "Some users"
      });
    })
  } else {
    res.redirect('/auth/provider')
  }
});

app.listen(10086);
console.log('Express started on port 10086');