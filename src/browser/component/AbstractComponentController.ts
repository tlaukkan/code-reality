import {ComponentController} from "./ComponentController";
import {Component, Entity, Scene} from "AFrame";
import {SystemController} from "../system/SystemController";

/**
 * Abstract base class for component implementations.
 */
export abstract class AbstractComponentController implements ComponentController {
    readonly componentName: string;
    readonly schema: any;
    readonly multiple: boolean;
    readonly entity: Entity;
    readonly scene: Scene;
    data: any;
    readonly component: Component;

    constructor(componentName: string, schema: any, multiple: boolean, component: Component, entity: Entity, data: any) {
        this.componentName = componentName;
        this.schema = schema;
        this.multiple = multiple;
        this.entity = entity;
        if (entity) {
            this.scene = entity.sceneEl!;
        } else {
            // This is prototype
            this.scene = undefined as any;
        }
        this.data = data;
        this.component = component;
    }

    setData(data: any): void {
        this.data = data;
    }

    abstract init(): void;

    abstract update(data: any, oldData: any): void;

    abstract remove(): void;

    abstract pause(): void;

    abstract play(): void;

    abstract tick(time: number, timeDelta: number): void;

    getSystemController<C extends SystemController>(systemName: string): C {
        if (!this.entity.sceneEl) {
            throw new Error("Scene is undefined.");
        }

        const system = this.entity.sceneEl.systems[systemName];
        if (!system) {
            throw new Error("System is not registered to scene: " + system);
        }

        return (system as any).controller;
    }

    getComponentController<C extends ComponentController>(componentName: string): C {
        const component = this.entity.components[componentName];
        if (!component) {
            throw new Error("Component is not registered to entity: " + component);
        }

        return (component as any).controller;
    }
}