import uuid = require("uuid");
import {Matrix4, Object3D, PerspectiveCamera, Plane, Quaternion, Vector3} from "three";
import {Entity, Scene, System} from "aframe";
import {EntityStateEventDetail} from "../../model/EntityStateEventDetail";
import {Events} from "../../model/Events";
import {DynamicSpace} from "./DynamicSpace";
import {StaticSpace} from "./StaticSpace";
import {ClusterClient, Decode, Encode} from "reality-space";
import {InterfaceSystemController} from "../../..";
import {ModelController} from "../merge/ModelController";
import {MergeSystemController} from "../merge/MergeSystemController";
import {EntityActionEventDetail} from "../../model/EntityActionEventDetail";
import {BrowserContext} from "../../../common/model/BrowserContext";
import {
    AbstractSystemController, createElement,
    getComponentController, getSystemController,
    SystemControllerDefinition
} from "aframe-typescript-boilerplate";

export class SpaceSystemController extends AbstractSystemController {

    public static DEFINITION = new SystemControllerDefinition(
        "space", {},
        (system: System, scene: Scene, data: any) => new SpaceSystemController(system, scene, data)
    );

    private clusterUrl: string | undefined = undefined;
    private idToken: string | undefined;
    private context: BrowserContext | undefined;
    private space: string | undefined;

    private avatarId = uuid.v4();

    private playerElement: Entity | null = null;
    private cameraElement: Entity | null = null;

    private playerObject: Object3D | undefined = undefined;
    private cameraObject: Object3D | undefined;

    private client: ClusterClient | undefined = undefined;

    private dynamicSpace: DynamicSpace | undefined = undefined;
    public staticSpace: StaticSpace | undefined = undefined;

    private lastRefresh: number = 0;

    private yAxisPositive = new Vector3(0, 1, 0);
    private xzPlane = new Plane(this.yAxisPositive);
    private cameraDirection: Vector3 = new Vector3(0, 0, 0);
    private xzDirection: Vector3 = new Vector3(0, 0, 0);
    private directionMatrix = new Matrix4();
    private directionQuaternion = new Quaternion();
    private observationRange = 0;

