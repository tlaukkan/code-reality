import {Entity} from "aframe";
import {Object3D} from "three";

export class MergeData {

    entity: Entity;
    childEntities: Set<Entity> = new Set<Entity>();

    mergeObject: Object3D | undefined;

    loadingChildEntities: Set<Entity> = new Set<Entity>();

    constructor(entity: Entity) {
        this.entity = entity;
    }

}