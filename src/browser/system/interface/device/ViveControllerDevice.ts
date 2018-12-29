import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {Component, Entity} from "AFrame";
import {DeviceSlot} from "../model/DeviceSlot";
import {Device} from "../Device";
import {ToolSlot} from "../model/ToolSlot";
import {Button} from "../model/Button";
import {Stick} from "../model/Stick";
import {ComponentControllerDefinition} from "../../../AFrame";

export class ViveControllerDevice extends AbstractComponentController implements Device {

    public static DEFINITION = new ComponentControllerDefinition(
        "vive-controller", {
            hand: {type: 'string', default: "right"},
        }, false,
        (component: Component, entity: Entity, data: any) => new ViveControllerDevice(component, entity, data)
    );

    private deviceSlot: DeviceSlot = DeviceSlot.PRIMARY_HAND;
    private toolSlot: ToolSlot = ToolSlot.PRIMARY;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        console.log(this.componentName + " init");

        if (this.data.hand == 'left') {
            this.deviceSlot = DeviceSlot.SECONDARY_HAND;
            this.toolSlot = ToolSlot.SECONDARY;
        }
        this.interfaceSystemController.setDevice(this.deviceSlot, this);

        this.addEventListener("triggerup", (detail: any) => {
            this.interfaceSystemController.buttonUp(this, this.toolSlot, Button.TRIGGER);
            console.log("triggerup " + detail);
        });
        this.addEventListener("triggerdown", (detail: any) => {
            this.interfaceSystemController.buttonDown(this, this.toolSlot, Button.TRIGGER);
            console.log("triggerdown " + detail);
        });

        this.addEventListener("gripup", (detail: any) => {
            this.interfaceSystemController.buttonUp(this, this.toolSlot, Button.GRIP);
            console.log("gripup " + detail);
        });
        this.addEventListener("gripdown", (detail: any) => {
            this.interfaceSystemController.buttonDown(this, this.toolSlot, Button.GRIP);
            console.log("gripdown " + detail);
        });

        this.addEventListener("menuup", (detail: any) => {
            this.interfaceSystemController.buttonUp(this, this.toolSlot, Button.MENU);
            console.log("menuup " + detail);
        });
        this.addEventListener("menudown", (detail: any) => {
            this.interfaceSystemController.buttonDown(this, this.toolSlot, Button.MENU);
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
            console.log(this.toolSlot + " axismove " + axis);
            if (this.deviceSlot == DeviceSlot.PRIMARY_HAND) {
                this.interfaceSystemController.stickTwist(this, ToolSlot.SECONDARY, Stick.ROTATE, axis[1], axis[0]);
            } else {
                this.interfaceSystemController.stickTwist(this, ToolSlot.SECONDARY, Stick.TRANSLATE, axis[1], axis[0]);
            }
        });
        /*this.addEventListener("trackpadchanged", (detail: any) => {
            console.log("trackpadchanged " + JSON.stringify(detail));
        });*/
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


