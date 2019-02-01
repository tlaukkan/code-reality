import config from 'config';
import {newServer} from "./server";

start().then().catch(e => console.log('code reality - startup error: ', e));

async function start() {

    console.log("code reality - starting up version='" + config.get('Software.version') + "'");

    const port = config.get('Server.port') as number;
    const host = config.get('Server.host') as string;

    const server = await newServer(host, port);
    process.on('exit', async () => {
        console.log("code reality - exiting version='" + config.get('Software.version') + "'");
        await server.close();
    });

}
