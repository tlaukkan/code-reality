import {Raycaster} from "three";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {ComponentControllerDefinition} from "../../../AFrame";
import {getElement} from "../../../util";
import {PointerTool} from "./PointerTool";
import {SpaceSystemController} from "../../../..";

export class RemoveObjectTool extends PointerTool {

    public static DEFINITION = new ComponentControllerDefinition(
        "remove-object-tool", {}, false, (component: Component, entity: Entity, data: any) => new RemoveObjectTool(component, entity, data)
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
                this.removeEntity(device);
            }
        }
        super.buttonUp(device, toolSlot, button);
    }

    private removeEntity(device: Device) {

        const pointedObject = this.pointedObject;
        const pointerPosition = this.pointedPosition;

        if (pointedObject && pointerPosition) {
            const pointedEntity = getElement(pointedObject);
            if (pointedEntity) {

                const entitySid = pointedEntity.getAttribute("sid");

                if (entitySid) {
                    console.log("removing from storage");
                    const spaceSystem = this.getSystemController("space") as SpaceSystemController;
                    const position = pointedEntity.object3D.position.clone();
                    const worldPosition = pointedEntity.object3D.getWorldPosition(position);
                    spaceSystem.removeEntity(entitySid, worldPosition.x, worldPosition.y, worldPosition.z);
                }

                console.log("removing locally");
                pointedEntity.parentElement!!.removeChild(pointedEntity);

            }
        }
    }

}


