import {Raycaster, Vector, Vector3} from "three";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {ComponentControllerDefinition} from "../../../AFrame";
import {getEntity} from "../../../util";
import {PointerTool} from "./PointerTool";
import {SpaceSystemController} from "../../../..";
import {snapVector3ToAxisAlignedGrid} from "../../../math/math";

export class MoveObjectTool extends PointerTool {

    public static DEFINITION = new ComponentControllerDefinition("move-object-tool", {}, false, true, (component: Component, entity: Entity, data: any) => new MoveObjectTool(component, entity, data));

    moveStep = 0.25;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        this.raycaster = new Raycaster();
    }

    init(): void {
        super.init();
    }

    tick(time: number, timeDelta: number): void {
        super.tick(time, timeDelta);
    }

    buttonDown(device: Device, toolSlot: Slot, button: Button): void {
        if (!this.pressed.has(button)) {
            if (button == Button.UP) {
                if (this.pressed.has(Button.TRIGGER)) {
                    this.moveForward();
                }
            }
        }
        super.buttonDown(device, toolSlot, button);
    }

    buttonUp(device: Device, toolSlot: Slot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == Button.DOWN) {
                if (this.pressed.has(Button.TRIGGER)) {
                    this.moveBackward();
                }
            }
        }
        super.buttonUp(device, toolSlot, button);
    }

    private moveForward() {
        const object = this.pointedObject;
        if (object) {
            const entity = getEntity(object)!!;
            this.move(entity, this.moveStep);
        }
    }

    private moveBackward() {
        const object = this.pointedObject;
        if (object) {
            const entity = getEntity(object)!!;
            this.move(entity, -this.moveStep);
        }
    }

    private move(entity: Entity, moveStep: number) {
        const spaceSystem = this.getSystemController("space") as SpaceSystemController;

        const gridStep = 1;
        const pointedObject = this.pointedObject;
        const pointerPosition = this.pointedPosition;
        const pointedFace = this.pointedFace;

        if (pointedObject && pointerPosition && pointedFace) {

            const currentPosition =  entity.object3D.getWorldPosition(entity.object3D.position.clone());
            const newPosition = currentPosition.add(pointedFace.normal.multiplyScalar(- this.interface.getSelfScale() * gridStep * moveStep));
            const scale = entity.getAttribute("scale") as Vector3;
            spaceSystem.updateEntity(entity, newPosition,  scale);

        }
    }
}


