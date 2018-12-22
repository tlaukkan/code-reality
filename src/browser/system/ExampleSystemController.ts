import {Component, Entity, System} from "AFrame";
import {AbstractSystemController} from "./AbstractSystemController";

export class ExampleSystemController extends AbstractSystemController {

    constructor(system: System, entity: Entity, data: any) {
        super("example-system", {type: 'string', default: '?'}, false, system, entity, data);
    }

    init(): void {
        console.log(this.systemName + " init: " + JSON.stringify(this.data) + " entity: " + this.entity);
    }

    pause(): void {
        console.log(this.systemName + " pause");
    }

    play(): void {
        console.log(this.systemName + " play");
    }

    tick(time: number, timeDelta: number): void {
    }

}


