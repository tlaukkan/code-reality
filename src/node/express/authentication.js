const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;

module.exports = function (app, config) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new Strategy({
        clientID: config.get('Facebook.clientId'),
        clientSecret: config.get('Facebook.clientSecret'),
        callbackURL: config.get('Facebook.callbackUrl'),
        profileFields: ['id', 'name', 'displayName', 'emails']
    }, (accessToken, refreshToken, profile, cb) => {
        if (profile.emails.length >= 1) {
            profile.email = profile.emails[0].value;
        }
        console.log(profile);
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
            next();
        }
    });

    app.get('/api/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
    app.get('/api/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/api/login'}), (req, res) => {
        res.redirect('/');
    })

};