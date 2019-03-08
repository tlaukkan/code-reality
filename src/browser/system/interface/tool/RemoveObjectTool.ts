import {Raycaster} from "three";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {PointerTool} from "./PointerTool";
import {SpaceSystemController} from "../../../..";
import {ComponentControllerDefinition, getEntity} from "aframe-typescript-boilerplate";

export class RemoveObjectTool extends PointerTool {

    public static DEFINITION = new ComponentControllerDefinition("remove-object-tool", {}, false, true, (component: Component, entity: Entity, data: any) => new RemoveObjectTool(component, entity, data));

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        this.raycaster = new Raycaster();
    }

    init(): void {
        //console.log(this.componentName + " init");
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

        const spaceSystem = this.getSystemController("space") as SpaceSystemController;

        if (pointedObject && pointerPosition) {
            const pointedEntity = getEntity(pointedObject);
            if (pointedEntity) {
                spaceSystem.removeEntity(pointedEntity);
            }
        }
    }


}


