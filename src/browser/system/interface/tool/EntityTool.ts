import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {Object3D, Plane, Raycaster, Vector3} from "three";
import {CollidableCrawler} from "./CollideableCrawler";
import {EntityStateEventDetail} from "../../../model/EntityStateEventDetail";
import {Events} from "../../../model/Events";
import {Component, Entity} from "AFrame";
import {Device} from "../Device";
import {Tool} from "../Tool";
import {ToolSlot} from "../model/ToolSlot";
import {Button} from "../model/Button";
import {Stick} from "../model/Stick";

export class EntityTool extends AbstractComponentController implements Tool {

    pressed: Set<Button> = new Set();
    time: number = 0;

    constructor(component: Component, entity: Entity, data: any) {
        super("entity-tool", {}, false, component, entity, data);
        if (!component) {
            return;
        }
        this.interfaceSystemController.setTool(ToolSlot.PRIMARY, this);
    }

    init(): void {
        console.log(this.componentName + " init");

    }


    update(data: any, oldData: any): void {}

    remove(): void {}

    pause(): void {}

    play(): void {}

    tick(time: number, timeDelta: number): void {

    }

    buttonDown(device: Device, toolSlot: ToolSlot, button: Button): void {
        if (!this.pressed.has(button)) {
            this.pressed.add(button);
        }
    }

    buttonUp(device: Device, toolSlot: ToolSlot, button: Button): void {
        if (this.pressed.has(button)) {
            this.pressed.delete(button)
        }
    }

    stickTwist(device: Device, toolSlot: ToolSlot, stick: Stick, x: number, y: number): void {

    }

}


