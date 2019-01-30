import {Component, Entity} from "aframe";
import {AbstractComponentController} from "../../component/AbstractComponentController";
import {ComponentControllerDefinition, getSystemController} from "../../AFrame";
import {MergeSystemController} from "./MergeSystemController";


export class MergeController extends AbstractComponentController {

    readonly mergeSystem: MergeSystemController;

    public static DEFINITION = new ComponentControllerDefinition(
        "merge",
        {},
        false,
        (component: Component, entity: Entity, data: any) => new MergeController(component, entity, data)
    );

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);

        this.mergeSystem = getSystemController(this.entity.sceneEl!!, "merge");
    }

    init(): void {
        console.log(this.componentName + " init: " + JSON.stringify(this.data));
        this.mergeSystem.addMerge(this.entity);
    }

    update(data: any, oldData: any): void {
        //console.log(this.componentName + " update: " + JSON.stringify(this.data));
    }

    remove(): void {
        this.mergeSystem.removeMerge(this.entity);
        //console.log(this.componentName + " remove");
    }

    pause(): void {
        //console.log(this.componentName + " pause");
    }

    play(): void {
        //console.log(this.componentName + " play");
    }

    tick(time: number, timeDelta: number): void {
    }

}


