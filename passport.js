const OAuth2Strategy = require('passport-oauth2');
const passport = require('passport');
const providerName = 'oauth2';

module.exports = (app, api) => {    
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    passport.use(providerName, new OAuth2Strategy({
            authorizationURL: 'https://idp.blue.sso.sys.dom/authorize',
            tokenURL: 'https://idp.blue.sso.sys.dom/token',
            clientID: 'd28482920be44bdd890a99abea2cd412',
            clientSecret: 'cc5c2eb7a02e466e9f11aafd11d4b8f5',
            callbackURL: 'http://localhost:10086/signin-saxobank/internal/'
        },
        (accessToken, refreshToken, profile, cb) => {
            api.getUser(accessToken, (err, user) => {
                if (err) return cb(err);
                cb(null, {
                    name: user.Name,
                    accessToken: accessToken
                });
            })
        }
    ));

    app.use(passport.initialize());
    app.use(passport.session());
    return (opts) => passport.authenticate(providerName, opts);
}