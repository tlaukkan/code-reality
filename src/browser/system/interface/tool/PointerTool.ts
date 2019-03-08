import {Face3, Geometry, Line, LineBasicMaterial, Mesh, Object3D, Raycaster, SphereGeometry, Vector3} from "three";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Tool} from "../Tool";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {Stick} from "../model/Stick";
import {raycast} from "../../../three/raycast";
import {AbstractComponentController, ComponentControllerDefinition} from "aframe-typescript-boilerplate";
import {CodeRealityComponentController} from "../../../component/CodeRealityComponentController";

export class PointerTool extends CodeRealityComponentController implements Tool {

    public static DEFINITION = new ComponentControllerDefinition("pointer-tool", {}, false, true, (component: Component, entity: Entity, data: any) => new PointerTool(component, entity, data));

    readonly pointerMaterial = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

    pressed: Set<Button> = new Set();
    time: number = 0;

    raycaster: Raycaster;

    pointerLine = this.constructPointerLine();
    pointerCursor = this.constructPointerCursor();

    pointerDevice: Device | undefined;
    pointerDevicePosition: Vector3 = new Vector3(0,0,0);
    pointerDirection: Vector3 = new Vector3(0,0,0);
    pointedPosition: Vector3 | undefined;

    pointedObject: Object3D | undefined;
    pointedFace: Face3 | undefined;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        this.raycaster = new Raycaster();
        this.interface.registerTool(this);
    }

    init(): void {
        //console.log(this.componentName + " init");
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
        return new Mesh(new SphereGeometry( 0.01, 32, 32 ), this.pointerMaterial );
    }

    pointerOn(device: Device) {
        device.entity.object3D.add(this.pointerLine);
        this.pointerDevice = device;
    }

    pointerOff(device: Device) {
        if (this.pointedPosition) {
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

        //const intersects = this.raycaster!!.intersectObjects(this.interface.getCollidables(), true);
        const intersects = raycast(this.interface.getCollidables(), this.raycaster);

        if (intersects.length > 0) {
            if (intersects[0].object === this.pointerCursor) {
                intersects.splice(0, 1);
            }
        }

        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point;
            //console.log(JSON.stringify(intersects[0]));
            this.pointerCursor.position.copy(intersectionPoint);
            if (!this.pointedPosition) {
                this.addCursor(intersects[0].object);
            }
            this.pointedPosition = intersectionPoint;
            this.pointedObject = intersects[0].object;
            this.pointedFace = (intersects[0] as any).face;
        } else {
            if (this.pointedPosition) {
                this.removeCursor();
            }
        }

    }

    private addCursor(object: Object3D) {
        this.pointerCursor.scale.x = this.interface.getSelfScale();
        this.pointerCursor.scale.y = this.interface.getSelfScale();
        this.pointerCursor.scale.z = this.interface.getSelfScale();
        this.scene.object3D.add(this.pointerCursor);
        //console.log("add pointer cursor.");
    }

    private removeCursor() {
        this.scene.object3D.remove(this.pointerCursor);
        //console.log("remove pointer cursor.");
        this.pointedObject = undefined;
        this.pointedPosition = undefined;
        this.pointedFace = undefined;
    }

}


