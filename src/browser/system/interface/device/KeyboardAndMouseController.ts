import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {Component, Entity} from "AFrame";
import {DeviceSlot} from "../model/DeviceSlot";
import {Device} from "../Device";
import {ToolSlot} from "../model/ToolSlot";
import {Button} from "../model/Button";

export class KeyboardAndMouseController extends AbstractComponentController implements Device {

    forwardKey: string = 'w';
    backwardKey: string = 's';
    leftKey: string = 'a';
    rightKey: string = 'd';
    jumpKey: string = ' ';

    constructor(component: Component, entity: Entity, data: any) {
        super("keyboard-and-mouse", {}, false, component, entity, data);

        if (!component) {
            return;
        }
        this.interfaceSystemController.setDevice(DeviceSlot.KEYBOARD_AND_MOUSE, this);
    }

    init(): void {
        console.log(this.componentName + " init");

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            this.onKeyDown(e.key);
        });

        window.addEventListener('keyup', (e: KeyboardEvent) => {
            this.onKeyUp(e.key);
        });

        (this.entity.sceneEl!! as any).addEventListener('mousedown', (e: MouseEvent) => {
            console.log('mousedown: ' + e.button );
            if (e.button == 0) {
                this.interfaceSystemController.buttonDown(this, ToolSlot.PRIMARY, Button.TRIGGER);
            }
            if (e.button == 1) {
                this.interfaceSystemController.buttonDown(this, ToolSlot.PRIMARY, Button.MENU);
            }
            if (e.button == 2) {
                this.interfaceSystemController.buttonDown(this, ToolSlot.PRIMARY, Button.GRIP);
            }
        });

        (this.entity.sceneEl!! as any).addEventListener('mouseup', (e: MouseEvent) => {
            console.log('mouseup: ' + e.button );
            if (e.button == 0) {
                this.interfaceSystemController.buttonUp(this, ToolSlot.PRIMARY, Button.TRIGGER);
            }
            if (e.button == 1) {
                this.interfaceSystemController.buttonUp(this, ToolSlot.PRIMARY, Button.MENU);
            }
            if (e.button == 2) {
                this.interfaceSystemController.buttonUp(this, ToolSlot.PRIMARY, Button.GRIP);
            }
        });

        (this.entity.sceneEl!! as any).addEventListener('click', (e: MouseEvent) => {
            console.log('mouse click ' + e.button);
        });

        (this.entity.sceneEl!! as any).addEventListener('wheel', (e: WheelEvent) => {
            console.log('wheel: x=' + e.deltaX + ', y=' + e.deltaY + ', z=' + e.deltaZ);
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

    onKeyDown(key: string) {
        if (key == this.backwardKey) {
            this.interfaceSystemController.buttonDown(this, ToolSlot.SECONDARY, Button.DOWN);
        }
        if (key == this.forwardKey) {
            this.interfaceSystemController.buttonDown(this, ToolSlot.SECONDARY, Button.UP);
        }
        if (key == this.leftKey) {
            this.interfaceSystemController.buttonDown(this, ToolSlot.SECONDARY, Button.LEFT);
        }
        if (key == this.rightKey) {
            this.interfaceSystemController.buttonDown(this, ToolSlot.SECONDARY, Button.RIGHT);
        }
        if (key == this.jumpKey) {
            this.interfaceSystemController.buttonDown(this, ToolSlot.SECONDARY, Button.TRIGGER);
        }
    }

    onKeyUp(key: string) {
        if (key == this.backwardKey) {
            this.interfaceSystemController.buttonUp(this, ToolSlot.SECONDARY, Button.DOWN);
        }
        if (key == this.forwardKey) {
            this.interfaceSystemController.buttonUp(this, ToolSlot.SECONDARY, Button.UP);
        }
        if (key == this.leftKey) {
            this.interfaceSystemController.buttonUp(this, ToolSlot.SECONDARY, Button.LEFT);
        }
        if (key == this.rightKey) {
            this.interfaceSystemController.buttonUp(this, ToolSlot.SECONDARY, Button.RIGHT);
        }
        if (key == this.jumpKey) {
            this.interfaceSystemController.buttonUp(this, ToolSlot.SECONDARY, Button.TRIGGER);
        }
    }


}


