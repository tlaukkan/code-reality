import {Component, Entity} from "aframe";
import {AbstractComponentController, ComponentControllerDefinition} from "aframe-typescript-boilerplate";
import {Box3, Quaternion, Vector3} from "three";
import {CodeRealityComponentController} from "../CodeRealityComponentController";

export class UserNameController extends CodeRealityComponentController {

    public static DEFINITION = new ComponentControllerDefinition("user-name", {
        type: 'string', default: '?'
    }, false, true, (component: Component, entity: Entity, data: any) => new UserNameController(component, entity, data));

    labelElement: Entity | undefined;
    size = new Vector3(0, 0, 0);
    initialized: boolean = false;
    cameraPosition: Vector3 = new Vector3(0,0,0);
    labelPosition: Vector3 = new Vector3(0,0,0);
    lastDirection: Vector3 = new Vector3(0,0,0);
    lastLabelNormal: Vector3 = new Vector3(0,0,0);

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

        if (!this.initialized && this.entity.getObject3D("mesh")) {
            this.initialized = true;
            setTimeout(() => {
                this.size = new Box3().setFromObject(this.entity.getObject3D("mesh")).getSize(this.size);
                const height = new Box3().setFromObject(this.entity.getObject3D("mesh")).getSize(this.size).y;
                const text = this.data;
                const x = 0;
                const y = 3 * (height + 0.4); // Remove x 3 when model scaling is removed.
                const z = 0;

                this.labelElement = document.createElement('a-text');
                //this.labelElement.setAttribute("shadow", "castShadow: false; receiveShadow: false;");
                this.labelElement.setAttribute("value", text);
                this.labelElement.setAttribute("color", "#EFEFEF");
                this.labelElement.setAttribute("opacity", "0.9");
                this.labelElement.setAttribute("align", "center");
                this.labelElement.setAttribute("font", "kelsonsans");
                this.labelElement.setAttribute("scale", "1 1");
                this.labelElement.setAttribute("wrap-count", "30");
                this.labelElement.setAttribute("position", x.toFixed(2) + " " + y.toFixed(2) + " " + z.toFixed(2));
                this.entity!!.appendChild(this.labelElement);
            }, 300);
        } else if (this.labelElement && this.labelElement!!.object3D) {
            const labelObject = this.labelElement!!.object3D!!;
            this.cameraPosition.copy(this.interface.cameraEntity.object3D.position);
            this.cameraPosition = this.interface.cameraEntity.object3D.parent!!.localToWorld(this.cameraPosition);
            this.labelPosition.copy(labelObject.position);
            this.labelPosition = this.entity.object3D!!.localToWorld(this.labelPosition);


            const direction = this.labelPosition.sub(this.cameraPosition).normalize();
            direction.y = 0;
            direction.normalize();


            const labelNormal = labelObject.localToWorld(new Vector3(0, 0, -1)).sub(labelObject.localToWorld(new Vector3(0, 0, 0))).normalize();
            labelNormal.y = 0;
            labelNormal.normalize();

            if (direction.x == this.lastDirection.x &&
                direction.y == this.lastDirection.y &&
                direction.z == this.lastDirection.z &&
                labelNormal.x == this.lastLabelNormal.x &&
                labelNormal.y == this.lastLabelNormal.y &&
                labelNormal.z == this.lastLabelNormal.z) {
                return;
            }

            this.lastDirection.copy(direction);
            this.lastLabelNormal.copy(labelNormal);

            const quaternion = new Quaternion(); // create one and reuse it

            quaternion.setFromUnitVectors(labelNormal, direction);

            const newLabelQuaternion = quaternion.multiply(labelObject.quaternion);

            labelObject.quaternion.copy(newLabelQuaternion);
        }



    }

}


