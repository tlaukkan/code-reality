import {Controller} from "./Controller";
import {Component, Entity} from "AFrame";

/**
 * Abstract base class for component implementations.
 */
export abstract class AbstractController implements Controller {
    readonly componentName: string;
    readonly schema: any;
    readonly multiple: boolean;
    readonly entity: Entity;
    data: any;
    readonly component: Component;

    protected constructor(componentName: string, component: Component, schema: any, multiple: boolean, entity: Entity, data: any) {
        this.componentName = componentName;
        this.schema = schema;
        this.multiple = multiple;
        this.entity = entity;
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
}