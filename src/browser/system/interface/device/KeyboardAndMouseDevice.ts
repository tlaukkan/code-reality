import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {Component, Entity} from "AFrame";
import {DeviceSlot} from "../model/DeviceSlot";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {ComponentControllerDefinition} from "../../../AFrame";

export class KeyboardAndMouseDevice extends AbstractComponentController implements Device {

    public static DEFINITION = new ComponentControllerDefinition(
        "keyboard-and-mouse", {}, false,
        (component: Component, entity: Entity, data: any) => new KeyboardAndMouseDevice(component, entity, data)
    );

    forwardKey: string = 'w';
    backwardKey: string = 's';
    leftKey: string = 'a';
    rightKey: string = 'd';
    jumpKey: string = ' ';

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);

        this.interface.setDevice(DeviceSlot.KEYBOARD_AND_MOUSE, this);
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
                this.interface.buttonDown(this, Slot.PRIMARY, Button.TRIGGER);
            }
            if (e.button == 1) {
                this.interface.buttonDown(this, Slot.PRIMARY, Button.MENU);
            }
            if (e.button == 2) {
                this.interface.buttonDown(this, Slot.PRIMARY, Button.GRIP);
            }
        });

        (this.entity.sceneEl!! as any).addEventListener('mouseup', (e: MouseEvent) => {
            console.log('mouseup: ' + e.button );
            if (e.button == 0) {
                this.interface.buttonUp(this, Slot.PRIMARY, Button.TRIGGER);
            }
            if (e.button == 1) {
                this.interface.buttonUp(this, Slot.PRIMARY, Button.MENU);
            }
            if (e.button == 2) {
                this.interface.buttonUp(this, Slot.PRIMARY, Button.GRIP);
            }
        });

        /*(this.entity.sceneEl!! as any).addEventListener('click', (e: MouseEvent) => {
            console.log('mouse click ' + e.button);
        });

        (this.entity.sceneEl!! as any).addEventListener('wheel', (e: WheelEvent) => {
            console.log('wheel: x=' + e.deltaX + ', y=' + e.deltaY + ', z=' + e.deltaZ);
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

    onKeyDown(key: string) {
        if (key == this.backwardKey) {
            this.interface.buttonDown(this, Slot.MOVEMENT, Button.DOWN);
        }
        if (key == this.forwardKey) {
            this.interface.buttonDown(this, Slot.MOVEMENT, Button.UP);
        }
        if (key == this.leftKey) {
            this.interface.buttonDown(this, Slot.MOVEMENT, Button.LEFT);
        }
        if (key == this.rightKey) {
            this.interface.buttonDown(this, Slot.MOVEMENT, Button.RIGHT);
        }
        if (key == this.jumpKey) {
            this.interface.buttonDown(this, Slot.MOVEMENT, Button.TRIGGER);
        }
    }

    onKeyUp(key: string) {
        if (key == this.backwardKey) {
            this.interface.buttonUp(this, Slot.MOVEMENT, Button.DOWN);
        }
        if (key == this.forwardKey) {
            this.interface.buttonUp(this, Slot.MOVEMENT, Button.UP);
        }
        if (key == this.leftKey) {
            this.interface.buttonUp(this, Slot.MOVEMENT, Button.LEFT);
        }
        if (key == this.rightKey) {
            this.interface.buttonUp(this, Slot.MOVEMENT, Button.RIGHT);
        }
        if (key == this.jumpKey) {
            this.interface.buttonUp(this, Slot.MOVEMENT, Button.TRIGGER);
        }
    }


}


