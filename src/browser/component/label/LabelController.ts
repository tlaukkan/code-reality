import {Component, Entity} from "aframe";
import {AbstractComponentController, ComponentControllerDefinition} from "aframe-typescript-boilerplate";

export class LabelController extends AbstractComponentController {

    public static DEFINITION = new ComponentControllerDefinition("label", {
        text: {type: 'string', default: '?'},
        height: {type: 'number', default: 1.2}
    }, false, false, (component: Component, entity: Entity, data: any) => new LabelController(component, entity, data));

    labelElement: Element | undefined;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        //console.log(this.componentName + " init: " + JSON.stringify(this.data));

        const text = this.data['text'];
        const x = 0;
        const y = this.data['height'];
        const z = 0;

        this.labelElement = document.createElement('a-text');
        this.labelElement.setAttribute("value", text);
        this.labelElement.setAttribute("color", "#FFFFFF");
        this.labelElement.setAttribute("opacity", "0.5");
        this.labelElement.setAttribute("resizer", "");
        this.labelElement.setAttribute("billboard", "");
        this.labelElement.setAttribute("align", "center");
        this.labelElement.setAttribute("font", "kelsonsans");
        this.labelElement.setAttribute("scale", "0.5 0.5");
        this.labelElement.setAttribute("wrap-count", "30");
        this.labelElement.setAttribute("position", x.toFixed(2) + " " + y.toFixed(2) + " " + z.toFixed(2));
        this.entity!!.appendChild(this.labelElement);
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


