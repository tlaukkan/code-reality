import {Component, Entity} from "AFrame";
import {AbstractComponentController} from "../../component/AbstractComponentController";
import {getSystemController} from "../../AFrame";

export class InterfaceController extends AbstractComponentController {


    constructor(component: Component, entity: Entity, data: any) {
        super("interface", {}, false, component, entity, data);
        if (!data) {
            // This is prototype not actual system instance.
            this.interfaceSystemController = {} as any;
            return;
        }
        console.log(this.componentName + " init: " + JSON.stringify(this.data));
        this.interfaceSystemController.setInterfaceController(this);
    }

    init(): void {
    }

    update(data: any, oldData: any): void {
        console.log(this.componentName + " update: " + JSON.stringify(this.data));
    }

    remove(): void {
        console.log(this.componentName + " remove");
    }

    pause(): void {
        console.log(this.componentName + " pause");
    }

    play(): void {
        console.log(this.componentName + " play");
    }

    tick(time: number, timeDelta: number): void {
    }

}


