import {SystemController} from "./SystemController";
import {Scene, System} from "aframe";

/**
 * Abstract base class for system controller implementations.
 */
export abstract class AbstractSystemController implements SystemController {
    readonly systemName: string;
    readonly scene: Scene;
    data: any;
    readonly system: System;

    constructor(system: System, entity: Scene, data: any) {
        this.systemName = (system as any).name;
        this.scene = entity;
        this.data = data;
        this.system = system;
    }

    abstract init(): void;

    abstract pause(): void;

    abstract play(): void;

    abstract tick(time: number, timeDelta: number): void;

    getSystemController<C extends SystemController>(systemName: string): C {
        const system = this.scene.systems[systemName];
        if (!system) {
            throw new Error("System is not registered to scene: " + system);
        }

        return (system as any).controller;
    }
}