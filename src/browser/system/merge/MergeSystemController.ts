import {Entity, Scene, System} from "aframe";
import {AbstractSystemController} from "../AbstractSystemController";
import {SystemControllerDefinition} from "../../AFrame";
import List = Mocha.reporters.List;
import {MergeData} from "./MergeData";
import {Mesh, Object3D, Vector3} from "three";
import {cloneObject3D, mergeObject3Ds} from "../../three/merge_util";

export class MergeSystemController extends AbstractSystemController {

    readonly merges = new Map<Entity, MergeData>();

    public static DEFINITION = new SystemControllerDefinition(
        "merge",
        {},
        (system: System, scene: Scene, data: any) => new MergeSystemController(system, scene, data)
    );

    constructor(system: System, scene: Scene, data: any) {
        super(system, scene, data);

    }

    init(): void {
    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
        const timeMillis = new Date().getTime();
        for (const merge of this.merges.values()) {
            if (merge.lastMergeTimeMillis != 0 && merge.lastModificationTimeMillis > merge.lastMergeTimeMillis && timeMillis - merge.lastModificationTimeMillis > 60000) {
                this.merge(merge);
            }
        }
    }

    addMerge(mergeEntity: Entity) {
        console.log("merge added.");
        if (!this.merges.has(mergeEntity)) {
            this.merges.set(mergeEntity, new MergeData(mergeEntity));
        }
    }

    addLoadingMergeChild(mergeEntity: Entity, mergeChildEntity: Entity) {
        //console.log("merge child loading...");
        if (!this.merges.has(mergeEntity)) {
            this.merges.set(mergeEntity, new MergeData(mergeEntity));
        }
        const merge = this.merges.get(mergeEntity)!!;
        merge.childEntities.add(mergeChildEntity);
        merge.loadingChildEntities.add(mergeChildEntity);
    }

    setMergeChildLoaded(mergeEntity: Entity, mergeChildEntity: Entity) {
        //console.log("merge child loaded.");
        const merge = this.merges.get(mergeEntity)!!;
        if (!merge) {
            return;
        }

        merge.loadingChildEntities.delete(mergeChildEntity);
        merge.mergingChildEntities.add(mergeChildEntity);
        if (merge.loadingChildEntities.size > 0) {
            //console.log("merge child entities still loading: " + merge.loadingChildEntities.size);
            return;
        }

        console.log("merge child entities loaded.");

        merge.lastModificationTimeMillis = new Date().getTime();

        //if (merge.lastMergeTimeMillis == 0) {
            this.merge(merge);
        //}

    }

    private merge(merge: MergeData) {

        merge.lastMergeTimeMillis = new Date().getTime();
        console.log("merging...");

        const startTimeMillis = new Date().getTime();
        // Remove old merge object.
        if (merge.mergeObject) {
            merge.entity.object3D.remove(merge.mergeObject);
            for (const child of merge.mergeObject.children) {
                (child as Mesh).geometry.dispose();
            }
            //(merge.mergeObject as Mesh).geometry.dispose();
        }

        // Collect objects to merge.
        const objectsToMerge = new Array<Object3D>();
        console.log("child entities to merge size: " + merge.mergingChildEntities.size);
        for (const entity of merge.mergingChildEntities) {
            const originalObject = entity.object3D;
            //entity.removeObject3D("mesh");
            // Set original hidden.
            originalObject.visible = false;

            // Clone object to merge and setup coordinates.
            const objectToMerge = cloneObject3D(originalObject);

            // Transfer to world coordinates as clone does not have parent

            // get world position
            let position = new Vector3();
            originalObject.updateMatrixWorld(true)
            position.setFromMatrixPosition(originalObject.matrixWorld);

            // convert to merge entity world local coordinates
            merge.entity.object3D.updateMatrixWorld(true)
            position = merge.entity.object3D.worldToLocal(position);

            objectToMerge.position.x = position.x;
            objectToMerge.position.y = position.y;
            objectToMerge.position.z = position.z;

            objectsToMerge.push(objectToMerge);
        }
        merge.mergingChildEntities.clear();

        const mergeObject = mergeObject3Ds(merge.objectMerge, objectsToMerge);

        merge.mergeObject = mergeObject;
        merge.entity.object3D.add(mergeObject);

        console.log("merge done: " + (new Date().getTime() - startTimeMillis) + " ms.");
    }

    removeMergeChild(mergeEntity: Entity, mergeChildEntity: Entity) {
        //console.log("merge child remove.");
        if (this.merges.has(mergeEntity)) {
            const merge = this.merges.get(mergeEntity)!!;
            merge.childEntities.delete(mergeChildEntity);
            merge.loadingChildEntities.delete(mergeChildEntity);
            this.merge(merge);
        }
    }

    removeMerge(mergeEntity: Entity) {
        console.log("merge remove.");

        const merge = this.merges.get(mergeEntity)!!;

        if (merge) {
            this.merges.delete(mergeEntity);

            // Remove old merge object.
            if (merge.mergeObject) {
                merge.entity.object3D.remove(merge.mergeObject);
            }
        }
    }
}


