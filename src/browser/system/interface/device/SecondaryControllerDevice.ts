import {Component, Entity} from "aframe";
import {DeviceSlot} from "../model/DeviceSlot";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {Stick} from "../model/Stick";
import {AbstractControllerDevice} from "./AbstractControllerDevice";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate";

export class SecondaryControllerDevice extends AbstractControllerDevice implements Device {

    public static DEFINITION = new ComponentControllerDefinition("secondary-controller", {}, false, false, (component: Component, entity: Entity, data: any) => new SecondaryControllerDevice(component, entity, data));


    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        //console.log(this.componentName + " init");

        this.interface.setDevice(DeviceSlot.SECONDARY_HAND, this);

        this.addEventListener("controllerconnected", (detail: any) => {
            this.controllerName = detail.name;
            console.log("controllerconnected " + this.controllerName);
        });

        this.addEventListener("controllerdisconnected", (detail: any) => {
            console.log("controllerdisconnected " + this.controllerName);
        });


        this.addEventListener("triggerup", (detail: any) => {
            this.interface.buttonUp(this, Slot.SECONDARY, Button.TRIGGER);
            console.log("triggerup " + detail);
        });
        this.addEventListener("triggerdown", (detail: any) => {
            this.interface.buttonDown(this, Slot.SECONDARY, Button.TRIGGER);
            console.log("triggerdown " + detail);
        });

        this.addEventListener("gripup", (detail: any) => {
            this.interface.buttonUp(this, Slot.SECONDARY, Button.GRIP);
            console.log("gripup " + detail);
        });
        this.addEventListener("gripdown", (detail: any) => {
            this.interface.buttonDown(this, Slot.SECONDARY, Button.GRIP);
            console.log("gripdown " + detail);
        });

        this.addEventListener("menuup", (detail: any) => {
            this.interface.buttonUp(this, Slot.SECONDARY, Button.MENU);
            console.log("menuup " + detail);
        });
        this.addEventListener("menudown", (detail: any) => {
            this.interface.buttonDown(this, Slot.SECONDARY, Button.MENU);
            console.log("menudown " + detail);
        });


        this.addEventListener("trackpaddown", (detail: any) => {
            console.log("trackpaddown " + detail);
            if (this.axis) {
                const button = this.getStickButton(this.axis[0], this.axis[1]);
                this.interface.buttonDown(this, Slot.SECONDARY, button);
                this.lastStickButton = button;
                console.log("button down: "+ Button[button]);
            }
        });
        this.addEventListener("trackpadup", (detail: any) => {
            console.log("trackpadup " + detail);
            if (this.axis) {
                if (this.lastStickButton) {
                    const button = this.lastStickButton;
                    this.interface.buttonUp(this, Slot.SECONDARY, button);
                    console.log("button up: " + Button[button]);
                }
            }
        });


        this.addEventListener("axismove", (detail:  any) => {
            const axis: Array<number> = detail.axis;
            this.axis = Object.assign([], axis);
            if (this.controllerName==="oculus-go-controls") {
                this.axis[1] = -1 * this.axis[1];
            }
            //console.log(this.toolSlot + " axismove " + axis);
            this.interface.stickTwist(this, Slot.SECONDARY, Stick.SECONDARY, this.axis[1], this.axis[0]);
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


