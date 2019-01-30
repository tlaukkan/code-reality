import {Entity} from "aframe";
import {Object3D} from "three";

export class MergeData {

    entity: Entity;
    childEntities: Set<Entity> = new Set<Entity>();
    loadingChildEntities: Set<Entity> = new Set<Entity>();
    mergeObject: Object3D | undefined;

    lastModificationTimeMillis = 0;
    lastMergeTimeMillis = 0;

    constructor(entity: Entity) {
        this.entity = entity;
    }

}