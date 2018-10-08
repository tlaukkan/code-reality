import {createElement} from "./util";
import {Entity} from "aframe";
import {Quaternion} from "three";

export class Actuator {

    id: string;
    root: Entity;
    entity: Entity;

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
    }

    updated(x: number, y: number, z: number, rx: number, ry: number, rz: number, rw: number) : void {
        this.entity.setAttribute("position", x + " " + y + " " + z);
    }

    removed() : void {
        this.root.removeChild(this.entity);
    }

    described(description: string) : void {

    }

    acted(action: string) : void {

    }

}