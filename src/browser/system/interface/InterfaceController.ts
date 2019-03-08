import {Component, Entity} from "aframe";
import {AbstractComponentController, ComponentControllerDefinition} from "aframe-typescript-boilerplate";
import {CodeRealityComponentController} from "../../component/CodeRealityComponentController";

export class InterfaceController extends CodeRealityComponentController {

    public static DEFINITION = new ComponentControllerDefinition("interface", {}, false, false, (component: Component, entity: Entity, data: any) => new InterfaceController(component, entity, data));

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        //console.log(this.componentName + " init: " + JSON.stringify(this.data));
        this.interface.setInterfaceController(this);
    }

    init(): void {
    }

    update(data: any, oldData: any): void {
        //console.log(this.componentName + " update: " + JSON.stringify(this.data));
    }

    remove(): void {
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


