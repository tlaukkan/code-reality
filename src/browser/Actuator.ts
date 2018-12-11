import {createElement} from "./util";
import {Entity} from "aframe";
import {Quaternion} from "three";
import {Spring} from "./Spring";

export class Actuator {

    id: string;
    serverUrl: string;
    description: string;
    root: Entity;
    entity: Entity;
    springOne: Spring = new Spring();
    springTwo: Spring = new Spring();

    lastUpdateTime: number = 0;
    averageUpdateInterval: number = 0.200;

    constructor(root: Entity, serverUrl: string, id: string, description: string) {
        this.root = root;
        this.serverUrl = serverUrl;
        this.id = id;
        this.description = description;
        this.entity = createElement(description) as Entity;
        this.entity.setAttribute("did", id);
        this.entity.setAttribute("server", serverUrl);
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
    }

    removed() : void {
        this.root.removeChild(this.entity);
    }

    described(description: string) : void {
        this.description = description;

    }

    acted(action: string) : void {

    }

    simulate(t: number) {
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
    }

}