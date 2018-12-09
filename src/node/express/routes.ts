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

        //response.send(createIdToken(user));
        // Send test user ID token.
        response.send("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0ZXN0LWlzc3VlciIsImlkIjoidGVzdC1hZG1pbiIsImp0aSI6IjhlYzg5ODA5LTM1ZjYtNGM4ZS04NWJjLWM3NTNjMDZjODk3OSIsIm5hbWUiOiJUZXN0IEFkbWluIiwiZXhwIjo0Njk3OTM4ODUzLCJpYXQiOjE1NDQzMzg4NTN9.EZUj65lAwbNE9iUeXZLNWHlRq23OK5iA8Vul51abuejHDuc6IhuIZCswsUIdPxHGkOsvy6FSm2su5ePpIs1xO1gwQ_u-Nc_Po2BNBqwqIs-sDn9qNVD13Nd5W7_SzxeEWIm7pQft6YP9uvbVV8d-8Nbz8U8KYA5DPLZGodsCQotRL1aBZPbQdc6QB9-rMr2YqpXPQGxAQjjArnl97QPRTig8UxfA9zQWecdNYRXsxtfNFlAnM76uPjN00er4omCxGrWG8vhAAiIQDchwQ7IndRnTyhjybNyWLS2siONFXQ7azfcPa17cM-s_mRfzw4nGZnhEpbYGz1VfVylFC4ivyg");
    });
    console.log('routes loaded.');
};

