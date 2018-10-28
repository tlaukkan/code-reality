import {Entity} from "aframe";
import {Actuator} from "./Actuator";

export class Space {

    root: Entity;
    avatarId: string;
    avatarIndex: number = -1;
    actuatorsMap: Map<string, Map<number, Actuator>> = new Map<string, Map<number, Actuator>>();

    constructor(root: Entity, avatarId: string) {
        this.avatarId = avatarId;
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
        if (id === this.avatarId) {
            this.avatarIndex = index;
            console.log("dataspace - observed own avatar add:" + y);
            return;
        }
        const actuators = this.actuatorsMap.get(serverUrl);
        if (!actuators) { return; }
        const actuator = new Actuator(this.root, id, description);
        actuators!!.set(index, actuator);
        actuator.added(x, y, z, rx, ry, rz, rw);
    }

    updated(serverUrl: string, index: number, x: number, y: number, z: number, rx: number, ry: number, rz: number, rw: number) : void {
        if (index === this.avatarIndex) {
            //console.log("dataspace - observed own avatar update.");
            return;
        }
        const actuators = this.actuatorsMap.get(serverUrl);
        if (!actuators) { return; }
        const actuator = actuators.get(index);
        if (!actuator) { return; }
        actuator!!.updated(x, y, z, rx, ry, rz, rw)
    }

    removed(serverUrl: string, index: number, id: string) : void {
        if (index == this.avatarIndex) {
            console.log("dataspace - observed own avatar remove.")
            return;
        }
        const actuators = this.actuatorsMap.get(serverUrl);
        if (!actuators) { return; }
        const actuator = actuators.get(index);
        if (!actuator) { return; }
        actuator!!.removed();
    }

    described(serverUrl: string, index: number, description: string) : void {
        if (index == this.avatarIndex) {
            return;
        }
        const actuators = this.actuatorsMap.get(serverUrl);
        if (!actuators) { return; }
        const actuator = actuators.get(index);
        if (!actuator) { return; }
        actuator!!.described(description);
    }

    acted(serverUrl: string, index: number, action: string) : void {
        if (index == this.avatarIndex) {
            return;
        }
        const actuators = this.actuatorsMap.get(serverUrl);
        if (!actuators) { return; }
        const actuator = actuators.get(index);
        if (!actuator) { return; }
        actuator!!.acted(action);
    }

    simulate(t: number) {
        this.actuatorsMap.forEach(((actuators) => {
           actuators.forEach((actuator => {
               actuator.simulate(t);
           }))
        }));
    }

}