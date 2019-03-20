import {Component, Entity, Scene, System} from "aframe";
import {AbstractSystemController, createElement, SystemControllerDefinition} from "aframe-typescript-boilerplate";
import {createElements} from "../../util";
import {InterfaceSystemController} from "../../..";
import {Quaternion, Vector3} from "three";

export class UiSystemController extends AbstractSystemController {

    public static DEFINITION = new SystemControllerDefinition(
        "ui", {},
        (system: System, scene: Scene, data: any) => new UiSystemController(system, scene, data)
    );

    uiFrame: Entity = undefined as any;
    viewStack: Array<Element> = new Array<Element>();

    constructor(system: System, scene: Scene, data: any) {
        super(system, scene, data);
    }

    init(): void {
        this.uiFrame = createElement("<a-entity id='ui-frame'/>") as Entity;
        this.scene.appendChild(this.uiFrame);
    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
    }

    show() {
        this.uiFrame.setAttribute("visible", true);

        const interfaceSystem = this.getSystemController("interface") as InterfaceSystemController;
        const cameraPosition = interfaceSystem.cameraPosition;
        const cameraDirection = interfaceSystem.cameraDirection;

        const uiPosition = new Vector3(cameraDirection.x, 0, cameraDirection.z);
        uiPosition.multiplyScalar(0.8);
        uiPosition.add(cameraPosition);

        const uiObject = this.uiFrame.object3D;
        const direction = new Vector3().copy(uiPosition).sub(cameraPosition).normalize();

        direction.y = 0;
        direction.normalize();


        const uiNormal = uiObject.localToWorld(new Vector3(0, 0, -1)).sub(uiObject.localToWorld(new Vector3(0, 0, 0))).normalize();
        uiNormal.y = 0;
        uiNormal.normalize();

        const quaternion = new Quaternion(); // create one and reuse it

        quaternion.setFromUnitVectors(uiNormal, direction);

        uiObject.position.copy(uiPosition);
        uiObject.quaternion.copy(quaternion.multiply(uiObject.quaternion));
    }

    hide() {
        this.uiFrame.setAttribute("visible", false);
    }

    pushView(viewTemplate: string) {

        const first = this.viewStack.length == 0;

        if (this.viewStack.length > 0) {
            const currentView = this.viewStack[this.viewStack.length - 1];
            this.uiFrame.removeChild(currentView);
        }

        const newView = createElement(viewTemplate);
        this.viewStack.push(newView);
        this.uiFrame.appendChild(newView);
        
        if (first) {
            this.show();
        }
    }

    popView() {
        if (this.viewStack.length > 0) {
            const currentView = this.viewStack.pop()!!;
            this.uiFrame.removeChild(currentView);
        }

        if (this.viewStack.length > 0) {
            const currentView = this.viewStack[this.viewStack.length - 1];
            this.uiFrame.appendChild(currentView);
        }

        const last = this.viewStack.length == 0;

        if (last) {
            this.hide();
        }
    }
}

