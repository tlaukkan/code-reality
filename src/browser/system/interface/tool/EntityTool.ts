import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {Geometry, Line, LineBasicMaterial, Object3D, Raycaster, Vector3} from "three";
import {Component, Entity} from "AFrame";
import {Device} from "../Device";
import {Tool} from "../Tool";
import {ToolSlot} from "../model/ToolSlot";
import {Button} from "../model/Button";
import {Stick} from "../model/Stick";
import {ComponentControllerDefinition} from "../../../AFrame";

export class EntityTool extends AbstractComponentController implements Tool {

    public static DEFINITION = new ComponentControllerDefinition(
        "entity-tool", {}, false,
        (component: Component, entity: Entity, data: any) => new EntityTool(component, entity, data)
    );

    pressed: Set<Button> = new Set();
    time: number = 0;

    pointerLine = this.constructLaserPointerLine();
    raycaster: Raycaster;

    pointerDevice: Device | undefined;
    pointerPosition: Vector3 = new Vector3(0,0,0);
    pointerDirection: Vector3 = new Vector3(0,0,0);

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        this.interface.setTool(ToolSlot.PRIMARY, this);
        this.raycaster = new Raycaster();
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

    buttonDown(device: Device, toolSlot: ToolSlot, button: Button): void {
        if (!this.pressed.has(button)) {
            if (button == Button.TRIGGER && !this.pointerDevice) {
                this.pointerOn(device);
            }
            this.pressed.add(button);
        }
    }

    buttonUp(device: Device, toolSlot: ToolSlot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == Button.TRIGGER && this.pointerDevice) {
                this.pointerOff(device);
            }
            this.pressed.delete(button)
        }
    }

    stickTwist(device: Device, toolSlot: ToolSlot, stick: Stick, x: number, y: number): void {

    }

    constructLaserPointerLine(): Object3D {
        var material = new LineBasicMaterial({
            color: 0xffffff, transparent: true, opacity: 0.5
        });

        var geometry = new Geometry();
        geometry.vertices.push(
            new Vector3( 0, 0, -100 ),
            new Vector3( 0, 0, 0 )
        );

        return new Line( geometry, material );
    }

    pointerOn(device: Device) {
        device.entity.object3D.add(this.pointerLine);
        this.pointerDevice = device;
    }

    pointerOff(device: Device) {
        device.entity.object3D.remove(this.pointerLine);
        this.pointerDevice = undefined;
    }

    pointerTick(time: number, timeDelta: number) {

        this.pointerDevice!!.entity.object3D.getWorldDirection(this.pointerDirection);
        this.pointerDirection.multiplyScalar(-1);
        this.pointerDevice!!.entity.object3D.getWorldPosition(this.pointerPosition);

        this.raycaster!!.near = 0;
        this.raycaster!!.far = 100;
        this.raycaster!!.set(this.pointerDirection, this.pointerPosition);
        var intersects = this.raycaster!!.intersectObjects(this.interface.getCollidables());

        //console.log(this.pointerDirection);
        //console.log(this.pointerPosition);
        //console.log(this.interface.getCollidables().length);

        if (intersects.length > 0) {
            console.log("hep");
            //return intersects[0].distance;
        }

    }

}


