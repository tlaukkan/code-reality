import {ComponentControllerDefinition} from "../../AFrame";
import {Component, Entity} from "AFrame";
import {AbstractComponentController} from "../AbstractComponentController";

export class IdentityController extends AbstractComponentController {

    public static DEFINITION = new ComponentControllerDefinition(
        "identity", {}, false,
        (component: Component, entity: Entity, data: any) => new IdentityController(component, entity, data)
    );

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        //console.log(this.componentName + " init");
        fetch('/api/users/current')
        .then((response) => {
            response.json().then((data) => {
                //console.log(data);
                this.entity!!.setAttribute("label", "text:" + data.name + "; height:1.2;");
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    update(data: any, oldData: any): void {
        //console.log(this.componentName + " update");
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


