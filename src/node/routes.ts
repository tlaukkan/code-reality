import {Express} from "express";
import {User} from "./model/User";
import config = require('config');
import {infoWithRequestId} from "./util/log";

export function initializeRoutes(app: Express) {
    app.get('/api/users/current', function (request, response) {
        const requestId = request.headers['request-id'] as string;
        infoWithRequestId(requestId, '/api/users/current: ' + JSON.stringify(request.user));
        response.send(JSON.stringify(request.user));
    });
    app.get('/api/users/current/id-token', function (request, response) {
        const requestId = request.headers['request-id'] as string;
        infoWithRequestId(requestId, '/api/users/current/id-token: ' + JSON.stringify(request.user));
        response.send((request.user as User).idToken);
    });
    app.get('/api/users/current/space', function (request, response) {
        const requestId = request.headers['request-id'] as string;
        if ((request as any).session.space) {
            infoWithRequestId(requestId, '/api/users/current/space: ' + (request as any).session.space);
            response.send((request as any).session.space);
        } else {
            infoWithRequestId(requestId, '/api/users/current/space: ' + "default");
            response.send("default");
        }
    });
    app.get('/api/users/current/cluster-url', function (request, response) {
        response.send(config.get("Cluster.configurationUrl"));
    });
    app.get('/health', function (request, response) {
        response.status(200);
        response.send('');
    });

}
