import {initializeSession} from "./session";
import {initializeAuthentication} from "./authentication";
import {initializeRoutes} from "./routes";
import express, {NextFunction, Request, Response} from 'express';
import {Server} from "http";
import {User} from "./model/User";
import uuid = require("uuid");
import {info, infoWithoutContext, infoWithRequestId} from "./util/log";


require('console-stamp')(console, {
    pattern: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
    colors: { stamp: 'yellow', label: 'white', metadata: 'green' }
});


export async function newServer(host: string, port: number): Promise<Server> {
    const app = express();

    app.use(requestIdAndLoggingMiddleware);

    initializeSession(app);

    app.use(spaceSelectionMiddleware);

    await initializeAuthentication(app);

    initializeRoutes(app);

    app.use(express.static('static'));
    app.use(express.static('dist'));


    const server = app.listen(port, host, function () {
        console.log('code-reality - http server listening at local URL: http://' + host + ':' + port + '/');
    });
    return server;
}

function requestIdAndLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
    const oldEnd = res.end;

    // Add request-id header to request if it does not exist.
    if (!req.headers['request-id']) {
        req.headers['request-id'] = uuid.v4().toString();
    }

    // Log request response status code.
    res.end = function (...args: any) {

        const requestId = req.headers['request-id'] as string;
        const user: User = req.user;

        const message = res.statusCode + " " + req.method + " " + req.url;
        if (user) {
            info(user, message);
        } else if (requestId) {
            infoWithRequestId(requestId, message);
        } else {
            infoWithoutContext(message);
        }

        oldEnd.apply(res, args);
    };

    next();
}

function spaceSelectionMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.query.space) {
        console.log("set current space according to query parameter to: " + req.query.space);
        (req as any).session.space = req.query.space;
    }
    next();
}