import {AbstractComponent} from "./AFrame";
import {ClusterClient, Decode, Encode} from "@tlaukkan/aframe-dataspace";
import uuid = require("uuid");
import {Space} from "./Space";

export class DataspaceComponent extends AbstractComponent {

    private avatarId = uuid.v4();
    private client: ClusterClient | undefined = undefined;
    private url: string | undefined = undefined;
    private space: Space | undefined = undefined;

    constructor() {
        super(
            "dataspace",
            {type: 'string', default: '?'},
            false
        );
    }

    init(): void {
        console.log(this.name + " init: " + JSON.stringify(this.data));
        this.space = new Space(this.entity!!);
        this.url = this.data;
    }

    update(data: any, oldData: any): void {
        console.log(this.name + " update");
    }

    remove(): void {
        console.log(this.name + " remove");
    }

    pause(): void {
        console.log(this.name + " pause");
        if (this.client) {
            this.client.close();
        }
    }

    play(): void {
        console.log(this.name + " play");
        if (this.url) {
            this.client = new ClusterClient(this.url!!, this.avatarId, 0, 0, 0, 0, 0, 0, 0, "<a-sphere></a-sphere>");
            this.client.onReceive = (serverUrl: string, type: string, message: string[]) => {
                console.log(message);
                if (type === Encode.ADDED) {
                    const m = Decode.added(message);
                    this.space!!.added(serverUrl, m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9]);
                }
                if (type === Encode.UPDATED) {
                    const m = Decode.updated(message);
                    this.space!!.updated(serverUrl, m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7]);
                }
                if (type === Encode.REMOVED) {
                    const m = Decode.removed(message);
                    this.space!!.removed(serverUrl, m[0], m[1]);
                }
                if (type === Encode.DESCRIBED) {
                    const m = Decode.described(message);
                    this.space!!.described(serverUrl, m[0], m[1]);
                }
                if (type === Encode.ACTED) {
                    const m = Decode.acted(message);
                    this.space!!.acted(serverUrl, m[0], m[1]);
                }
            };
            this.client.onConnect = (serverUrl: string) => {
                console.log("dataspace - connected: " + serverUrl);
                this.space!!.connected(serverUrl);
            };
            this.client.onDisconnect = (serverUrl: string) => {
                console.log("dataspace - disconnected: " + serverUrl)
                this.space!!.disconnected(serverUrl);

            };
            this.client.connect().catch(error => {
                console.warn("dataspace - cluster client connect error.", error);
                this.client = undefined;
            });
        }
    }

    tick(time: number, timeDelta: number): void {
        this.space!!.simulate(timeDelta / 1000);
    }
}


