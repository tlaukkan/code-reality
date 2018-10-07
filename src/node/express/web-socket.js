/*import {Grid} from "../../common/dataspace/Grid";
import {Processor} from "../../common/dataspace/SpaceControl";
import {Connection} from "../../common/dataspace/Connection";*/

const uuidv4 = require('uuid/v4');

/*const grid = new Grid(0, 0, 0, 1000, 100, 200);
const control = new Processor(grid);*/

module.exports = function (app) {
    require('express-ws')(app);
    app.ws('/echo', function(ws, request) {
        request.id = uuidv4();
        console.log('ws connection: ' + request.id);
        ws.on('message', function(msg) {
            console.log('ws message from ' + request.id + ' / ' + JSON.stringify(request.user)+ ' :' + msg);
            ws.send(msg);
        });
        ws.on('close', req => {
            console.log('ws disconnect: ' + request.id);
        });
    });
    /*app.ws('/ds', function(ws, request) {
        request.id = uuidv4();
        const connection = new Connection(request.id);
        connection.send = async (message) => {
            ws.send(message);
        };
        control.add(connection);

        console.log('dataspace ws connection: ' + request.id);
        ws.on('message', function(msg) {
            console.log('dataspace ws message from ' + request.id + ' / ' + JSON.stringify(request.user)+ ' :' + msg);
            connection.receive(msg);
        });
        ws.on('close', req => {
            console.log('dataspace ws disconnect: ' + request.id);
            control.remove(connection);
        });
    });*/
};