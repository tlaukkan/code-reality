const config = require('config');
const http  = require( 'http');
const WebSocketServer = require('ws').Server;

//const model =  require( './model');
//const StorageDescriptor = model.StorageDescriptor;
//const MessageType = model.MessageType;
//const MessageEnvelop = model.MessageEnvelop;
//const ErrorResponse = model.ErrorResponse;

exports.SpaceServer = class {

    /**
     * @param {String} host
     * @param {String} port
     */
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }

    listen(app) {
        console.log('space server starting... ');


        /*this.httpServer = http.createServer(function (request, response) {
            if (request.url.endsWith('/health-check')) {
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end();
            }
        });*/

        /*
        const webSocketServer = new WebSocketServer({ server: server, path: 'ws' });
        webSocketServer.on('connection', (request) => {

            console.log('ws connection...');
            this.processConnection(request)
        });
        */

        //this.httpServer.listen(this.port, this.host);

        console.log('space server started.');
    }

    /**
     * Closes storage server.
     */
    close() {
        console.log('space server closing ...');
        console.log('space server closed');
        this.onClosed();
    }

    /**
     * Event handler for called after storage server is closed.
     */
    onClosed() {
    }

    /**
     * Processes connection request.
     * @param request connection request
     */
    processConnection(request) {
        console.log('space served - client connected from ' + request.socket.remoteAddress + ':' + request.socket.remotePort);

        const connection = request.accept('storage', request.origin);
        connection.on('message', async (message) => {
            console.log('space served - client message: ' + message.utf8Data + ' from ' + request.socket.remoteAddress + ':' + request.socket.remotePort);
            this.sendResponse(connection, 'hello');
        });
        connection.on('close', function () {
            console.log('space served - client disconnected from ' + request.socket.remoteAddress + ':' + request.socket.remotePort);
        });
    }

    /**
     * @param {Object} connection
     * @param {Object} response
     */
    sendResponse(connection, response) {
        connection.sendUTF(response);
    }


};
