import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {Component, Entity} from "AFrame";
import {DeviceSlot} from "../model/DeviceSlot";
import {Device} from "../Device";
import {ToolSlot} from "../model/ToolSlot";
import {Button} from "../model/Button";
import {Stick} from "../model/Stick";
import {ComponentControllerDefinition} from "../../../AFrame";

export class VrControllerDevice extends AbstractComponentController implements Device {

    public static DEFINITION = new ComponentControllerDefinition(
        "vr-controller", {
            hand: {type: 'string', default: "right"},
        }, false,
        (component: Component, entity: Entity, data: any) => new VrControllerDevice(component, entity, data)
    );

    private controllerName: string = "";
    private deviceSlot: DeviceSlot = DeviceSlot.PRIMARY_HAND;
    private toolSlot: ToolSlot = ToolSlot.PRIMARY;
    private axis: Array<number> | undefined;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        console.log(this.componentName + " init");

        if (this.data.hand == 'left') {
            this.deviceSlot = DeviceSlot.SECONDARY_HAND;
            this.toolSlot = ToolSlot.SECONDARY;
        }
        this.interface.setDevice(this.deviceSlot, this);

        this.addEventListener("controllerconnected", (detail: any) => {
            this.interface.buttonUp(this, this.toolSlot, Button.TRIGGER);
            this.controllerName = detail.name;
            console.log("controllerconnected " + this.controllerName);
            //console.log(detail);
        });

        this.addEventListener("controllerdisconnected", (detail: any) => {
            this.interface.buttonUp(this, this.toolSlot, Button.TRIGGER);
            console.log("controllerdisconnected " + this.controllerName);
            //console.log(detail);
        });


        this.addEventListener("triggerup", (detail: any) => {
            this.interface.buttonUp(this, this.toolSlot, Button.TRIGGER);
            console.log("triggerup " + detail);
        });
        this.addEventListener("triggerdown", (detail: any) => {
            this.interface.buttonDown(this, this.toolSlot, Button.TRIGGER);
            console.log("triggerdown " + detail);
        });

        this.addEventListener("gripup", (detail: any) => {
            this.interface.buttonUp(this, this.toolSlot, Button.GRIP);
            console.log("gripup " + detail);
        });
        this.addEventListener("gripdown", (detail: any) => {
            this.interface.buttonDown(this, this.toolSlot, Button.GRIP);
            console.log("gripdown " + detail);
        });

        this.addEventListener("menuup", (detail: any) => {
            this.interface.buttonUp(this, this.toolSlot, Button.MENU);
            console.log("menuup " + detail);
        });
        this.addEventListener("menudown", (detail: any) => {
            this.interface.buttonDown(this, this.toolSlot, Button.MENU);
            console.log("menudown " + detail);
        });


        this.addEventListener("trackpaddown", (detail: any) => {
            console.log("trackpaddown " + detail);
            if (this.axis) {
                const button = this.getStickButton(this.axis[0], this.axis[1]);
                if (this.controllerName==="vive-controls" || this.controllerName==="rift-controls") {
                    this.interface.buttonDown(this, this.toolSlot, button);
                } else {
                    this.interface.buttonDown(this, ToolSlot.SECONDARY, button);
                }
                console.log("button down: "+ Button[button]);
            }
        });
        this.addEventListener("trackpadup", (detail: any) => {
            console.log("trackpadup " + detail);
            if (this.axis) {
                const button = this.getStickButton(this.axis[0], this.axis[1]);
                if (this.controllerName==="vive-controls" || this.controllerName==="rift-controls") {
                    this.interface.buttonUp(this, this.toolSlot, button);
                } else {
                    this.interface.buttonUp(this, ToolSlot.SECONDARY, button);
                }
                console.log("button up: "+ Button[button]);
            }
        });


        this.addEventListener("axismove", (detail:  any) => {
            const axis: Array<number> = detail.axis;
            this.axis = Object.assign([], axis);
            if (this.controllerName==="oculus-go-controls") {
                this.axis[1] = -1 * this.axis[1];
            }
            //console.log(this.toolSlot + " axismove " + axis);
            if (this.controllerName==="vive-controls" || this.controllerName==="rift-controls") {
                if (this.deviceSlot == DeviceSlot.PRIMARY_HAND) {
                    this.interface.stickTwist(this, ToolSlot.SECONDARY, Stick.ROTATE, this.axis[1], this.axis[0]);
                } else {
                    this.interface.stickTwist(this, ToolSlot.SECONDARY, Stick.TRANSLATE, this.axis[1], this.axis[0]);
                }
            } else {
                //this.interface.stickTwist(this, ToolSlot.SECONDARY, Stick.TRANSLATE, this.axis[1], this.axis[0]);
            }
        });

        /*this.addEventListener("touchstart", (detail: any) => {
            console.log("touchstart " + JSON.stringify(detail));
        });
        this.addEventListener("touchend", (detail: any) => {
            console.log("touchend " + JSON.stringify(detail));
        });*/



        /*this.addEventListener("trackpadchanged", (detail: any) => {
            console.log("trackpadchanged " + JSON.stringify(detail));
        });*/
    }

    getStickButton(x: number, y: number): Button {
        var angle = Math.atan2(y, x) * 180 / Math.PI;
        if (angle >= -45 && angle < 45) {
            if (this.controllerName === "vive-controls" || this.controllerName === "rift-controls") {
                return Button.STICK_RIGHT;
            } else {
                return Button.RIGHT;
            }
        } else if (angle >= 45 && angle < 135) {
            if (this.controllerName === "vive-controls" || this.controllerName === "rift-controls") {
                return Button.STICK_UP;
            } else {
                return Button.UP;
            }
        } else if (angle >= 135 || angle <= -135) {
            if (this.controllerName === "vive-controls" || this.controllerName === "rift-controls") {
                return Button.STICK_LEFT;
            } else {
                return Button.LEFT;
            }
        } else {
            if (this.controllerName === "vive-controls" || this.controllerName === "rift-controls") {
                return Button.STICK_DOWN;
            } else {
                return Button.DOWN;
            }
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


