import {Component} from "./Component";
import {Entity} from "AFrame";

/**
 * Abstract base class for component implementations.
 */
export abstract class AbstractComponent implements Component {
    readonly name: string;
    readonly schema: any;
    readonly multiple: boolean;
    readonly entity: Entity;
    data: any;
    readonly state: any;

    protected constructor(name: string, schema: any, multiple: boolean, entity: Entity, data: any, state: any) {
        this.name = name;
        this.schema = schema;
        this.multiple = multiple;
        this.entity = entity;
        this.data = data;
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