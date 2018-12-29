import {Scene, System} from "AFrame";
import {AbstractSystemController} from "./AbstractSystemController";
import {SystemControllerDefinition} from "../AFrame";

export class ExampleSystemController extends AbstractSystemController {

    public static DEFINITION = new SystemControllerDefinition(
        "example",
        {},
        (system: System, scene: Scene, data: any) => new ExampleSystemController(system, scene, data)
    );

    constructor(system: System, scene: Scene, data: any) {
        super(system, scene, data);
    }

    init(): void {
        console.log(this.systemName + " system init");
    }

    pause(): void {
        console.log(this.systemName + " system pause");
    }

    play(): void {
        console.log(this.systemName + " system play");
    }

    tick(time: number, timeDelta: number): void {
    }

}


