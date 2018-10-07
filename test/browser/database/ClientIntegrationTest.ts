import {Client} from "@tlaukkan/aframe-dataspace";

describe('Integration Test Client', () => {

    it('Should connect client to aframe-dataspace-0-0-0.herokuapp.com.', async () => {
        const client = new Client("wss://aframe-dataspace-0-0-0.herokuapp.com/");
        await client.connect();
        client.newWebSocket = (url:string, protocol:string) => { return new WebSocket(url, protocol) as any};
        client.close();
    });

});