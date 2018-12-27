import {Component, Entity, Scene, System} from "AFrame";
import {AbstractSystemController} from "../AbstractSystemController";
import {InterfaceController} from "./InterfaceController";

export class InterfaceSystemController extends AbstractSystemController {

    private interfaceEntity: Entity | undefined;
    private cameraEntity: Entity | undefined;
    private interfaceController: InterfaceController | undefined;

    constructor(system: System, scene: Scene, data: any) {
        super("interface", {}, false, system, scene, data);
    }

    init(): void {
        console.log(this.systemName + " system init.");
    }

    pause(): void {
        console.log(this.systemName + " system pause");
    }

    play(): void {
        console.log(this.systemName + " system play");
    }

    tick(time: number, timeDelta: number): void {
    }

    setInterfaceEntity(interfaceEntity: Entity) {
        this.interfaceEntity = interfaceEntity;
        console.log("interface entity set.");
        this.cameraEntity = this.interfaceEntity!!.querySelector('[camera]') as Entity;
        if (!this.cameraEntity) {
            console.error("No camera was found under interface entity.");
        } else {
            console.log("camera entity set.");
        }
    }

    setInterfaceController(interfaceController: InterfaceController) {
        this.interfaceController = interfaceController;
    }
}


