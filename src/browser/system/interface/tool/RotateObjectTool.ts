import {Quaternion, Raycaster, Vector, Vector3} from "three";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {PointerTool} from "./PointerTool";
import {SpaceSystemController} from "../../../..";
import {getEntity, ComponentControllerDefinition} from "aframe-typescript-boilerplate";

export class RotateObjectTool extends PointerTool {

    public static DEFINITION = new ComponentControllerDefinition("rotate-object-tool", {}, false, true, (component: Component, entity: Entity, data: any) => new RotateObjectTool(component, entity, data));

    rotateDegrees = 22.5;

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
        }
        super.buttonDown(device, toolSlot, button);
    }

    buttonUp(device: Device, toolSlot: Slot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == Button.UP) {
                if (this.pressed.has(Button.TRIGGER)) {
                    this.rotateForward();
                }
            }
            if (button == Button.DOWN) {
                if (this.pressed.has(Button.TRIGGER)) {
                    this.resetRotation();
                }
            }
        }
        super.buttonUp(device, toolSlot, button);
    }

    private rotateForward() {
        const object = this.pointedObject;
        if (object) {
            const entity = getEntity(object)!!;
            this.rotate(entity, this.rotateDegrees);
        }
    }

    private rotateBackward() {
        const object = this.pointedObject;
        if (object) {
            const entity = getEntity(object)!!;
            this.rotate(entity, -this.rotateDegrees);
        }
    }

    private rotate(entity: Entity, rotateDegrees: number) {
        const spaceSystem = this.getSystemController("space") as SpaceSystemController;

        const gridStep = 1;
        const pointedObject = this.pointedObject;
        const pointerPosition = this.pointedPosition;
        const pointedFace = this.pointedFace;

        if (pointedObject && pointerPosition && pointedFace) {
            const normal = pointedObject.localToWorld(pointedFace.normal.clone()).sub(pointedObject.localToWorld(pointedObject.position.clone()));

            const axis = normal;
            const angle = rotateDegrees * (2 * Math.PI) / 360;

            const quaternionRotation = new Quaternion();
            quaternionRotation.setFromAxisAngle(axis, angle);

            const currentPosition =  entity.object3D.getWorldPosition(entity.object3D.position.clone());
            const currentScale = entity.getAttribute("scale") as Vector3;
            const currentOrientation = entity.object3D.quaternion.clone();

            const newOrientation = quaternionRotation.multiply(currentOrientation);
            spaceSystem.updateEntity(entity, currentPosition,  newOrientation.normalize(), currentScale);
        }
    }

    private resetRotation() {
        const object = this.pointedObject;
        if (object) {
            const entity = getEntity(object)!!;
            const spaceSystem = this.getSystemController("space") as SpaceSystemController;
            const currentPosition = entity.object3D.getWorldPosition(entity.object3D.position.clone());
            const currentScale = entity.getAttribute("scale") as Vector3;
            const newOrientation = new Quaternion(0, 0, 0, 1);
            spaceSystem.updateEntity(entity, currentPosition, newOrientation, currentScale);
        }
    }
}


