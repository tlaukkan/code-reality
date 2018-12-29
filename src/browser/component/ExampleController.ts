import {Component, Entity} from "AFrame";
import {AbstractComponentController} from "./AbstractComponentController";
import {ComponentControllerDefinition} from "../AFrame";

export class ExampleController extends AbstractComponentController {

    public static DEFINITION = new ComponentControllerDefinition(
        "example",
        {},
        false,
        (component: Component, entity: Entity, data: any) => new ExampleController(component, entity, data)
    );

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        console.log(this.componentName + " init: " + JSON.stringify(this.data));
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


