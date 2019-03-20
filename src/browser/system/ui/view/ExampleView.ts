import AFRAME from "aframe";
import {Component, Entity} from "aframe";
import {AbstractComponentController, ComponentControllerDefinition, createElement} from "aframe-typescript-boilerplate";
import templateHtml from './ExampleView.html';
import {createElements} from "../../../util";

export class ExampleView extends AbstractComponentController {

    public static DEFINITION = new ComponentControllerDefinition("example-view", {},
        false, false, (component: Component, entity: Entity, data: any) => new ExampleView(component, entity, data));


    template = templateHtml;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        const elements = createElements(this.template);
        for (const element of elements) {
            this.entity.append(element);
        }
    }

    update(data: any, oldData: any): void {

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

AFRAME.registerPrimitive('a-example-view', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "example-view":{}
    },
    mappings: {
    }
}));
