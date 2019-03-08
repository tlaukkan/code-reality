import {Raycaster, Vector3} from "three";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {PointerTool} from "./PointerTool";
import {snapVector3ToAxisAlignedGrid} from "../../../math/math";
import {SpaceSystemController} from "../../../..";
import {ToolSelectorTool} from "./ToolSelectorTool";
import {createElement, getEntity, ComponentControllerDefinition} from "aframe-typescript-boilerplate";


export class AddObjectTool extends PointerTool {

    public static DEFINITION = new ComponentControllerDefinition("add-object-tool", {}, false, true, (component: Component, entity: Entity, data: any) => new AddObjectTool(component, entity, data));

    reviewEntity: Entity | undefined;

    entityTemplateScale = 1;
    entityReviewScale = 0.05;
    entityTemplates: Array<string> = [
        '<a-entity model="#cube_wood" collidable/>',
        '<a-entity model="#cube_brick" collidable/>',
        '<a-entity model="#cube_grass" collidable/>',
        '<a-entity model="#cube_sand" collidable/>',
        '<a-entity model="#cube_marble" collidable/>',
        '<a-entity model="#cube_stone" collidable/>',
        '<a-entity model="#slab_sand" collidable/>',
        '<a-entity model="#slab_marble" collidable/>',
        '<a-entity model="#slab_stone" collidable/>'
    ];
    entityTemplateIndex = 0;
    entityTemplate: string = this.entityTemplates[this.entityTemplateIndex];

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        this.raycaster = new Raycaster();
    }

    init(): void {
        //console.log(this.componentName + " init");
        super.init();
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
                this.addEntityFromTemplate();
            }

            if (button == Button.UP) {
                if (this.pressed.has(Button.TRIGGER)) {
                    this.cloneEntity();
                } else {
                    this.entityTemplateIndex++;
                    if (this.entityTemplateIndex >= this.entityTemplates.length) {
                        this.entityTemplateIndex = 0;
                    }
                    this.entityTemplate = this.entityTemplates[this.entityTemplateIndex];
                    this.setReviewEntity();
                }
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
        this.reviewEntity.setAttribute("rotation", "60 0 0");
        this.reviewEntity.setAttribute("position", "0 0 -0.1");
        toolSelectorTool.entity.appendChild(this.reviewEntity);
    }

    private cloneEntity() {

        //console.log("clone entity.");
        const gridStep = 1;
        const pointedObject = this.pointedObject;
        const pointerPosition = this.pointedPosition;
        const pointedFace = this.pointedFace;

        if (pointedObject && pointerPosition && pointedFace) {

            const entity = getEntity(pointedObject)!!;
            const entityXml = entity.outerHTML;

            const currentOrientation = entity.object3D.quaternion.clone();
            const currentScale = entity.object3D.scale;

            const tempEntity = createElement(entityXml) as Entity;
            tempEntity.setAttribute("quaternion", currentOrientation.x + " " + currentOrientation.y + " " + currentOrientation.z + " " +currentOrientation.w);
            this.recursiveClearSidAndServer(tempEntity);
            //const pointedObjectPosition = pointedObject.position.clone();
            //pointedObject.getWorldPosition(pointedObjectPosition);

            const template = tempEntity.outerHTML;
            const templateScale = pointedObject.scale.x;
            const entityPosition = pointedObject.localToWorld(pointedObject.position.clone());

            const normal = pointedObject.localToWorld(pointedFace.normal.clone()).sub(pointedObject.localToWorld(pointedObject.position.clone()));

            const newPosition = entityPosition.add(normal.multiplyScalar(templateScale));

            const spaceSystem = this.getSystemController("space") as SpaceSystemController;
            spaceSystem.addEntity(template, newPosition, currentScale);

        }
    }

    public addEntityFromXml(xml: string) {

        const gridStep = 1;
        const pointedObject = this.pointedObject;
        const pointerPosition = this.pointedPosition;
        const pointedFace = this.pointedFace;

        if (pointedObject && pointerPosition && pointedFace) {

            const entityXml = xml;

            const tempEntity = createElement(entityXml) as Entity;
            this.recursiveClearSidAndServer(tempEntity);

            const template = tempEntity.outerHTML;
            const templateScale = this.interface.getSelfScale() * this.entityTemplateScale;

            const entityPosition = pointerPosition.clone();

            const normal = pointedObject.localToWorld(pointedFace.normal.clone()).sub(pointedObject.localToWorld(pointedObject.position.clone()));

            const newPosition = snapVector3ToAxisAlignedGrid(entityPosition.add(normal.multiplyScalar(this.interface.getSelfScale() * gridStep / 2)), this.interface.getSelfScale() * gridStep);

            const spaceSystem = this.getSystemController("space") as SpaceSystemController;
            spaceSystem.addEntity(template, newPosition, new Vector3(templateScale, templateScale, templateScale));

        }
    }

    private addEntityFromTemplate() {

        const gridStep = 1;
        const pointedObject = this.pointedObject;
        const pointerPosition = this.pointedPosition;
        const pointedFace = this.pointedFace;

        if (pointedObject && pointerPosition && pointedFace) {

            //const pointedObjectPosition = pointedObject.position.clone();
            //pointedObject.getWorldPosition(pointedObjectPosition);

            const template = this.entityTemplate;
            const templateScale = this.interface.getSelfScale() * this.entityTemplateScale;

            const entityPosition = pointerPosition.clone();

            const normal = pointedObject.localToWorld(pointedFace.normal.clone()).sub(pointedObject.localToWorld(pointedObject.position.clone()));

            const newPosition = snapVector3ToAxisAlignedGrid(entityPosition.add(normal.multiplyScalar(this.interface.getSelfScale() * gridStep / 2)), this.interface.getSelfScale() * gridStep);

            const spaceSystem = this.getSystemController("space") as SpaceSystemController;
            spaceSystem.addEntity(template, newPosition, new Vector3(templateScale, templateScale, templateScale));

        }
    }

    private recursiveClearSidAndServer(entity: Entity) {
        entity.removeAttribute("sid");
        entity.removeAttribute("server");
        if (entity.children && entity.children.length > 0) {
            for (const child of entity.children) {
                this.recursiveClearSidAndServer(child as Entity);
            }
        }
    }
}


