import {Express} from "express";

module.exports = function (app: Express) {
    app.get('/api/users/current', function (request, response) {
        console.log('/api/users/current: ' + JSON.stringify(request.user));
        if (request.user) {
            response.send(JSON.stringify({
                'id': request.user.id,
                'name': request.user.displayName,
            }));
        } else {
            response.send(JSON.stringify({
                'id': 'anonymous',
                'name': 'anonymous',
            }));
        }
    });
    console.log('routes loaded.');
}