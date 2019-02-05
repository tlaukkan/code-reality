import {Raycaster, Vector3} from "three";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {ComponentControllerDefinition, getComponentController} from "../../../AFrame";
import {getEntity} from "../../../util";
import {PointerTool} from "./PointerTool";
import {SpaceSystemController} from "../../../..";
import {MergeSystemController} from "../../merge/MergeSystemController";
import {MergeController} from "../../merge/MergeController";
import {ModelController} from "../../merge/ModelController";

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
                if (this.pressed.has(Button.TRIGGER)) {
                    this.scaleEntityUp();
                } else {
                    this.scaleSelfUp();
                }
            }
        }
        super.buttonDown(device, toolSlot, button);
    }

    buttonUp(device: Device, toolSlot: Slot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == Button.DOWN) {
                if (this.pressed.has(Button.TRIGGER)) {
                    this.scaleEntityDown();
                } else {
                    this.scaleSelfDown();
                }
            }
        }
        super.buttonUp(device, toolSlot, button);
    }

    private scaleSelfUp() {
        this.scaleSelf(this.scaleMultiplier);
    }

    private scaleSelfDown() {
        this.scaleSelf(1 / this.scaleMultiplier);
    }

    private scaleSelf(multiplier: number) {
        this.interface.setSelfScale(this.interface.getSelfScale() * multiplier);
    }

    private scaleEntityUp() {
        console.log("scale entity up");

        const pointedObject = this.pointedObject;
        if (pointedObject) {
            const pointedEntity = getEntity(pointedObject)!!;

            this.scaleEntity(pointedEntity, this.scaleMultiplier);
        }
    }

    private scaleEntityDown() {
        console.log("scale entity down");

        const pointedObject = this.pointedObject;
        if (pointedObject) {
            const pointedEntity = getEntity(pointedObject)!!;

            this.scaleEntity(pointedEntity, 1 / this.scaleMultiplier);
        }
    }

    private scaleEntity(entity: Entity, multiplier: number) {
        if (this.scaling) {
            return; // One operation at a time.
        }

        this.scaling = true;

        const spaceSystem = this.getSystemController("space") as SpaceSystemController;
        const position =  entity.object3D.getWorldPosition(entity.object3D.position.clone());
        const scale = (entity.getAttribute("scale") as Vector3).clone();

        scale.x *= multiplier;
        scale.y *= multiplier;
        scale.z *= multiplier;

        spaceSystem.updateEntity(entity, position, scale);

        this.scaling = false;

    }
}