    constructor(system: System, scene: Scene, data: any) {
        super(system, scene, data);

        this.staticSpace = new StaticSpace(this.scene!!);


        fetch('/api/context', {
            credentials: 'same-origin'
        }).then((response) => {
                response.json().then((responseData) => {
                    const context = responseData as BrowserContext;
                    this.clusterUrl = context.clusterUrl;
                    this.space = context.space;
                    this.idToken = context.idToken;
                    this.context = context;

                    this.dynamicSpace = new DynamicSpace(this.scene!!, this.context!!.userId + ":" + this.avatarId);

                    //console.log("cluster URL: " + this.clusterUrl);
                });
            }).catch((err) => {
            console.error(err);
        });

        /*fetch('/api/users/current/cluster-url', {
            credentials: 'same-origin'
        })
            .then((response) => {
                response.text().then((responseData) => {
                    this.clusterUrl = responseData;
                    //console.log("cluster URL: " + this.clusterUrl);
                });
            }).catch((err) => {
            console.error(err);
        });
        fetch('/api/users/current/space', {
            credentials: 'same-origin'
        })
            .then((response) => {
                response.text().then((responseData) => {
                    this.space = responseData;
                    //console.log("current space: " + this.space);
                });
            }).catch((err) => {
            console.error(err);
        });
        fetch('/api/users/current/id-token', {
            credentials: 'same-origin'
        })
            .then((response) => {
                response.text().then((responseData) => {
                    this.idToken = responseData;
                });
            }).catch((err) => {
            console.error(err);
        });*/
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
        if (!this.clusterUrl || !this.idToken || !this.space) {
            return;
        }

        this.playerElement = document.querySelector("[interface]") as Entity;
        this.cameraElement = this.playerElement!!.querySelector('[camera]') as Entity;

        if (!this.playerElement) {
            //console.log("dataspace - did not find player element in dom.");
        } else {
            this.playerElement.addEventListener(Events.EVENT_STATE_BEGIN, (async (e: CustomEvent) => {
                if (this.client && this.client.clusterConfiguration) {
                    ////console.log(e.detail);
                    await this.client.act(this.avatarId, Events.EVENT_STATE_BEGIN, (e.detail as EntityStateEventDetail).state);
                }
            }) as any);
            this.playerElement.addEventListener(Events.EVENT_STATE_END, (async (e: CustomEvent) => {
                if (this.client && this.client.clusterConfiguration) {
                    ////console.log(e.detail);
                    await this.client.act(this.avatarId, Events.EVENT_STATE_END, (e.detail as EntityStateEventDetail).state);
                }
            }) as any);
            this.playerElement.addEventListener(Events.EVENT_ACTION, (async (e: CustomEvent) => {
                if (this.client && this.client.clusterConfiguration) {
                    ////console.log(e.detail);
                    const actionEventDetail = e.detail as EntityActionEventDetail;
                    await this.client.act(this.avatarId, actionEventDetail.action, actionEventDetail.description);
                }
            }) as any);
        }

        if (!this.cameraElement) {
            //console.log("dataspace - did not find camera element in dom.");
        }

        //console.log(this.systemName + " setting up client...");

        if (this.playerElement && this.cameraElement) {
            if (!this.playerObject || !this.cameraObject) {
                this.playerObject = this.playerElement!!.object3D;
                if (this.cameraElement) {
                    this.cameraObject = this.cameraElement.object3D;
                }

                if (!this.playerObject) {
                    //console.log("No player object.");
                }
                if (!this.cameraObject) {
                    //console.log("No camera object.");
                }
            }
        }

        if (this.playerObject && this.cameraObject) {

            this.client = new ClusterClient(this.clusterUrl!!, this.space, this.avatarId, this.playerObject.position.x, this.playerObject.position.y, this.playerObject.position.z,
                this.cameraObject.quaternion.x, this.cameraObject.quaternion.y, this.cameraObject.quaternion.z, this.cameraObject.quaternion.w, this.getAvatarDescription(), this.idToken!!);
            this.client.onReceive = (region: string, type: string, message: string[]) => {
                ////console.log(message);
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
            this.client.onLoaded = (region) => {
                this.staticSpace!!.loaded(region);
            };
            this.client.onConnectError = (region: string, error: Error) => {
                document.location!!.href = "/connection_error.html";
            };
            this.client.onConnect = (region: string) => {
                //console.log("dataspace - connected: " + region);
                const regionConfiguration = this.client!!.getRegionConfiguration(region);
                const regionX = regionConfiguration.x;
                const regionY = regionConfiguration.y;
                const regionZ = regionConfiguration.z - 2; // TODO Remove this test
                this.dynamicSpace!!.connected(region);
                this.staticSpace!!.connected(region, new Vector3(regionX, regionY, regionZ));
            };
            this.client.onDisconnect = (region: string) => {
                //console.log("dataspace - disconnected: " + region)
                this.dynamicSpace!!.disconnected(region);
                this.staticSpace!!.disconnected(region);

            };
            this.client.connect().then(() => {
                if (this.client && this.client.clusterConfiguration) {
                    this.observationRange = Math.trunc(this.client!!.clusterConfiguration!!.range / this.client!!.clusterConfiguration!!.step) * this.client.clusterConfiguration!!.step;

                    const interfaceSystem = getSystemController(this.scene, "interface") as InterfaceSystemController;
                    const observationRange = this.getObservationRange();
                    console.log("Set camera far to: " + observationRange);
                    (interfaceSystem.cameraEntity.object3D as PerspectiveCamera).far = observationRange;
                }
            }).catch((error: Error) => {
                console.warn("dataspace - cluster client connect error.", error);
                this.client = undefined;
            });
        }
    }

    public getObservationRange() {
        return this.observationRange;
    }

    public sendAvatarDescriptionUpdate() {
        if (this.client) {
            const avatarDescription = this.getAvatarDescription();
            //console.log("Describing avatar: " + avatarDescription);
            this.client.describe(this.avatarId, this.getAvatarDescription()).catch((error) => {
                //console.log("Error describing avatar: " + error);
            });
        }
    }

    private getAvatarDescription(): string {
        const interfaceSystem = this.getSystemController("interface") as InterfaceSystemController;
        const selfScale = interfaceSystem ? interfaceSystem.getSelfScale() : 1;
        const avatarScale = selfScale * 0.4; // TODO fix the model size.
        return '<a-entity gltf-model="#male_suit" scale="' + avatarScale + ' ' + avatarScale + ' ' + avatarScale + '" avatar=""></a-entity>';
    }

    public addEntity(template: string, position: Vector3, scale: Vector3) {
        if (this.client) {
            const region = this.client.getRegion(position.x, position.y, position.z)!!;
            const regionConfiguration = this.client.getRegionConfiguration(region);

            const localPosition = position.clone();
            localPosition.sub(new Vector3(regionConfiguration.x, regionConfiguration.y, regionConfiguration.z));
            localPosition.z = localPosition.z + 2;

            const newEntity = createElement(template) as Entity;
            newEntity.setAttribute("scale", scale.x + " " + scale.y + " " + scale.z);
            newEntity.setAttribute("position", localPosition.x + " " + localPosition.y + " " + localPosition.z);
            newEntity.setAttribute("oid", uuid.v4().toString());
            if (newEntity.flushToDOM) {
                newEntity.flushToDOM(true);
            }

            this.staticSpace!!.regionElements.get(region)!!.appendChild(newEntity);

            this.client.storeEntity(newEntity.outerHTML, position.x, position.y, position.z).catch(error => {
                console.error("Error saving entity", error);
            });
        }
    }

    public updateEntity(entity: Entity, position: Vector3, orientation: Quaternion, scale: Vector3) {
        if (this.client) {
            const sid = entity.getAttribute("sid");
            this.staticSpace!!.ignoreNextSetSids.push(sid);

            const region = this.client.getRegion(position.x, position.y, position.z)!!;
            const regionConfiguration = this.client.getRegionConfiguration(region);

            const localPosition = position.clone();
            localPosition.sub(new Vector3(regionConfiguration.x, regionConfiguration.y, regionConfiguration.z));
            localPosition.z = localPosition.z + 2;

            const modelController = getComponentController(entity, "model") as ModelController | undefined;
            if (modelController && modelController.merge) {
                //console.log("updating merge as entity is part of merge.");
                entity.setAttribute("position", localPosition.x + " " + localPosition.y + " " + localPosition.z);
                entity.setAttribute("quaternion", orientation.x + " " + orientation.y + " " + orientation.z + " " + orientation.w);
                entity.setAttribute("scale", scale.x + " " + scale.y + " " + scale.z);
                const mergeSystem = this.getSystemController("merge") as MergeSystemController;
                mergeSystem.updateMergeChild(modelController.merge!!, entity);
            }

            const entityXml = entity.outerHTML;
            const newEntity = createElement(entityXml) as Entity;
            newEntity.setAttribute("position", localPosition.x + " " + localPosition.y + " " + localPosition.z);
            newEntity.setAttribute("quaternion", orientation.x + " " + orientation.y + " " + orientation.z + " " + orientation.w);
            newEntity.setAttribute("scale", scale.x + " " + scale.y + " " + scale.z);
            newEntity.setAttribute("oid", uuid.v4().toString());
            if (newEntity.flushToDOM) {
                newEntity.flushToDOM(true);
            }

            this.client.storeEntity(newEntity.outerHTML, position.x, position.y, position.z).catch(error => {
                console.error("Error saving entity", error);
            });
        }
    }

    public removeEntity(entity: Entity) {
        if (this.client) {
            const entitySid = entity.getAttribute("sid");

            if (entitySid) {
                //console.log("removing from storage");
                const position = entity.object3D.position.clone();
                const worldPosition = entity.object3D.getWorldPosition(position);
                this.client.removeStoredEntity(entitySid, worldPosition.x, worldPosition.y, worldPosition.z).catch(error => {
                    //console.log("Error removing entity.", error);
                });
            }

            //console.log("removing locally");
            entity.parentElement!!.removeChild(entity);
        }
    }

}



