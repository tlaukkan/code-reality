import {Entity, Scene, System} from "aframe";
import {AbstractSystemController} from "../AbstractSystemController";
import {SystemControllerDefinition} from "../../AFrame";
import List = Mocha.reporters.List;
import {MergeData} from "./MergeData";
import {Mesh, Object3D, Vector3} from "three";
import {clearObject3Ds, cloneObject3D, mergeObject3Ds, ObjectMerge} from "../../three/merge_util";
import {LoaderSystemController} from "../loader/LoaderSystemController";

export class MergeSystemController extends AbstractSystemController {

    readonly merges = new Map<Entity, MergeData>();
    private startTime = new Date().getTime();

    public static DEFINITION = new SystemControllerDefinition(
        "merge",
        {},
        (system: System, scene: Scene, data: any) => new MergeSystemController(system, scene, data)
    );

    constructor(system: System, scene: Scene, data: any) {
        super(system, scene, data);

    }

    init(): void {
        (this.getSystemController("loader-system") as LoaderSystemController).enable();
    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
        /*const timeMillis = new Date().getTime();
        for (const merge of this.merges.values()) {
            if (merge.lastMergeTimeMillis != 0 && merge.lastModificationTimeMillis > merge.lastMergeTimeMillis && timeMillis - merge.lastModificationTimeMillis > 60000) {
                this.merge(merge);
            }
        }
        */
        let merging = new Date().getTime() - this.startTime < 3000;

        for (const merge of this.merges.values()) {
            if (merge.loadingChildEntities.size > 0 || merge.mergingChildEntities.size > 0) {
                merging = true;
            }
        }
        if (!merging) {
            (this.getSystemController("loader-system") as LoaderSystemController).disable();
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
        merge.lastModificationTimeMillis = new Date().getTime();
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


        //if (merge.lastMergeTimeMillis == 0) {
            this.merge(merge);
        //}

    }

    private merge(merge: MergeData) {

        console.log("merging...");

        const startTimeMillis = new Date().getTime();

        // Collect objects to merge.
        const objectsToMerge = new Array<Object3D>();
        console.log("child entities to merge size: " + merge.mergingChildEntities.size);
        for (const entity of merge.mergingChildEntities) {
            const originalObject = entity.object3D;
            this.allocateMergeObjectIndex(merge.objectMerge, originalObject);
            //entity.removeObject3D("mesh");
            // Set original hidden.
            originalObject.visible = false;

            // Clone object to merge and setup coordinates.
            //const objectToMerge = originalObject;
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

        mergeObject3Ds(merge.objectMerge, objectsToMerge);

        if (!merge.group) {
            merge.group = merge.objectMerge.group;
            merge.entity.object3D.add(merge.group);
        }

        merge.lastMergeTimeMillis = new Date().getTime();
        console.log("merge done: " + (new Date().getTime() - startTimeMillis) + " ms.");

        (this.getSystemController("loader-system") as LoaderSystemController).disable();
    }

    private allocateMergeObjectIndex(objectMerge: ObjectMerge, object: Object3D) {
        object.userData.mergeObjectIndex = objectMerge.objectOffset;
        objectMerge.objectOffset++;

        if (object.children) {
            for (const child of object.children) {
                this.allocateMergeObjectIndex(objectMerge, child);
            }
        }

    }

    private remove(merge: MergeData) {
        const startTimeMillis = new Date().getTime();
        merge.lastMergeTimeMillis = startTimeMillis;

        console.log("removing from merge...");
        console.log("child entities to remove size: " + merge.removingChildEntities.size);

        // Collect objects to merge.
        const objectsToRemove = new Array<Object3D>();
        for (const entity of merge.removingChildEntities) {
            const originalObject = entity.object3D;
            originalObject.visible = true;
            objectsToRemove.push(originalObject);
        }
        merge.removingChildEntities.clear();

        clearObject3Ds(merge.objectMerge, objectsToRemove);

        console.log("removing from merge done: " + (new Date().getTime() - startTimeMillis) + " ms.");
    }

    removeMergeChild(mergeEntity: Entity, mergeChildEntity: Entity) {
        //console.log("merge child remove.");
        if (this.merges.has(mergeEntity)) {
            const merge = this.merges.get(mergeEntity)!!;
            merge.childEntities.delete(mergeChildEntity);
            merge.loadingChildEntities.delete(mergeChildEntity);
            merge.removingChildEntities.add(mergeChildEntity);
            this.remove(merge);
        }
    }

    removeMerge(mergeEntity: Entity) {
        console.log("merge remove.");

        const merge = this.merges.get(mergeEntity)!!;

        if (merge) {
            this.merges.delete(mergeEntity);

            // Remove old merge object.
            if (merge.group) {
                merge.entity.object3D.remove(merge.group);
            }
        }
    }
}


