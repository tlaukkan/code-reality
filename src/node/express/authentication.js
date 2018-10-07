const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;

module.exports = function (app, config) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new Strategy({
        clientID: config.get('Facebook.clientId'),
        clientSecret: config.get('Facebook.clientSecret'),
        callbackURL: config.get('Facebook.callbackUrl'),
    }, (accessToken, refreshToken, profile, cb) => {
        // Could save user to app db
        return cb(null, profile);
    }));

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });

    app.use(function (req, res, next) {
        if (req.path !== '/api/auth/facebook' && req.path !== '/api/auth/facebook/callback' && (!req.user)) {
            res.redirect('/api/auth/facebook');
        } else {
            console.log(req.user);
            next();
        }
    });

    app.get('/api/auth/facebook', passport.authenticate('facebook'));
    app.get('/api/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/api/login'}), (req, res) => {
        res.redirect('/');
    })

};