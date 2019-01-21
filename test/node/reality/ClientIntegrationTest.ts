import 'mocha';
import {w3cwebsocket} from "websocket";
import {RealityClient} from "reality-space";

describe('Integration Test Client', () => {

    it('Should connect client to aframe-dataspace-0-0-0.herokuapp.com.', async () => {
        const client = new RealityClient("default", "0-0-0", "wss://rs-test-processor-0-0-0.herokuapp.com/", "https://rs-test-storage.herokuapp.com/api/", "https://rs-test-storage.herokuapp.com/api/", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0ZXN0LWlzc3VlciIsImlkIjoidW5pdC10ZXN0LWFkbWluaXN0cmF0b3IiLCJqdGkiOiI4ZGYwODA0Yi1jMjQ4LTQ2YjgtYjEwYy00ZDYwMWVjMTNkNmUiLCJuYW1lIjoidW5pdC10ZXN0LWFkbWluaXN0cmF0b3IiLCJncm91cHMiOiJhZG1pbmlzdHJhdG9ycyIsImV4cCI6MTU3OTQ2OTQwNywiaWF0IjoxNTQ3OTMzNDA3fQ.hgB1yT99vFflqzsNd0of0edTVqlXzrO4ATvmP2ufcMVJNOddW3GMNoFsy4TWd0Q0YGfo5kJd6iewjORKhhWEuLh0F2cvi-VyPZe6KlViHnpnl8c8aj0weF4jjiCeDYE3Dy0ZfB8PjDVYSQzU1QhG9WPBHQ8ZG5iwPO4LRbhZX1rj8fA0zsR03mr7NDrUtfQjW90T0Rark83ZtoQrwfSIGVAC0hHk0Kn8LbfHKcutpe1r7JmO2cTell3w08tVp_eBUvu9RElrRXEo6Q6TedglJlgQfMfzkYum-NyIj_OYrEeoclAVVV_X1myXDlqwxUH8Qk4K_tWoVq3otqbWxe2AXw");
        client.newWebSocket = (url:string, protocol:string) => { return new w3cwebsocket(url, protocol) as any};
        await client.connect();
        client.close();
    });

});