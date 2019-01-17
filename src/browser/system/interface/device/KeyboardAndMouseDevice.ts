import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {Component, Entity} from "AFrame";
import {DeviceSlot} from "../model/DeviceSlot";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {ComponentControllerDefinition} from "../../../AFrame";
import {addDocumentEventListener, addEntityEventListener} from "../../../util";

export class KeyboardAndMouseDevice extends AbstractComponentController implements Device {

    public static DEFINITION = new ComponentControllerDefinition(
        "keyboard-and-mouse", {}, false,
        (component: Component, entity: Entity, data: any) => new KeyboardAndMouseDevice(component, entity, data)
    );

    movementForwardKey: string = 'w';
    movementBackwardKey: string = 's';
    movementLeftKey: string = 'a';
    movementRightKey: string = 'd';
    jumpKey: string = ' ';

    rightKey = 'ArrowRight';
    leftKey = 'ArrowLeft';
    upKey = 'ArrowUp';
    downKey = 'ArrowDown';

    pointerLock: boolean = false;


    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);

        this.interface.setDevice(DeviceSlot.KEYBOARD_AND_MOUSE, this);
    }

    init(): void {
        console.log(this.componentName + " init");

        addDocumentEventListener("pointerlockchange", (detail: any) => {
            this.pointerLock = (document as any).pointerLockElement != null;
        });

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            this.onKeyDown(e.key);
        });

        window.addEventListener('keyup', (e: KeyboardEvent) => {
            this.onKeyUp(e.key);
        });

        (this.entity.sceneEl!! as any).addEventListener('mousedown', (e: MouseEvent) => {
            if (!this.pointerLock) {
                return;
            }
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
            if (!this.pointerLock) {
                return;
            }
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
        if (key == this.movementForwardKey) {
            this.interface.buttonDown(this, Slot.WALK, Button.UP);
        }
        if (key == this.movementBackwardKey) {
            this.interface.buttonDown(this, Slot.WALK, Button.DOWN);
        }
        if (key == this.movementLeftKey) {
            this.interface.buttonDown(this, Slot.WALK, Button.LEFT);
        }
        if (key == this.movementRightKey) {
            this.interface.buttonDown(this, Slot.WALK, Button.RIGHT);
        }
        if (key == this.jumpKey) {
            this.interface.buttonDown(this, Slot.WALK, Button.TRIGGER);
        }

        if (key == this.upKey) {
            this.interface.buttonDown(this, Slot.PRIMARY_SELECTOR, Button.UP);
        }
        if (key == this.downKey) {
            this.interface.buttonDown(this, Slot.PRIMARY_SELECTOR, Button.DOWN);
        }
        if (key == this.rightKey) {
            this.interface.buttonDown(this, Slot.PRIMARY_SELECTOR, Button.RIGHT);
        }
        if (key == this.leftKey) {
            this.interface.buttonDown(this, Slot.PRIMARY_SELECTOR, Button.LEFT);
        }

    }

    onKeyUp(key: string) {
        if (key == this.movementForwardKey) {
            this.interface.buttonUp(this, Slot.WALK, Button.UP);
        }
        if (key == this.movementBackwardKey) {
            this.interface.buttonUp(this, Slot.WALK, Button.DOWN);
        }
        if (key == this.movementLeftKey) {
            this.interface.buttonUp(this, Slot.WALK, Button.LEFT);
        }
        if (key == this.movementRightKey) {
            this.interface.buttonUp(this, Slot.WALK, Button.RIGHT);
        }
        if (key == this.jumpKey) {
            this.interface.buttonUp(this, Slot.WALK, Button.TRIGGER);
        }

        if (key == this.upKey) {
            this.interface.buttonUp(this, Slot.PRIMARY_SELECTOR, Button.UP);
        }
        if (key == this.downKey) {
            this.interface.buttonUp(this, Slot.PRIMARY_SELECTOR, Button.DOWN);
        }
        if (key == this.rightKey) {
            this.interface.buttonUp(this, Slot.PRIMARY_SELECTOR, Button.RIGHT);
        }
        if (key == this.leftKey) {
            this.interface.buttonUp(this, Slot.PRIMARY_SELECTOR, Button.LEFT);
        }

    }


}


