import {Component, Entity, Scene, System} from "aframe";
import {AbstractSystemController} from "../AbstractSystemController";
import {SystemControllerDefinition} from "../../AFrame";

const factories: Map<string, () => any> = new Map();

export function registerStateFactory<T>(state: string, factory: () => T) {
    factories.set(state, factory);
}


export class StateSystemController extends AbstractSystemController {

    public static DEFINITION = new SystemControllerDefinition(
        "state", {},
        (system: System, scene: Scene, data: any) => new StateSystemController(system, scene, data)
    );

    private states: Map<Entity, Map<string, any>> = new Map();

    constructor(system: System, scene: Scene, data: any) {
        super(system, scene, data);
    }

    init(): void {
    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
    }

    getState<T>(entity: Entity, state: string): T {
        if (!factories.has(state)) {
            throw new Error("Unknown state type: " + state);
        }
        if (!this.states.has(entity)) {
            this.states.set(entity, new Map());
        }
        const entityStates = this.states.get(entity)!!;
        if (!entityStates.has(state)) {
            entityStates.set(state, factories.get(state)!!());
            //console.log(entity.tagName + " added state: " + state);
        }
        return entityStates.get(state)!!;
    }

    removeStates(entity: Entity): void {
        this.states.delete(entity);
        //console.log(entity.tagName + " removed states.");
    }

    removeState(entity: Entity, state: string): void {
        if (this.states.has(entity)) {
            this.states.get(entity)!!.delete(state);
        }
        //console.log(entity.tagName + " removed state: " + state);
    }

}

