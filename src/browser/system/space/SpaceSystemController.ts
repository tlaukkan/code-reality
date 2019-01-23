import {ClusterClient, Decode, Encode} from "reality-space";
import uuid = require("uuid");
import {Matrix4, Object3D, Plane, Quaternion, Vector3} from "three";
import {Entity, Scene, System} from "aframe";
import {EntityStateEventDetail} from "../../model/EntityStateEventDetail";
import {Events} from "../../model/Events";
import {DynamicSpace} from "./DynamicSpace";
import {StaticSpace} from "./StaticSpace";
import {AbstractSystemController} from "../AbstractSystemController";
import {SystemControllerDefinition} from "../../AFrame";

export class SpaceSystemController extends AbstractSystemController {

    public static DEFINITION = new SystemControllerDefinition(
        "space", {type: 'string', default: '?'},
        (system: System, scene: Scene, data: any) => new SpaceSystemController(system, scene, data)
    );

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

    constructor(system: System, scene: Scene, data: any) {
        super(system, scene, data);

        this.dynamicSpace = new DynamicSpace(this.scene!!, this.avatarId);
        this.staticSpace = new StaticSpace(this.scene!!);
        this.clusterUrl = this.data;

        fetch('/api/users/current/id-token')
            .then((response) => {
                response.text().then((data) => {
                    //console.log(data);
                    this.idToken = data;
                });
            }).catch((err) => {
            console.error(err);
        });
    }

    init(): void {
    }

    pause(): void {
        if (this.client) {
            this.client.close();
            this.client = undefined;
        }
    }

    play(): void {
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

        this.playerElement = document.querySelector("[interface]") as Entity;
        this.cameraElement = this.playerElement!!.querySelector('[camera]') as Entity;

        if (!this.playerElement) {
            console.log("dataspace - did not find player element in dom.");
        } else {
            this.playerElement.addEventListener(Events.EVENT_STATE_BEGIN, ((e: CustomEvent) => {
                if (this.client && this.client.clusterConfiguration) {
                    //console.log(e.detail);
                    this.client.act(this.avatarId, Events.EVENT_STATE_BEGIN, (e.detail as EntityStateEventDetail).state);
                }
            }) as any);
            this.playerElement.addEventListener(Events.EVENT_STATE_END, ((e: CustomEvent) => {
                if (this.client && this.client.clusterConfiguration) {
                    //console.log(e.detail);
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

            this.client = new ClusterClient(this.clusterUrl!!, "default", this.avatarId, this.playerObject.position.x, this.playerObject.position.y, this.playerObject.position.z,
                this.cameraObject.quaternion.x, this.cameraObject.quaternion.y, this.cameraObject.quaternion.z, this.cameraObject.quaternion.w, '<a-entity gltf-model="#robot" scale="0.3 0.3 0.3" avatar=""></a-entity>', this.idToken!!);
            this.client.onReceive = (region: string, type: string, message: string[]) => {
                //console.log(message);
                if (type === Encode.ADDED) {
                    const m = Decode.added(message);
                    this.dynamicSpace!!.added(region, m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9]);
                }
                if (type === Encode.UPDATED) {
                    const m = Decode.updated(message);
                    this.dynamicSpace!!.updated(region, m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7]);
                }
                if (type === Encode.REMOVED) {
                    const m = Decode.removed(message);
                    this.dynamicSpace!!.removed(region, m[0], m[1]);
                }
                if (type === Encode.DESCRIBED) {
                    const m = Decode.described(message);
                    this.dynamicSpace!!.described(region, m[0], m[1]);
                }
                if (type === Encode.ACTED) {
                    const m = Decode.acted(message);
                    this.dynamicSpace!!.acted(region, m[0], m[1], m[2]);
                }
            };
            this.client.onStoredRootEntityReceived = (region, sid, entityXml) => {
                this.staticSpace!!.setRootEntity(region, sid, entityXml);
            };
            this.client.onStoredChildEntityReceived = (region, parentSid, sid, entityXml) => {
                this.staticSpace!!.setChildEntity(region, parentSid, sid, entityXml);
            };
            this.client.onStoredEntityRemoved = (region, sid) => {
                this.staticSpace!!.removeEntity(region, sid);
            };
            this.client.onConnect = (region: string) => {
                console.log("dataspace - connected: " + region);
                this.dynamicSpace!!.connected(region);
                this.staticSpace!!.connected(region);
            };
            this.client.onDisconnect = (region: string) => {
                console.log("dataspace - disconnected: " + region)
                this.dynamicSpace!!.disconnected(region);
                this.staticSpace!!.disconnected(region);

            };
            this.client.connect().catch((error: Error) => {
                console.warn("dataspace - cluster client connect error.", error);
                this.client = undefined;
            });
        }
    }
}



