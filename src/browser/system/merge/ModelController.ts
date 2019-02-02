import {Component, Entity} from "aframe";
import {AbstractComponentController} from "../../component/AbstractComponentController";
import {ComponentControllerDefinition, getSystemController} from "../../AFrame";
import {setEntityGltfModel} from "../../three/gltf_load";
import {MergeSystemController} from "./MergeSystemController";

export class ModelController extends AbstractComponentController {

    readonly mergeSystem: MergeSystemController;
    merge: Entity | undefined;

    public static DEFINITION = new ComponentControllerDefinition("model", {type: 'model'}, false, false, (component: Component, entity: Entity, data: any) => new ModelController(component, entity, data));

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        this.mergeSystem = getSystemController(this.entity.sceneEl!!, "merge");
    }

    init(): void {
        //console.log(this.componentName + " init: " + JSON.stringify(this.data));
        this.merge = this.recursiveFindMergeParent(this.entity);
        if (this.merge) {
            this.mergeSystem.addLoadingMergeChild(this.merge!!, this.entity);
        }
    }

    update(data: any, oldData: any): void {
        //console.log(this.componentName + " update: " + JSON.stringify(this.data));
        setEntityGltfModel(this.entity, data).then(() => {
            //console.log("Static model loaded: " + data);
            if (this.merge) {
                this.mergeSystem.setMergeChildLoaded(this.merge!!, this.entity);
            }
        }).catch((error) => {
            console.error("Error loading static model:" + data, error);
        });
    }

    remove(): void {
        if (this.merge) {
            this.mergeSystem.removeMergeChild(this.merge!!, this.entity);
        }

    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
        console.error("model tick should not happen.");
    }

    recursiveFindMergeParent(entity: Entity) : Entity | undefined {
        const parent = entity.parentElement as Entity;
        if (!parent) {
            return undefined;
        }
        if (parent.hasAttribute("merge")) {
            return parent;
        } else {
            return this.recursiveFindMergeParent(parent);
        }
    }

}


