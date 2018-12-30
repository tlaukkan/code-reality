import {initializeAuthentication} from "./express/authentication";
import {initializeSession} from "./express/session";
import {initializeRoutes} from "./express/routes";

import express = require('express');
import config = require('config');

const port = config.get('Server.port') as number;
const host = config.get('Server.host') as string;

const app = express();

app.use(express.static('dist'));

initializeSession(app);
//initializeAuthentication(app, config);
initializeRoutes(app);

app.listen(port, host, function () {
    console.log('Your app is listening on port ' + port);
});

