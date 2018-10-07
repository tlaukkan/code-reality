import {Entity} from "aframe";
import {Actuator} from "./Actuator";

export class Space {

    root: Entity;
    actuatorsMap: Map<string, Map<number, Actuator>> = new Map<string, Map<number, Actuator>>();

    constructor(root: Entity) {
        this.root = root;
    }

    connected(serverUrl: string) {
        this.actuatorsMap.set(serverUrl, new Map<number, Actuator>());
    }

    disconnected(serverUrl: string) {
        if (!this.actuatorsMap.has(serverUrl)) {
            return;
        }
        this.actuatorsMap.get(serverUrl)!!.forEach((value: Actuator, key: number) => {
            value.removed();
        });
        this.actuatorsMap.delete(serverUrl);
    }

    added(serverUrl: string, index: number, id: string, x: number, y: number, z: number, rx: number, ry: number, rz: number, rw: number, description: string) : void {
        const actuators = this.actuatorsMap.get(serverUrl);
        if (!actuators) { return; }
        const actuator = new Actuator(this.root, id, description);
        actuators!!.set(index, actuator);
        actuator.added(x, y, z, rx, ry, rz, rw);
    }

    updated(serverUrl: string, index: number, x: number, y: number, z: number, rx: number, ry: number, rz: number, rw: number) : void {
        const actuators = this.actuatorsMap.get(serverUrl);
        if (!actuators) { return; }
        const actuator = actuators.get(index);
        if (!actuator) { return; }
        actuator!!.updated(x, y, z, rx, ry, rz, rw)
    }

    removed(serverUrl: string, index: number, id: string) : void {
        const actuators = this.actuatorsMap.get(serverUrl);
        if (!actuators) { return; }
        const actuator = actuators.get(index);
        if (!actuator) { return; }
        actuator!!.removed();
    }

    described(serverUrl: string, index: number, description: string) : void {
        const actuators = this.actuatorsMap.get(serverUrl);
        if (!actuators) { return; }
        const actuator = actuators.get(index);
        if (!actuator) { return; }
        actuator!!.described(description);
    }

    acted(serverUrl: string, index: number, action: string) : void {
        const actuators = this.actuatorsMap.get(serverUrl);
        if (!actuators) { return; }
        const actuator = actuators.get(index);
        if (!actuator) { return; }
        actuator!!.acted(action);
    }

}