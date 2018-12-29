import {Component, Entity} from "AFrame";
import {AbstractComponentController} from "../AbstractComponentController";
import {ComponentControllerDefinition} from "../../AFrame";

export class CollidableController extends AbstractComponentController {

    public static DEFINITION = new ComponentControllerDefinition(
        "collidable",
        {},
        false,
        (component: Component, entity: Entity, data: any) => new CollidableController(component, entity, data)
    );

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        console.log(this.componentName + " init: " + JSON.stringify(this.data));
        this.interface.addCollidable(this.entity.object3D);
    }

    update(data: any, oldData: any): void {
        //console.log(this.componentName + " update: " + JSON.stringify(this.data));
    }

    remove(): void {
        //console.log(this.componentName + " remove");
        this.interface.removeCollidable(this.entity.object3D);
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


