import {Geometry, Mesh, Quaternion, Raycaster} from "three";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {ComponentControllerDefinition} from "../../../AFrame";
import {createElement} from "../../../util";
import {PointerTool} from "./PointerTool";
import {snapVector3ToAxisAlignedGrid} from "../../../math/math";

export class AddObjectTool extends PointerTool {

    public static DEFINITION = new ComponentControllerDefinition(
        "add-object-tool", {}, false, (component: Component, entity: Entity, data: any) => new AddObjectTool(component, entity, data)
    );

    entityTemplateScale = 1;
    entityTemplate: string = '<a-entity gltf-model="#cube" collidable/>';

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        this.raycaster = new Raycaster();
    }

    init(): void {
        console.log(this.componentName + " init");
        super.init();
    }

    tick(time: number, timeDelta: number): void {
        super.tick(time, timeDelta);
    }

    buttonDown(device: Device, toolSlot: Slot, button: Button): void {
        if (!this.pressed.has(button)) {
        }
        super.buttonDown(device, toolSlot, button);
    }

    buttonUp(device: Device, toolSlot: Slot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == Button.TRIGGER) {
                this.addEntity(device);
            }
        }
        super.buttonUp(device, toolSlot, button);
    }

    private addEntity(device: Device) {

        const gridStep = 1;
        const pointedObject = this.pointedObject;
        const pointerPosition = this.pointedPosition;
        //const pointedFaceIndex = this.pointedFaceIndex;

        if (pointedObject && pointerPosition) {
            const pointedObjectPosition = pointedObject.position.clone();
            pointedObject.getWorldPosition(pointedObjectPosition);

            const newPosition = pointerPosition.clone();
            newPosition.sub(pointedObjectPosition);
            newPosition.normalize();
            newPosition.multiplyScalar(gridStep / 2);
            newPosition.add(pointerPosition);

            const snappedPosition = snapVector3ToAxisAlignedGrid(newPosition, gridStep);

            const newEntity = createElement(this.entityTemplate) as Entity;
            newEntity.setAttribute("scale", this.entityTemplateScale + " " + this.entityTemplateScale + " " + this.entityTemplateScale);
            newEntity.setAttribute("position", snappedPosition.x + " " + snappedPosition.y + " " + snappedPosition.z);
            this.scene.appendChild(newEntity);

        }
    }


}


