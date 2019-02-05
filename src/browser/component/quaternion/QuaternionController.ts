import {ComponentControllerDefinition} from "../../AFrame";
import {Component, Entity} from "aframe";
import {AbstractComponentController} from "../AbstractComponentController";

export class QuaternionController extends AbstractComponentController {

    public static DEFINITION = new ComponentControllerDefinition("quaternion", {
        type: 'vec4'
    }, false, false, (component: Component, entity: Entity, data: any) => new QuaternionController(component, entity, data));

    labelElement: Element | undefined;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        //console.log(this.componentName + " init: " + JSON.stringify(this.data));

        const x = this.data.x;
        const y = this.data.y;
        const z = this.data.z;
        const w = this.data.w;

        this.entity.object3D.quaternion.x = x;
        this.entity.object3D.quaternion.y = y;
        this.entity.object3D.quaternion.z = z;
        this.entity.object3D.quaternion.w = w;

    }

    update(data: any, oldData: any): void {
        const x = data.x;
        const y = data.y;
        const z = data.z;
        const w = data.w;

        this.entity.object3D.quaternion.x = x;
        this.entity.object3D.quaternion.y = y;
        this.entity.object3D.quaternion.z = z;
        this.entity.object3D.quaternion.w = w;
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


