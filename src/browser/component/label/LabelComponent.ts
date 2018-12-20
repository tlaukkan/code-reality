import {registerAFrameComponent} from "../../AFrame";
import {Box3, Vector3} from "three";
import {Entity} from "AFrame";
import {AbstractComponent} from "../AbstractComponent";

export class LabelComponent extends AbstractComponent {

    labelElement: Element | undefined;

    constructor(entity: Entity, data: any, state: any) {
        super(
            "label",
            {
                text: {type: 'string', default: '?'},
                height: {type: 'number', default: 1.2}
            },
            false,
            entity,
            data,
            state);
    }

    init(): void {
        console.log(this.name + " init: " + JSON.stringify(this.data));

        //const object = this.entity!!.getObject3D('mesh');
        //const bbox = new Box3().setFromObject(object);

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
        this.labelElement.setAttribute("scale", "0.1 0.1");
        this.labelElement.setAttribute("wrap-count", "30");
        this.labelElement.setAttribute("position", x.toFixed(2) + " " + y.toFixed(2) + " " + z.toFixed(2));
        this.entity!!.appendChild(this.labelElement);
    }

    update(data: any, oldData: any): void {
        console.log(this.name + " update: " + JSON.stringify(this.data));
    }

    remove(): void {
        console.log(this.name + " remove");
    }

    pause(): void {
        console.log(this.name + " pause");
    }

    play(): void {
        console.log(this.name + " play");
    }

    tick(time: number, timeDelta: number): void {
    }

}


