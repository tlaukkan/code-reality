import {Express} from "express";
import {User} from "../model/User";

module.exports = function (app: Express) {
    app.get('/api/users/current', function (request, response) {
        console.log('/api/users/current: ' + JSON.stringify(request.user));
        if (request.user) {
            response.send(JSON.stringify(request.user));
        } else {
            response.send(JSON.stringify(new User('', 'anonymous')));
        }
    });
    console.log('routes loaded.');
}