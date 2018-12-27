import {Component, Entity, Scene, System} from "AFrame";
import {AbstractSystemController} from "../AbstractSystemController";
import {InterfaceController} from "./InterfaceController";

export class InterfaceSystemController extends AbstractSystemController {

    private interfaceEntity: Entity | undefined;
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
    }

    setInterfaceController(interfaceController: InterfaceController) {
        this.interfaceController = interfaceController;
    }
}


