import {AbstractComponent} from "./AFrame";
import {ClusterClient, Decode, Encode} from "@tlaukkan/aframe-dataspace";
import uuid = require("uuid");
import {DynamicSpace} from "./DynamicSpace";
import {Object3D} from "three";
import {Entity} from "aframe";
import {StaticSpace} from "./StaticSpace";
import {EntityStateEventDetail} from "./model/EntityStateEventDetail";
import {Events} from "./model/Events";

export class DataspaceComponent extends AbstractComponent {

    private avatarId = uuid.v4();
    private playerElement: Entity | null = null;
    private playerObject: Object3D | undefined = undefined;
    private client: ClusterClient | undefined = undefined;
    private url: string | undefined = undefined;
    private dynamicSpace: DynamicSpace | undefined = undefined;
    private staticSpace: StaticSpace | undefined = undefined;

    private lastRefresh: number = 0;
    private idToken: string | undefined;

    constructor() {
        super(
            "dataspace",
            {type: 'string', default: '?'},
            false
        );
    }


    init(): void {
        console.log(this.name + " init: " + JSON.stringify(this.data));
        this.playerElement = document.getElementById("player") as Entity;
        if (!this.playerElement) {
            console.log("dataspace - did not find player element in dom.");
        } else {
            this.playerElement.addEventListener(Events.EVENT_STATE_BEGIN, ((e: CustomEvent) => {
                if (this.client && this.client.clusterConfiguration) {
                    console.log(e.detail);
                    this.client.act(this.avatarId, Events.EVENT_STATE_BEGIN, (e.detail as EntityStateEventDetail).state);
                }
            }) as any);
            this.playerElement.addEventListener(Events.EVENT_STATE_END, ((e: CustomEvent) => {
                if (this.client && this.client.clusterConfiguration) {
                    console.log(e.detail);
                    this.client.act(this.avatarId, Events.EVENT_STATE_END, (e.detail as EntityStateEventDetail).state);
                }
            }) as any);
        }

        this.dynamicSpace = new DynamicSpace(this.entity!!, this.avatarId);
        this.staticSpace = new StaticSpace(this.entity!!);
        this.url = this.data;

        fetch('/api/users/current/id-token')
            .then((response) => {
                response.text().then((data) => {
                    console.log(data);
                    this.idToken = data;
                });
            }).catch((err) => {
            console.error(err);
        });
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
        if (this.playerElement && !this.playerObject) {
            this.playerObject = this.playerElement!!.object3D;
            if (!this.playerObject) {
                console.log("No player object.");
            }
        }

        if (this.url && this.playerObject) {

            this.client = new ClusterClient(this.url!!, this.avatarId, this.playerObject.position.x, this.playerObject.position.y, this.playerObject.position.z,
                this.playerObject.quaternion.x, this.playerObject.quaternion.y, this.playerObject.quaternion.z, this.playerObject.quaternion.w, "<a-sphere></a-sphere>", this.idToken!!);
            this.client.onReceive = (serverUrl: string, type: string, message: string[]) => {
                //console.log(message);
                if (type === Encode.ADDED) {
                    const m = Decode.added(message);
                    this.dynamicSpace!!.added(serverUrl, m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9]);
                }
                if (type === Encode.UPDATED) {
                    const m = Decode.updated(message);
                    this.dynamicSpace!!.updated(serverUrl, m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7]);
                }
                if (type === Encode.REMOVED) {
                    const m = Decode.removed(message);
                    this.dynamicSpace!!.removed(serverUrl, m[0], m[1]);
                }
                if (type === Encode.DESCRIBED) {
                    const m = Decode.described(message);
                    this.dynamicSpace!!.described(serverUrl, m[0], m[1]);
                }
                if (type === Encode.ACTED) {
                    const m = Decode.acted(message);
                    this.dynamicSpace!!.acted(serverUrl, m[0], m[1], m[2]);
                }
            };
            this.client.onStoredRootEntityReceived = (serverUrl, sid, entityXml) => {
                this.staticSpace!!.setRootEntity(serverUrl, sid, entityXml);
            };
            this.client.onStoredChildEntityReceived = (serverUrl, parentSid, sid, entityXml) => {
                this.staticSpace!!.setChildEntity(serverUrl, parentSid, sid, entityXml);
            };
            this.client.onStoredEntityRemoved = (serverUrl, sid) => {
                this.staticSpace!!.removeEntity(serverUrl, sid);
            };
            this.client.onConnect = (serverUrl: string) => {
                console.log("dataspace - connected: " + serverUrl);
                this.dynamicSpace!!.connected(serverUrl);
                this.staticSpace!!.connected(serverUrl);
            };
            this.client.onDisconnect = (serverUrl: string) => {
                console.log("dataspace - disconnected: " + serverUrl)
                this.dynamicSpace!!.disconnected(serverUrl);
                this.staticSpace!!.disconnected(serverUrl);

            };
            this.client.connect().catch((error: Error) => {
                console.warn("dataspace - cluster client connect error.", error);
                this.client = undefined;
            });
        }
    }

    tick(time: number, timeDelta: number): void {
        if (this.client) {
            this.dynamicSpace!!.simulate(timeDelta / 1000);
            if (time - this.lastRefresh > 200) {
                if (this.playerObject) {
                    if (this.client.clusterConfiguration) {
                        this.client!!.refresh(this.playerObject.position.x, this.playerObject.position.y, this.playerObject.position.z,
                            this.playerObject.quaternion.x, this.playerObject.quaternion.y, this.playerObject.quaternion.z, this.playerObject.quaternion.w);
                    }
                }
                this.lastRefresh = time;
            }
        }
    }
}


