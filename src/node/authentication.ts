import {Express, Request, Response, NextFunction} from "express";

import uuid from "uuid";
import crypto from 'crypto';
import config from 'config';

import passport from "passport";
import passportLocal from "passport-local";

import {User} from "./model/User";
import {getIdTokenIssuers} from "./util/util";
import {createIdToken, decodeIdToken, validateIdToken} from "./util/jwt";
import {
    error,
    errorWithoutContext,
    errorWithRequestId,
    info,
    infoWithRequestId, warn,
    warnWithoutContext, warnWithRequestId
} from "./util/log";
import {IdTokenIssuer} from "reality-space";

const LocalStrategy = passportLocal.Strategy;

const idTokenIssuers: Map<string, IdTokenIssuer> = new Map<string, IdTokenIssuer>();

export async function initializeAuthentication(app: Express) {

    (await getIdTokenIssuers()).forEach(idTokenIssuer => {
        idTokenIssuers.set(idTokenIssuer.issuer, idTokenIssuer);
    });

    app.use(passport.initialize());
    app.use(passport.session());

    const env = process.env.NODE_ENV || 'dev';
    console.log("code reality - environment: " + env);

    // TODO disable mock login
    passport.use(new LocalStrategy({usernameField: "username"}, function (username: string, password: string, cb) {
        /*if (!env.startsWith('dev')) {
            // Allow mock form login only in development.
            return cb(null, null);
        } else*/ if (password === 'secret') {
            const userId: string = crypto.createHash('sha256').update(username).digest("base64");
            const user = createFormAuthenticatedUser(userId, username, "administrators,users");
            info(user, 'form authentication success: ' + username);
            return cb(null, user);
        } else {
            warnWithoutContext('form authentication success: ' + username);
            return cb(null, null);
        }
    }));

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });

    app.use(function (req, res, next) {
        const requestId = req.headers['request-id'] as string;
        const user = req.user as User;

        if (user) {
            user.requestId = requestId;
        }

        const authenticated: boolean = user !== null && user !== undefined;
        const bearerToken = req.headers.authorization && req.headers.authorization.startsWith("Bearer ");

        // No authentication for the following paths.
        if (req.path.startsWith("/css/") ||
            req.path.startsWith("/login") ||
            req.path.startsWith("/health") ||
            req.path.startsWith("/favicon.ico")) {
            return next();
        }

        // JWT authentication if bearer token exists.
        if (bearerToken) {
            infoWithRequestId(requestId, "authenticating with bearer token and serving.");
            return bearerTokenAuthentication(req, res, next);
        }

        // Form authentication for rest of the cases.
        if (authenticated) {
            return next();
        } else {
            infoWithRequestId(requestId, "redirecting to form login.");
            res.redirect('/login.html');
        }
    });

    app.post('/login', passport.authenticate('local', { session: true, failureRedirect: '/login_failed.html' }), function(req, res) {
        res.redirect('/');
    });

};

function bearerTokenAuthentication(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.headers.authorization) {
            return respondError(req, res, 401, "authorization header does not exist.", undefined);
        }
        const idToken = req.headers.authorization!!.substring("Bearer ".length);
        doJwtAuthentication(req, res, idToken, next);
    } catch (error) {
        return respondError(req, res, 401, "access denied" ,error);
    }
}

function doJwtAuthentication(req: Request, res: Response, idToken: string, next: NextFunction) {
    try {
        const requestId = req.headers['request-id'] as string;
        if (!requestId) {
            return respondError(req, res, 401, "request-ID header does not exist.", undefined);
        }
        const issuer = decodeIdToken(idToken).get("iss") as string;
        if (!issuer) {
            return respondError(req, res, 401, "issuer claim not found.", undefined);
        }
        const idTokenIssuer = idTokenIssuers.get(issuer!! as string)!!;
        if (!idTokenIssuer) {
            return respondError(req, res, 401, "issuer not found from configuration: " + issuer!!, undefined);
        }
        const claims = validateIdToken(idToken, idTokenIssuer.publicKey);
        if (!claims.has("id") || !claims.has("exp") || !claims.has("name") || !claims.get("jti")) {
            return respondError(req, res, 401, "missing mandatory claims.", undefined);
        }

        const tokenId: string = decodeIdToken(idToken).get("jti") as string;
        const userId = claims.get("id")!! as string;
        const userName = claims.get("name")!! as string;
        const groupsString = claims.get("groups");
        const groups = groupsString ? groupsString.split(",") : undefined;
        const user = new User(idToken, tokenId, requestId, userId, userName, groups, issuer);
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            next();
        });
    } catch (error) {
        return respondError(req, res, 401, "access denied" ,error);
    }
}

function createFormAuthenticatedUser(userId: string, username: string, groups: string) {
    const requestId: string = uuid.v4().toString();
    const issuer: string = config.get("IdToken.issuer");
    const privateKeyEncoded: string = config.get("IdToken.privateKey");
    const privateKeyPassword: string = config.get("IdToken.privateKeyPassword");
    const groupsArray = groups.split(',');
    const idToken = createIdToken(issuer, userId, username, groups, privateKeyEncoded, privateKeyPassword);
    const tokenId: string = decodeIdToken(idToken).get("jti") as string;
    const user = new User(idToken, tokenId, requestId, userId, username, groupsArray, issuer);
    return user;
}

function respondError(req: Request, res: Response, status: number, message: string, err: any | undefined) {
    const requestId = req.headers['request-id'] as string;
    const user: User = req.user;

    if (err) {
        if (user) {
            error(user, message, err);
        } else if (requestId) {
            errorWithRequestId(requestId, message, err);
        } else {
            errorWithoutContext(message, err);
        }
    } else {
        if (user) {
            warn(user, message);
        } else if (requestId) {
            warnWithRequestId(requestId, message);
        } else {
            warnWithoutContext(message);
        }
    }

    return res.status(status).send(message);
}