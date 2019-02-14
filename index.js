const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var api = require('./api')

var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(session({
    secret: 'someEncryptionKey',
    resave: false,
    saveUninitialized: false
}));

var oauthMiddleware = require('./passport')(app, api);


app.get('/auth/login', oauthMiddleware());
app.get('/signin-saxobank/internal', oauthMiddleware({
    successRedirect: '/',
    failureRedirect: '/failure'
}));

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        api.getInstruments(req.user.accessToken, (err, instruments) => {
            res.render('users.html', {
                user: req.user,
                users: instruments,
                title: "Stocks",
                header: "Some users"
            });
        })
    } else {
        res.redirect('/auth/login')
    }
});


app.listen(10086);
console.log('Express started on port 10086');