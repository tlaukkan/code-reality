const express = require('express');
const app = express();

const config = require('config');
//const db = require('./database/database.js');

require('./express/web-socket.js')(app);
require('./express/session.js')(app);
require('./express/authentication.js')(app, config);
require('./express/routes.js')(app/*, db*/);

app.use(express.static('dist'));

const listener = app.listen(config.get('Server.port'), config.get('Server.host'), function () {
    console.log('Your app is listening on port ' + listener.address().port);
});

