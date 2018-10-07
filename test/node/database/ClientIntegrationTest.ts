import 'mocha';
import {Client} from "@tlaukkan/aframe-dataspace";
import {w3cwebsocket} from "websocket";

describe('Integration Test Client', () => {

    it('Should connect client to aframe-dataspace-0-0-0.herokuapp.com.', async () => {
        const client = new Client("wws://aframe-dataspace-0-0-0.herokuapp.com/");
        client.newWebSocket = (url:string, protocol:string) => { return new w3cwebsocket(url, protocol) as any};
        await client.connect();
        client.close();
    });

});