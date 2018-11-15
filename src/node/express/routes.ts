import {Express} from "express";
import {User} from "../model/User";
import {createIdToken} from "../util/jwt";

module.exports = function (app: Express) {
    app.get('/api/users/current', function (request, response) {
        console.log('/api/users/current: ' + JSON.stringify(request.user));
        let user: User;
        if (request.user) {
            user = request.user;
        } else {
            user = new User('', 'anonymous');
        }
        response.send(JSON.stringify(user));
    });
    app.get('/api/users/current/id-token', function (request, response) {
        console.log('/api/users/current/id-token: ' + JSON.stringify(request.user));
        let user: User;
        if (request.user) {
            user = request.user;
        } else {
            user = new User('', 'anonymous');
        }

        response.send(createIdToken(user));

    });
    console.log('routes loaded.');
};

