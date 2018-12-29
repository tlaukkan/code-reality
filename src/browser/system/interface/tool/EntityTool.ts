import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {
    Euler,
    Geometry,
    Line,
    LineBasicMaterial, Mesh,
    MeshBasicMaterial,
    Object3D, Quaternion,
    Raycaster,
    SphereGeometry, Vector,
    Vector3,
    Math
} from "three";
import {Component, Entity} from "AFrame";
import {Device} from "../Device";
import {Tool} from "../Tool";
import {ToolSlot} from "../model/ToolSlot";
import {Button} from "../model/Button";
import {Stick} from "../model/Stick";
import {ComponentControllerDefinition} from "../../../AFrame";
import {createElement} from "../../../util";

export class EntityTool extends AbstractComponentController implements Tool {

    public static DEFINITION = new ComponentControllerDefinition(
        "entity-tool", {}, false,
        (component: Component, entity: Entity, data: any) => new EntityTool(component, entity, data)
    );

    readonly pointerMaterial = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

    pressed: Set<Button> = new Set();
    time: number = 0;

    pointerLine = this.constructPointerLine();
    pointerCursor = this.constructPointerCursor();
    raycaster: Raycaster;

    pointerDevice: Device | undefined;
    pointerPosition: Vector3 = new Vector3(0,0,0);
    pointerDirection: Vector3 = new Vector3(0,0,0);
    pointerHoverCursorPoint: Vector3 | undefined;


    entityTemplateScale = 0.5;
    entityTemplate: string = "<a-box/>";
    hoveredObject: Object3D | undefined;
    heldEntity: Entity | undefined;

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
            if (button == Button.GRIP) {
                if (this.hoveredObject) {

                } else {
                    if (!this.heldEntity) {
                        this.addEntity(device);
                    }
                }
            }
            this.pressed.add(button);
        }
    }

    buttonUp(device: Device, toolSlot: ToolSlot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == Button.TRIGGER && this.pointerDevice) {
                this.pointerOff(device);
            }
            if (button == Button.GRIP) {
                if (this.hoveredObject) {

                } else {
                    if (this.heldEntity) {
                        this.releaseEntity();
                    }
                }
            }
            this.pressed.delete(button)
        }
    }

    stickTwist(device: Device, toolSlot: ToolSlot, stick: Stick, x: number, y: number): void {

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
        if (this.pointerHoverCursorPoint) {
            this.removePointerHoverCursor();
        }

        device.entity.object3D.remove(this.pointerLine);
        this.pointerDevice = undefined;
    }

    pointerTick(time: number, timeDelta: number) {

        this.pointerDevice!!.entity.object3D.getWorldDirection(this.pointerDirection);
        this.pointerDirection.multiplyScalar(-1);
        this.pointerDevice!!.entity.object3D.getWorldPosition(this.pointerPosition);

        this.raycaster!!.near = 0;
        this.raycaster!!.far = 100;
        this.raycaster!!.set(this.pointerPosition, this.pointerDirection);
        var intersects = this.raycaster!!.intersectObjects(this.interface.getCollidables(), true);

        if (intersects.length > 0) {
            if (intersects[0].object === this.pointerCursor) {
                intersects.splice(0, 1);
            }
        }

        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point;
            this.pointerCursor.position.copy(intersectionPoint);
            if (!this.pointerHoverCursorPoint) {
                this.addPointerHoverCursor(intersects[0].object);
            }
            this.pointerHoverCursorPoint = intersectionPoint;
        } else {
            if (this.pointerHoverCursorPoint) {
                this.removePointerHoverCursor();
            }
        }

    }

    private addPointerHoverCursor(object: Object3D) {
        this.scene.object3D.add(this.pointerCursor);
        this.hoveredObject = object;
        console.log("add pointer cursor.");
    }

    private removePointerHoverCursor() {
        this.scene.object3D.remove(this.pointerCursor);
        console.log("remove pointer cursor.");
        this.hoveredObject = undefined;
        this.pointerHoverCursorPoint = undefined;
    }

    private addEntity(device: Device) {
        console.log("add object");
        this.heldEntity = createElement(this.entityTemplate) as Entity;
        this.heldEntity.setAttribute("scale", this.entityTemplateScale + " " + this.entityTemplateScale + " " + this.entityTemplateScale);
        this.heldEntity.setAttribute("position", "0 0 -" + this.entityTemplateScale * 2);
        device.entity.appendChild(this.heldEntity);
    }

    private releaseEntity() {

        // Extract entity world position
        //const entityPosition = new Vector3();
        const entityPosition = (this.heldEntity!!.object3D as any).getWorldPosition();
        const entityQuaternion = new Quaternion();
        this.heldEntity!!.object3D.getWorldQuaternion(entityQuaternion);
        //var entityRotation = (this.heldEntity!!.object3D as any).getWorldRotation();


        //(this.heldEntity!! as any).flushToDom();
        // Extract entity HTML description.

        this.heldEntity!!.flushToDOM();
        const entityHtml = this.heldEntity!!.outerHTML;

        // Remove entity from current parent.
        this.heldEntity!!.parentElement!!.removeChild(this.heldEntity!!);



        // Create new copy of entity
        this.heldEntity = createElement(entityHtml) as Entity;

        // Set the world position and rotation.
        this.heldEntity!!.setAttribute("position", entityPosition.x + " " + entityPosition.y + " " + entityPosition.z);
        this.heldEntity!!.setAttribute("quaternion", entityQuaternion.x + " " + entityQuaternion.y + " " + entityQuaternion.z + " " + entityQuaternion.w);
        /*this.heldEntity!!.setAttribute("rotation",
            Math.radToDeg(entityRotation.x) + " " +
            Math.radToDeg(entityRotation.y) + " " +
            Math.radToDeg(entityRotation.z));*/
        this.scene.appendChild(this.heldEntity!!);

        // Add entity to scene.
        //this.heldEntity!!.setAttribute("position", entityPosition);
        //this.heldEntity!!.object3D.position.copy(entityPosition);
        //this.heldEntity!!.object3D.rotation.copy(entityRotation);
        //this.heldEntity!!.parentElement!!.removeChild(this.heldEntity!!);
        //this.scene.appendChild(this.heldEntity!!);

        //this.heldEntity!!.object3D.position.copy(entityPosition);
        //this.heldEntity!!.object3D.rotation.copy(entityRotation);
        //console.log(entityPosition);
        //this.heldEntity!!.object3D.position.copy(entityPosition);
        //this.heldEntity!!.flushToDOM();

        this.heldEntity = undefined;
    }

}


