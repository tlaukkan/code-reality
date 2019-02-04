import {Quaternion, Raycaster, Vector3} from "three";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {ComponentControllerDefinition} from "../../../AFrame";
import {createElement, getEntity} from "../../../util";
import {PointerTool} from "./PointerTool";
import {SpaceSystemController} from "../../../..";

export class ScaleObjectTool extends PointerTool {

    public static DEFINITION = new ComponentControllerDefinition("scale-object-tool", {}, false, true, (component: Component, entity: Entity, data: any) => new ScaleObjectTool(component, entity, data));

    scaleMultiplier = 2;
    scaling: boolean = false;

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
            if (button == Button.UP) {
                this.scaleEntityUp();
            }
        }
        super.buttonDown(device, toolSlot, button);
    }

    buttonUp(device: Device, toolSlot: Slot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == Button.DOWN) {
                this.scaleEntityDown();
            }
        }
        super.buttonUp(device, toolSlot, button);
    }

    private scaleEntityUp() {
        console.log("scale entity up");
        this.scale(this.scaleMultiplier);
    }

    private scaleEntityDown() {
        console.log("scale entity down");
        this.scale(1 / this.scaleMultiplier);
    }

    private scale(multiplier: number) {
        if (this.scaling) {
            return; // One operation at a time.
        }

        const pointedObject = this.pointedObject;
        const pointerPosition = this.pointedPosition;
        //const pointedFaceIndex = this.pointedFaceIndex;

        if (pointedObject && pointerPosition) {
            this.scaling = true;
            const pointedEntity = getEntity(pointedObject)!!;

            const position =  pointedEntity.object3D.getWorldPosition(pointedEntity.object3D.position.clone());
            const scale = (pointedEntity.getAttribute("scale") as Vector3).clone();

            scale.x *= multiplier;
            scale.y *= multiplier;
            scale.z *= multiplier;

            console.log(scale);

            pointedEntity.setAttribute("scale", scale);
            pointedEntity.flushToDOM();

            const entityXml = pointedEntity.outerHTML;

            console.log(entityXml);

            const spaceSystem = this.getSystemController("space") as SpaceSystemController;

            // TODO Replace with update operation when it works.
            spaceSystem.removeEntity(pointedEntity);
            setTimeout(() => {
                spaceSystem.saveEntity(entityXml, position, scale);
                setTimeout(() => {
                    this.scaling = false;
                }, 1000);
            }, 1000);

        }
    }
}


