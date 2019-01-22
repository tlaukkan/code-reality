import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {Component, Entity} from "aframe";
import {DeviceSlot} from "../model/DeviceSlot";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {Stick} from "../model/Stick";
import {ComponentControllerDefinition} from "../../../AFrame";
import {ToolSlot} from "../../../../../lib/src/browser/system/interface/model/ToolSlot";

export class PrimaryControllerDevice extends AbstractComponentController implements Device {

    public static DEFINITION = new ComponentControllerDefinition(
        "primary-controller", {}, false,
        (component: Component, entity: Entity, data: any) => new PrimaryControllerDevice(component, entity, data)
    );

    private controllerName: string = "";
    private axis: Array<number> | undefined;
    private lastStickButton: Button | undefined;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        console.log(this.componentName + " init");

        this.interface.setDevice(DeviceSlot.PRIMARY_HAND, this);

        this.addEventListener("controllerconnected", (detail: any) => {
            this.controllerName = detail.name;
            console.log("controllerconnected " + this.controllerName);
        });

        this.addEventListener("controllerdisconnected", (detail: any) => {
            console.log("controllerdisconnected " + this.controllerName);
        });


        this.addEventListener("triggerup", (detail: any) => {
            this.interface.buttonUp(this, Slot.PRIMARY, Button.TRIGGER);
            console.log("triggerup " + detail);
        });
        this.addEventListener("triggerdown", (detail: any) => {
            this.interface.buttonDown(this, Slot.PRIMARY, Button.TRIGGER);
            console.log("triggerdown " + detail);
        });

        this.addEventListener("gripup", (detail: any) => {
            this.interface.buttonUp(this, Slot.PRIMARY, Button.GRIP);
            console.log("gripup " + detail);
        });
        this.addEventListener("gripdown", (detail: any) => {
            this.interface.buttonDown(this, Slot.PRIMARY, Button.GRIP);
            console.log("gripdown " + detail);
        });

        this.addEventListener("menuup", (detail: any) => {
            this.interface.buttonUp(this, Slot.PRIMARY, Button.MENU);
            console.log("menuup " + detail);
        });
        this.addEventListener("menudown", (detail: any) => {
            this.interface.buttonDown(this, Slot.PRIMARY, Button.MENU);
            console.log("menudown " + detail);
        });


        this.addEventListener("trackpaddown", (detail: any) => {
            console.log("trackpaddown " + detail);
            if (this.axis) {
                const button = this.getStickButton(this.axis[0], this.axis[1]);
                this.interface.buttonDown(this, Slot.PRIMARY_SELECTOR, button);
                this.lastStickButton = button;
                console.log("button down: "+ Button[button]);
            }
        });
        this.addEventListener("trackpadup", (detail: any) => {
            console.log("trackpadup " + detail);
            if (this.axis) {
                if (this.lastStickButton) {
                    const button = this.lastStickButton;
                    this.interface.buttonUp(this, Slot.PRIMARY_SELECTOR, button);
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
            //this.interface.stickTwist(this, Slot.PRIMARY, Stick.PRIMARY, this.axis[1], this.axis[0]);
        });

    }

    getStickButton(x: number, y: number): Button {
        var angle = Math.atan2(y, x) * 180 / Math.PI;
        if (angle >= -45 && angle < 45) {
            return Button.RIGHT;
        } else if (angle >= 45 && angle < 135) {
            return Button.UP;
        } else if (angle >= 135 || angle <= -135) {
            return Button.LEFT;
        } else {
            return Button.DOWN;
        }
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


