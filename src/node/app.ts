import express = require('express');
const app = express();

import config = require('config');

//const db = require('./database/database.js');
//require('./express/web-socket.ts')(app);

require('./express/session.ts')(app);
//require('./express/authentication.ts')(app, config);
require('./express/routes.ts')(app);

app.use(express.static('dist'));

const port = config.get('Server.port') as number;
const host = config.get('Server.host') as string;
const listener = app.listen(port, host, function () {
    console.log('Your app is listening on port ' + port);
});

