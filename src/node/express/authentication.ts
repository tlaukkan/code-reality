import {Express} from "express";
import {IConfig} from "config";

import passport from "passport";
import passportFacebook from "passport-facebook";
import {User} from "../model/User";
const Strategy = passportFacebook.Strategy;

export function initializeAuthentication(app: Express, config: IConfig) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new Strategy({
        clientID: config.get('Facebook.clientId'),
        clientSecret: config.get('Facebook.clientSecret'),
        callbackURL: config.get('Facebook.callbackUrl'),
        profileFields: ['id', 'name', 'displayName', 'emails']
    }, (accessToken, refreshToken, profile, cb) => {
        let user: User;
        if (profile.emails && profile.emails.length >= 1) {
            user = new User(profile.emails[0].value, profile.displayName);
        } else {
            user = new User("", "anonymous");
        }
        console.log(JSON.stringify(user));
        return cb(null, user);
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