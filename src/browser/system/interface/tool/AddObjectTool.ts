import {Geometry, Mesh, Quaternion, Raycaster} from "three";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {ComponentControllerDefinition} from "../../../AFrame";
import {createElement} from "../../../util";
import {PointerTool} from "./PointerTool";
import {snapVector3ToAxisAlignedGrid} from "../../../math/math";
import {SpaceSystemController} from "../../../..";
import uuid = require("uuid");
import {ToolSelectorTool} from "../../../../../lib/src/browser/system/interface/tool/ToolSelectorTool";

export class AddObjectTool extends PointerTool {

    public static DEFINITION = new ComponentControllerDefinition(
        "add-object-tool", {}, false, (component: Component, entity: Entity, data: any) => new AddObjectTool(component, entity, data)
    );

    reviewEntity: Entity | undefined;

    entityTemplateScale = 1;
    entityReviewScale = 0.05;
    entityTemplates: Array<string> = [
        '<a-entity gltf-model="#cube" collidable/>',
        '<a-entity gltf-model="#cube_wood" collidable/>',
        '<a-entity gltf-model="#cube_brick" collidable/>',
        '<a-entity gltf-model="#cube_grass" collidable/>'
    ];
    entityTemplateIndex = 0;
    entityTemplate: string = this.entityTemplates[this.entityTemplateIndex];

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        this.raycaster = new Raycaster();
    }

    init(): void {
        console.log(this.componentName + " init");
        super.init();
    }

    play(): void {
        this.setReviewEntity();
        super.play();
    }



    tick(time: number, timeDelta: number): void {
        super.tick(time, timeDelta);
    }

    buttonDown(device: Device, toolSlot: Slot, button: Button): void {
        if (!this.pressed.has(button)) {
        }
        super.buttonDown(device, toolSlot, button);
    }

    buttonUp(device: Device, toolSlot: Slot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == Button.TRIGGER) {
                this.addEntity(device);
            }

            if (button == Button.UP) {
                this.entityTemplateIndex++;
                if (this.entityTemplateIndex >= this.entityTemplates.length) {
                    this.entityTemplateIndex = 0;
                }
                this.entityTemplate = this.entityTemplates[this.entityTemplateIndex];
                this.setReviewEntity();
            }

            if (button == Button.DOWN) {
                this.entityTemplateIndex--;
               if (this.entityTemplateIndex <= 0) {
                   this.entityTemplateIndex = this.entityTemplates.length - 1;
               }
               this.entityTemplate = this.entityTemplates[this.entityTemplateIndex];
                this.setReviewEntity();
            }

        }
        super.buttonUp(device, toolSlot, button);
    }

    setReviewEntity() {
        const toolSelectorTool = this.interface.getToolAtSlot(Slot.PRIMARY_SELECTOR) as ToolSelectorTool;

        if (this.reviewEntity) {
            toolSelectorTool.entity.removeChild(this.reviewEntity);
        }
        this.reviewEntity = createElement(this.entityTemplate) as Entity;
        this.reviewEntity.setAttribute("scale", this.entityReviewScale + " " + this.entityReviewScale + " " + this.entityReviewScale);
        this.reviewEntity.setAttribute("position", "0 0 -0.1");
        toolSelectorTool.entity.appendChild(this.reviewEntity);
    }

    private addEntity(device: Device) {

        const gridStep = 1;
        const pointedObject = this.pointedObject;
        const pointerPosition = this.pointedPosition;
        //const pointedFaceIndex = this.pointedFaceIndex;

        if (pointedObject && pointerPosition) {
            const pointedObjectPosition = pointedObject.position.clone();
            pointedObject.getWorldPosition(pointedObjectPosition);

            const newPosition = pointerPosition.clone();
            newPosition.sub(pointedObjectPosition);
            newPosition.normalize();
            newPosition.multiplyScalar(gridStep / 2);
            newPosition.add(pointerPosition);

            const snappedPosition = snapVector3ToAxisAlignedGrid(newPosition, gridStep);

            const newEntity = createElement(this.entityTemplate) as Entity;
            newEntity.setAttribute("scale", this.entityTemplateScale + " " + this.entityTemplateScale + " " + this.entityTemplateScale);
            newEntity.setAttribute("position", snappedPosition.x + " " + snappedPosition.y + " " + snappedPosition.z);
            newEntity.setAttribute("oid", uuid.v4().toString());
            if (newEntity.flushToDOM) {
                newEntity.flushToDOM(true);
            }

            this.scene.appendChild(newEntity);

            const spaceSystem = this.getSystemController("space") as SpaceSystemController;
            spaceSystem.saveEntity(newEntity.outerHTML, snappedPosition.x, snappedPosition.y, snappedPosition.z).catch(error => {
                console.error("Error saving entity", error);
            });

        }
    }


}


