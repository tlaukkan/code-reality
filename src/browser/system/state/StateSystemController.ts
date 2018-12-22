import {Component, Entity, Scene, System} from "AFrame";
import {AbstractSystemController} from "../AbstractSystemController";

export class StateSystemController extends AbstractSystemController {

    private providers: Map<string, () => any> = new Map();
    private states: Map<Entity, Map<string, any>> = new Map();

    constructor(system: System, scene: Scene, data: any) {
        super("state-system", {}, false, system, scene, data);
    }

    init(): void {
        console.log(this.systemName + " init");
    }

    pause(): void {
        console.log(this.systemName + " pause");
    }

    play(): void {
        console.log(this.systemName + " play");
    }

    tick(time: number, timeDelta: number): void {
    }

    registerStateType<T>(type: string, provider: () => T) {
        this.providers.set(type, provider);
    }

    getState<T>(entity: Entity, type: string): T {
        if (!this.providers.has(type)) {
            throw new Error("Unknown state type: " + type);
        }
        if (!this.states.has(entity)) {
            this.states.set(entity, new Map());
        }
        const entityStates = this.states.get(entity)!!;
        if (!entityStates.has(type)) {
            entityStates.set(type, this.providers.get(type)!!());
        }
        return entityStates.get(type)!!;
    }

    removeStates(entity: Entity): void {
        this.states.delete(entity);
    }

}


