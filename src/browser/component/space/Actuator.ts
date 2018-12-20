import {createElement} from "../../util";
import {Entity} from "AFrame";
import {Euler, Quaternion} from "three";
import {Spring} from "./Spring";
import {Events} from "../../model/Events";
import {EntityStateEventDetail} from "../../model/EntityStateEventDetail";

export class Actuator {

    id: string;
    serverUrl: string;
    description: string;
    root: Entity;
    entity: Entity;
    springOne: Spring = new Spring();
    springTwo: Spring = new Spring();

    targetOrientation: Quaternion = new Quaternion();
    currentOrientation: Quaternion = new Quaternion();

    lastUpdateTime: number = 0;
    averageUpdateInterval: number = 0.200;
    moving: boolean = false;

    constructor(root: Entity, serverUrl: string, id: string, description: string) {
        this.root = root;
        this.serverUrl = serverUrl;
        this.id = id;
        this.description = description;
        this.entity = createElement(description) as Entity;
        this.entity.setAttribute("did", id);
        this.entity.setAttribute("server", serverUrl);
        this.springOne.relaxationTime = 0.2;
        this.springTwo.relaxationTime = 0.2;
    }

    added(x: number, y: number, z: number, rx: number, ry: number, rz: number, rw: number) : void {
        this.root.appendChild(this.entity);

        this.springOne.currentPosition.x = x;
        this.springOne.currentPosition.y = y;
        this.springOne.currentPosition.z = z;
        this.springOne.targetPosition.x = x;
        this.springOne.targetPosition.y = y;
        this.springOne.targetPosition.z = z;

        this.springOne.currentOrientation.x = rx;
        this.springOne.currentOrientation.y = ry;
        this.springOne.currentOrientation.z = rz;
        this.springOne.currentOrientation.w = rw;
        this.springOne.targetOrientation.x = rx;
        this.springOne.targetOrientation.y = ry;
        this.springOne.targetOrientation.z = rz;
        this.springOne.targetOrientation.w = rw;

        this.springTwo.currentPosition.x = x;
        this.springTwo.currentPosition.y = y;
        this.springTwo.currentPosition.z = z;
        this.springTwo.targetPosition.x = x;
        this.springTwo.targetPosition.y = y;
        this.springTwo.targetPosition.z = z;

        this.springTwo.currentOrientation.x = rx;
        this.springTwo.currentOrientation.y = ry;
        this.springTwo.currentOrientation.z = rz;
        this.springTwo.currentOrientation.w = rw;
        this.springTwo.targetOrientation.x = rx;
        this.springTwo.targetOrientation.y = ry;
        this.springTwo.targetOrientation.z = rz;
        this.springTwo.targetOrientation.w = rw;

        this.moving = true;
        this.entity.dispatchEvent(new CustomEvent(Events.EVENT_STATE_BEGIN, {detail: new EntityStateEventDetail("moving")}));
        console.log("start moving");
    }

    updated(x: number, y: number, z: number, rx: number, ry: number, rz: number, rw: number) : void {
        const time = new Date().getTime() / 1000.0;
        if (this.lastUpdateTime != 0) {
            this.averageUpdateInterval = (this.averageUpdateInterval * 9 + (time - this.lastUpdateTime)) / 10;
            this.springOne.relaxationTime = 2 * this.averageUpdateInterval;
            this.springTwo.relaxationTime = 2 * this.averageUpdateInterval;
        }
        this.lastUpdateTime = time;

        //this.entity.setAttribute("position", x + " " + y + " " + z);

        this.springOne.targetPosition.x = x;
        this.springOne.targetPosition.y = y;
        this.springOne.targetPosition.z = z;

        this.springOne.targetOrientation.x = rx;
        this.springOne.targetOrientation.y = ry;
        this.springOne.targetOrientation.z = rz;
        this.springOne.targetOrientation.w = rw;
        if (!this.moving) {
            this.checkIfMoving();
        }
    }

    removed() : void {
        this.root.removeChild(this.entity);
    }

    described(description: string) : void {
        this.description = description;

    }

    acted(action: string, description: string) : void {
        console.log(action + ":" + description);
        if (action === 'state-begin') {
            this.entity.dispatchEvent(new CustomEvent(Events.EVENT_STATE_BEGIN, {detail: new EntityStateEventDetail(description)}));
        }
        if (action === 'state-end') {
            this.entity.dispatchEvent(new CustomEvent(Events.EVENT_STATE_END, {detail: new EntityStateEventDetail(description)}));
        }
    }

    simulate(t: number) {
        if (this.moving) {
            this.springOne.simulate(t);
            this.springTwo.targetPosition.x = this.springOne.currentPosition.x;
            this.springTwo.targetPosition.y = this.springOne.currentPosition.y;
            this.springTwo.targetPosition.z = this.springOne.currentPosition.z;

            this.springTwo.targetOrientation.x = this.springOne.currentOrientation.x;
            this.springTwo.targetOrientation.y = this.springOne.currentOrientation.y;
            this.springTwo.targetOrientation.z = this.springOne.currentOrientation.z;
            this.springTwo.targetOrientation.w = this.springOne.currentOrientation.w;

            this.springTwo.simulate(t);

            if (this.entity.object3D) {
                // Update location only after 3d presentation is ready.
                this.entity.object3D.position.x = this.springTwo.currentPosition.x;
                this.entity.object3D.position.y = this.springTwo.currentPosition.y;
                this.entity.object3D.position.z = this.springTwo.currentPosition.z;
                this.entity.object3D.rotation.setFromQuaternion(this.springTwo.currentOrientation);
            }

            this.checkIfMoving();

        }
    }

    checkIfMoving() {
        const positionDelta = this.springOne.targetPosition.distanceTo(this.springTwo.currentPosition);

        this.targetOrientation.x = this.springOne.targetOrientation.x;
        this.targetOrientation.y = this.springOne.targetOrientation.y;
        this.targetOrientation.z = this.springOne.targetOrientation.z;
        this.targetOrientation.w = this.springOne.targetOrientation.w;

        this.currentOrientation.x = this.springTwo.currentOrientation.x;
        this.currentOrientation.y = this.springTwo.currentOrientation.y;
        this.currentOrientation.z = this.springTwo.currentOrientation.z;
        this.currentOrientation.w = this.springTwo.currentOrientation.w;

        const dot = this.targetOrientation.dot(this.currentOrientation);
        const orientationDelta = Math.acos(2 * dot * dot - 1);
        //console.log(orientationDelta);

        //const orientationDelta = ((this.springOne.targetOrientation) as any).angleTo(this.springTwo.currentOrientation) as number;
        const moving = positionDelta > 0.1 || orientationDelta > 0.2;
        //console.log(positionDelta);

        if (!this.moving && moving) {
            this.entity.dispatchEvent(new CustomEvent(Events.EVENT_STATE_BEGIN, {detail: new EntityStateEventDetail("moving")}));
            console.log("start moving");
        }
        if (this.moving && !moving) {
            this.entity.dispatchEvent(new CustomEvent(Events.EVENT_STATE_END, {detail: new EntityStateEventDetail("moving")}));
            console.log("end moving");
        }
        this.moving = moving;
    }

}