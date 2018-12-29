import {ComponentController} from "./ComponentController";
import {Component, Entity, Scene} from "AFrame";
import {SystemController} from "../system/SystemController";
import {InterfaceSystemController} from "../system/interface/InterfaceSystemController";
import {getSystemController} from "../AFrame";

/**
 * Abstract base class for component implementations.
 */
export abstract class AbstractComponentController implements ComponentController {
    readonly componentName: string;
    readonly entity: Entity;
    readonly scene: Scene;
    data: any;
    readonly component: Component;

    protected interfaceSystemController: InterfaceSystemController;

    constructor(component: Component, entity: Entity, data: any) {
        this.componentName = component.name;
        this.entity = entity;
        if (entity) {
            this.scene = entity.sceneEl!;
        } else {
            // This is prototype
            this.scene = undefined as any;
        }
        this.data = data;
        this.component = component;

        if (!component) {
            // This is prototype not actual system instance.
            this.interfaceSystemController = {} as any;
            return;
        }

        this.interfaceSystemController = getSystemController(this.entity.sceneEl!!, "interface");
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

    addEventListener(type: string, listener: ((detail: any) => void)) {
        this.entity.addEventListener(type, ((e: CustomEvent) => {
            listener(e.detail);
        }) as any);
    }

    dispatchEvent(eventType: string, detail: any) {
        this.entity.dispatchEvent(new CustomEvent(eventType, { detail: detail } ));
    }
}