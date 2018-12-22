import {Component, Entity, Scene, System} from "AFrame";
import {AbstractSystemController} from "../AbstractSystemController";

export class StateSystemController extends AbstractSystemController {

    private factories: Map<string, () => any> = new Map();
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

    registerStateFactory<T>(state: string, factory: () => T) {
        this.factories.set(state, factory);
    }

    getState<T>(entity: Entity, state: string): T {
        if (!this.factories.has(state)) {
            throw new Error("Unknown state type: " + state);
        }
        if (!this.states.has(entity)) {
            this.states.set(entity, new Map());
        }
        const entityStates = this.states.get(entity)!!;
        if (!entityStates.has(state)) {
            entityStates.set(state, this.factories.get(state)!!());
            console.log(entity.tagName + " added state: " + state);
        }
        return entityStates.get(state)!!;
    }

    removeStates(entity: Entity): void {
        this.states.delete(entity);
        console.log(entity.tagName + " removed states.");
    }

    removeState(entity: Entity, state: string): void {
        if (this.states.has(entity)) {
            this.states.get(entity)!!.delete(state);
        }
        console.log(entity.tagName + " removed state: " + state);
    }


}


