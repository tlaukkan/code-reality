import { Quaternion, Raycaster} from "three";
import {Component, Entity} from "AFrame";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {ComponentControllerDefinition} from "../../../AFrame";
import {createElement} from "../../../util";
import {PointerTool} from "./PointerTool";

export class AddObjectTool extends PointerTool {

    public static DEFINITION = new ComponentControllerDefinition(
        "add-object-tool", {}, false, (component: Component, entity: Entity, data: any) => new AddObjectTool(component, entity, data)
    );

    entityTemplateScale = 0.5;
    entityTemplate: string = "<a-box/>";
    heldEntity: Entity | undefined;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        this.raycaster = new Raycaster();
    }

    init(): void {
        console.log(this.componentName + " init");
        super.init();
    }

    tick(time: number, timeDelta: number): void {
        super.tick(time, timeDelta);
    }

    buttonDown(device: Device, toolSlot: Slot, button: Button): void {
        if (!this.pressed.has(button)) {
            if (button == Button.GRIP) {
                if (this.pointedObject) {

                } else {
                    if (!this.heldEntity) {
                        this.addEntity(device);
                    }
                }
            }
        }
        super.buttonDown(device, toolSlot, button);
    }

    buttonUp(device: Device, toolSlot: Slot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == Button.GRIP) {
                if (this.pointedObject) {

                } else {
                    if (this.heldEntity) {
                        this.releaseEntity();
                    }
                }
            }
        }
        super.buttonUp(device, toolSlot, button);
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


