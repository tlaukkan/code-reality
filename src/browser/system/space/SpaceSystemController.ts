import {ClusterClient, Decode, Encode} from "@tlaukkan/aframe-dataspace";
import uuid = require("uuid");
import {Matrix4, Object3D, Plane, Quaternion, Vector3} from "three";
import {Entity, System} from "AFrame";
import {EntityStateEventDetail} from "../../model/EntityStateEventDetail";
import {Events} from "../../model/Events";
import {DynamicSpace} from "./DynamicSpace";
import {StaticSpace} from "./StaticSpace";
import {AbstractSystemController} from "../AbstractSystemController";

export class SpaceSystemController extends AbstractSystemController {

    private readonly clusterUrl: string | undefined = undefined;
    private idToken: string | undefined;

    private avatarId = uuid.v4();

    private playerElement: Entity | null = null;
    private cameraElement: Entity | null = null;

    private playerObject: Object3D | undefined = undefined;
    private cameraObject: Object3D | undefined;

    private client: ClusterClient | undefined = undefined;

    private dynamicSpace: DynamicSpace | undefined = undefined;
    private staticSpace: StaticSpace | undefined = undefined;

    private lastRefresh: number = 0;

    private yAxisPositive = new Vector3(0, 1, 0);
    private xzPlane = new Plane(this.yAxisPositive);
    private cameraDirection: Vector3 = new Vector3(0, 0, 0);
    private xzDirection: Vector3 = new Vector3(0, 0, 0);
    private directionMatrix = new Matrix4();
    private directionQuaternion = new Quaternion();

    constructor(system: System, entity: Entity, data: any) {
        super("dataspace", {type: 'string', default: '?'}, false, system, entity, data);

        this.dynamicSpace = new DynamicSpace(this.entity!!, this.avatarId);
        this.staticSpace = new StaticSpace(this.entity!!);
        this.clusterUrl = this.data;

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

    init(): void {
        console.log(this.systemName + " init: " + JSON.stringify(this.data));

    }

    pause(): void {
        console.log(this.systemName + " pause");
        if (this.client) {
            this.client.close();
            this.client = undefined;
        }
    }

    play(): void {
        console.log(this.systemName + " play");
    }

    tick(time: number, timeDelta: number): void {
        if (!this.client) {
            this.setupClient();
        } else {
            this.dynamicSpace!!.simulate(timeDelta / 1000);
            if (time - this.lastRefresh > 150) {
                if (this.playerObject && this.cameraObject) {
                    if (this.client.clusterConfiguration) {

                        this.cameraObject.getWorldDirection(this.cameraDirection);
                        //this.cameraDirection.multiplyScalar(-1);
                        this.xzPlane.projectPoint(this.cameraDirection, this.xzDirection);
                        this.xzDirection.normalize();

                        this.directionMatrix.lookAt(new Vector3(0,0,0), this.xzDirection,this.yAxisPositive);
                        this.directionQuaternion.setFromRotationMatrix(this.directionMatrix);

                        this.client!!.refresh(this.playerObject.position.x, this.playerObject.position.y, this.playerObject.position.z,
                            this.directionQuaternion.x, this.directionQuaternion.y, this.directionQuaternion.z, this.directionQuaternion.w);
                    }
                }
                this.lastRefresh = time;
            }
        }
    }

    setupClient(): void {
        if (!this.clusterUrl || !this.idToken) {
            return;
        }

        this.playerElement = document.getElementById("player") as Entity;
        this.cameraElement = this.playerElement!!.querySelector('[camera]') as Entity;

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

        if (!this.cameraElement) {
            console.log("dataspace - did not find camera element in dom.");
        }

        console.log(this.systemName + " setting up client...");

        if (this.playerElement && this.cameraElement) {
            if (!this.playerObject || !this.cameraObject) {
                this.playerObject = this.playerElement!!.object3D;
                if (this.cameraElement) {
                    this.cameraObject = this.cameraElement.object3D;
                }

                if (!this.playerObject) {
                    console.log("No player object.");
                }
                if (!this.cameraObject) {
                    console.log("No camera object.");
                }
            }
        }

        if (this.playerObject && this.cameraObject) {

            this.client = new ClusterClient(this.clusterUrl!!, this.avatarId, this.playerObject.position.x, this.playerObject.position.y, this.playerObject.position.z,
                this.cameraObject.quaternion.x, this.cameraObject.quaternion.y, this.cameraObject.quaternion.z, this.cameraObject.quaternion.w, '<a-entity gltf-model="#robot" scale="0.3 0.3 0.3" avatar=""></a-entity>', this.idToken!!);
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
}



