import {createElement} from "./util";
import {Entity} from "aframe";
import {Quaternion} from "three";
import {Spring} from "./Spring";

export class Actuator {

    id: string;
    root: Entity;
    entity: Entity;
    springOne: Spring = new Spring();
    springTwo: Spring = new Spring();

    constructor(root: Entity, id: string, description: string) {
        this.root = root;
        this.id = id;
        this.entity = createElement("<a-box></a-box>") as Entity;
    }

    added(x: number, y: number, z: number, rx: number, ry: number, rz: number, rw: number) : void {
        //this.entity.setAttribute("position", x + " " + y + " " + z);
        this.entity.object3D.position.x = x;
        this.entity.object3D.position.y = y;
        this.entity.object3D.position.z = z;
        this.entity.object3D.rotation.setFromQuaternion(new Quaternion(rx, ry, rz, rw));
        this.root.appendChild(this.entity);

        this.springOne.currentPosition.x = x;
        this.springOne.currentPosition.y = y;
        this.springOne.currentPosition.z = z;
        this.springOne.targetPosition.x = x;
        this.springOne.targetPosition.y = y;
        this.springOne.targetPosition.z = z;
        this.springTwo.currentPosition.x = x;
        this.springTwo.currentPosition.y = y;
        this.springTwo.currentPosition.z = z;
        this.springTwo.targetPosition.x = x;
        this.springTwo.targetPosition.y = y;
        this.springTwo.targetPosition.z = z;
    }

    updated(x: number, y: number, z: number, rx: number, ry: number, rz: number, rw: number) : void {
        //this.entity.setAttribute("position", x + " " + y + " " + z);
        this.springOne.targetPosition.x = x;
        this.springOne.targetPosition.y = y;
        this.springOne.targetPosition.z = z;
    }

    removed() : void {
        this.root.removeChild(this.entity);
    }

    described(description: string) : void {

    }

    acted(action: string) : void {

    }

    simulate(t: number) {
        this.springOne.simulate(t);
        this.springTwo.targetPosition.x = this.springOne.currentPosition.x;
        this.springTwo.targetPosition.y = this.springOne.currentPosition.y;
        this.springTwo.targetPosition.z = this.springOne.currentPosition.z;
        this.springTwo.simulate(t);
        this.entity.object3D.position.x = this.springTwo.currentPosition.x;
        this.entity.object3D.position.y = this.springTwo.currentPosition.y;
        this.entity.object3D.position.z = this.springTwo.currentPosition.z;
    }

}