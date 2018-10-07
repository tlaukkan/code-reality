import {Entity} from "aframe";

export class Space {

    root: Entity;
    indexIdMap: Map<string, Map<number, string>> = new Map<string, Map<number, string>>();

    constructor(root: Entity) {
        this.root = root;
    }

    connected(serverUrl: string) {
        this.indexIdMap.set(serverUrl, new Map<number, string>());
    }

    disconnected(serverUrl: string) {
        if (!this.indexIdMap.has(serverUrl)) {
            return;
        }

        this.indexIdMap.get(serverUrl)!!.forEach((value: string, key: number) => {

        });
        this.indexIdMap.delete(serverUrl);
    }

    added(serverUrl: string, index: number, id: string, x: number, y: number, z: number, rx: number, ry: number, rz: number, rw: number, description: string) : void {
        if (!this.indexIdMap.has(serverUrl)) {
            return;
        }

    }

    updated(serverUrl: string, index: number, x: number, y: number, z: number, rx: number, ry: number, rz: number, rw: number) : void {
        if (!this.indexIdMap.has(serverUrl)) {
            return;
        }

    }

    removed(serverUrl: string, index: number, id: string) : void {
        if (!this.indexIdMap.has(serverUrl)) {
            return;
        }

    }

    described(serverUrl: string, index: number, description: string) : void {
        if (!this.indexIdMap.has(serverUrl)) {
            return;
        }

    }

    acted(serverUrl: string, index: number, action: string) : void {
        if (!this.indexIdMap.has(serverUrl)) {
            return;
        }

    }

}