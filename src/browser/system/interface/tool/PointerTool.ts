import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {Geometry, Line, LineBasicMaterial, Mesh, Object3D, Raycaster, SphereGeometry, Vector3} from "three";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Tool} from "../Tool";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {Stick} from "../model/Stick";
import {ComponentControllerDefinition} from "../../../AFrame";

export class PointerTool extends AbstractComponentController implements Tool {

    public static DEFINITION = new ComponentControllerDefinition(
        "pointer-tool", {}, false,
        (component: Component, entity: Entity, data: any) => new PointerTool(component, entity, data)
    );

    readonly pointerMaterial = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

    pressed: Set<Button> = new Set();
    time: number = 0;

    raycaster: Raycaster;

    pointerLine = this.constructPointerLine();
    pointerCursor = this.constructPointerCursor();

    pointerDevice: Device | undefined;
    pointerDevicePosition: Vector3 = new Vector3(0,0,0);
    pointerDirection: Vector3 = new Vector3(0,0,0);
    cursorPosition: Vector3 | undefined;

    pointedObject: Object3D | undefined;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        this.raycaster = new Raycaster();
        this.interface.registerTool(this);
    }

    init(): void {
        console.log(this.componentName + " init");
    }


    update(data: any, oldData: any): void {}

    remove(): void {}

    pause(): void {}

    play(): void {}

    tick(time: number, timeDelta: number): void {
        if (this.pointerDevice) {
            this.pointerTick(time, timeDelta);
        }
    }

    buttonDown(device: Device, toolSlot: Slot, button: Button): void {
        if (!this.pressed.has(button)) {
            if (button == Button.TRIGGER && !this.pointerDevice) {
                this.pointerOn(device);
            }
            this.pressed.add(button);
        }
    }

    buttonUp(device: Device, toolSlot: Slot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == Button.TRIGGER && this.pointerDevice) {
                this.pointerOff(device);
            }            this.pressed.delete(button)
        }
    }

    stickTwist(device: Device, toolSlot: Slot, stick: Stick, x: number, y: number): void {

    }

    constructPointerLine(): Object3D {
        var geometry = new Geometry();

        geometry.vertices.push(
            new Vector3( 0, 0, -100 ),
            new Vector3( 0, 0, 0 )
        );

        return new Line(geometry, this.pointerMaterial);
    }

    constructPointerCursor(): Object3D {
        return new Mesh(new SphereGeometry( 0.2, 32, 32 ), this.pointerMaterial );
    }

    pointerOn(device: Device) {
        device.entity.object3D.add(this.pointerLine);
        this.pointerDevice = device;
    }

    pointerOff(device: Device) {
        if (this.cursorPosition) {
            this.removeCursor();
        }

        device.entity.object3D.remove(this.pointerLine);
        this.pointerDevice = undefined;
    }

    pointerTick(time: number, timeDelta: number) {

        this.pointerDevice!!.entity.object3D.getWorldDirection(this.pointerDirection);
        this.pointerDirection.multiplyScalar(-1);
        this.pointerDevice!!.entity.object3D.getWorldPosition(this.pointerDevicePosition);

        this.raycaster!!.near = 0;
        this.raycaster!!.far = 100;
        this.raycaster!!.set(this.pointerDevicePosition, this.pointerDirection);

        const intersects = this.raycaster!!.intersectObjects(this.interface.getCollidables(), true);
        if (intersects.length > 0) {
            if (intersects[0].object === this.pointerCursor) {
                intersects.splice(0, 1);
            }
        }

        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point;
            this.pointerCursor.position.copy(intersectionPoint);
            if (!this.cursorPosition) {
                this.addCursor(intersects[0].object);
            }
            this.cursorPosition = intersectionPoint;
        } else {
            if (this.cursorPosition) {
                this.removeCursor();
            }
        }

    }

    private addCursor(object: Object3D) {
        this.scene.object3D.add(this.pointerCursor);
        this.pointedObject = object;
        console.log("add pointer cursor.");
    }

    private removeCursor() {
        this.scene.object3D.remove(this.pointerCursor);
        console.log("remove pointer cursor.");
        this.pointedObject = undefined;
        this.cursorPosition = undefined;
    }

}


