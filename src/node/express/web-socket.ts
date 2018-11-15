/*import {Grid} from "../../common/dataspace/Grid";
import {Processor} from "../../common/dataspace/SpaceControl";
import {Connection} from "../../common/dataspace/Connection";*/

import {Express} from "express";

const uuidv4 = require('uuid/v4');

/*const grid = new Grid(0, 0, 0, 1000, 100, 200);
const control = new Processor(grid);*/

module.exports = function (app: Express) {
    require('express-ws')(app);
    /*app.ws('/echo', function(ws, request) {
        request.id = uuidv4();
        console.log('ws connection: ' + request.id);
        ws.on('message', function(msg) {
            console.log('ws message from ' + request.id + ' / ' + JSON.stringify(request.user)+ ' :' + msg);
            ws.send(msg);
        });
        ws.on('close', req => {
            console.log('ws disconnect: ' + request.id);
        });
    });*/
};