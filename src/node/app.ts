import {initializeAuthentication} from "./express/authentication";
import {initializeSession} from "./express/session";
import {initializeRoutes} from "./express/routes";

import express = require('express');
import config = require('config');

const port = config.get('Server.port') as number;
const host = config.get('Server.host') as string;

const app = express();

initializeSession(app);

app.use(function (req, res, next) {
    if (req.query.space) {
        console.log("set current space according to query parameter to: " + req.query.space);
        (req as any).session.space = req.query.space;
    }
    next();
});

app.use(express.static('static'));
app.use(express.static('dist'));

//initializeAuthentication(app, config);
initializeRoutes(app);

app.listen(port, host, function () {
    console.log('Your app is listening on port ' + port);
});

