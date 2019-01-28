import {Express} from "express";
import {User} from "../model/User";

export function initializeRoutes(app: Express) {
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
        //console.log('/api/users/current/id-token: ' + JSON.stringify(request.user));
        let user: User;
        if (request.user) {
            user = request.user;
        } else {
            user = new User('', 'anonymous');
        }

        //response.send(createIdToken(user));
        // Send test user ID token.
        response.send("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0ZXN0LWlzc3VlciIsImlkIjoidW5pdC10ZXN0LWFkbWluaXN0cmF0b3IiLCJqdGkiOiI4ZGYwODA0Yi1jMjQ4LTQ2YjgtYjEwYy00ZDYwMWVjMTNkNmUiLCJuYW1lIjoidW5pdC10ZXN0LWFkbWluaXN0cmF0b3IiLCJncm91cHMiOiJhZG1pbmlzdHJhdG9ycyIsImV4cCI6MTU3OTQ2OTQwNywiaWF0IjoxNTQ3OTMzNDA3fQ.hgB1yT99vFflqzsNd0of0edTVqlXzrO4ATvmP2ufcMVJNOddW3GMNoFsy4TWd0Q0YGfo5kJd6iewjORKhhWEuLh0F2cvi-VyPZe6KlViHnpnl8c8aj0weF4jjiCeDYE3Dy0ZfB8PjDVYSQzU1QhG9WPBHQ8ZG5iwPO4LRbhZX1rj8fA0zsR03mr7NDrUtfQjW90T0Rark83ZtoQrwfSIGVAC0hHk0Kn8LbfHKcutpe1r7JmO2cTell3w08tVp_eBUvu9RElrRXEo6Q6TedglJlgQfMfzkYum-NyIj_OYrEeoclAVVV_X1myXDlqwxUH8Qk4K_tWoVq3otqbWxe2AXw");
    });

    app.get('/api/users/current/space', function (request, response) {
        if ((request as any).session.space) {
            response.send((request as any).session.space);
        } else {
            //console.log("space not set to session. returning default space.");
            response.send("default");
        }

    });

    console.log('routes loaded.');
};

