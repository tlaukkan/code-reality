import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {Component, Entity} from "AFrame";
import {DeviceSlot} from "../model/DeviceSlot";
import {Device} from "../Device";
import {ToolSlot} from "../model/ToolSlot";
import {Button} from "../model/Button";

export class ViveController extends AbstractComponentController implements Device {


    constructor(component: Component, entity: Entity, data: any) {
        super("vive-controller", {}, false, component, entity, data);

        if (!component) {
            return;
        }
        this.interfaceSystemController.setDevice(DeviceSlot.KEYBOARD_AND_MOUSE, this);
    }

    init(): void {
        console.log(this.componentName + " init");

        this.addEventListener("triggerup", (detail: any) => {
            this.interfaceSystemController.buttonUp(this, ToolSlot.SECONDARY, Button.TRIGGER);
            console.log("triggerup " + detail);
        });
        this.addEventListener("triggerdown", (detail: any) => {
            this.interfaceSystemController.buttonDown(this, ToolSlot.SECONDARY, Button.TRIGGER);
            console.log("triggerdown " + detail);
        });

        this.addEventListener("gripup", (detail: any) => {
            this.interfaceSystemController.buttonUp(this, ToolSlot.SECONDARY, Button.GRIP);
            console.log("gripup " + detail);
        });
        this.addEventListener("gripdown", (detail: any) => {
            this.interfaceSystemController.buttonDown(this, ToolSlot.SECONDARY, Button.GRIP);
            console.log("gripdown " + detail);
        });

        this.addEventListener("menuup", (detail: any) => {
            this.interfaceSystemController.buttonUp(this, ToolSlot.SECONDARY, Button.MENU);
            console.log("menuup " + detail);
        });
        this.addEventListener("menudown", (detail: any) => {
            this.interfaceSystemController.buttonDown(this, ToolSlot.SECONDARY, Button.MENU);
            console.log("menudown " + detail);
        });

        /*
        this.addEventListener("trackpaddown", (detail: any) => {
            console.log("trackpaddown " + detail);
        });
        this.addEventListener("trackpadup", (detail: any) => {
            console.log("trackpadup " + detail);
        });
        */

        this.addEventListener("axismove", (detail:  any) => {
            const axis: Array<number> = detail.axis;
            console.log("axismove " + axis);
            this.interfaceSystemController.stickTwist(this, ToolSlot.SECONDARY, axis[1], axis[0]);
        });
        this.addEventListener("trackpadchanged", (detail: any) => {
            console.log("trackpadchanged " + JSON.stringify(detail));
        });
    }

    update(data: any, oldData: any): void {
    }

    remove(): void {
    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
    }

}


