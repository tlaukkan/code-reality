import {SystemController} from "./SystemController";
import {Entity, System} from "AFrame";

/**
 * Abstract base class for system controller implementations.
 */
export abstract class AbstractSystemController implements SystemController {
    readonly systemName: string;
    readonly schema: any;
    readonly multiple: boolean;
    readonly entity: Entity;
    data: any;
    readonly system: System;

    constructor(systemName: string, schema: any, multiple: boolean, system: System
                , entity: Entity, data: any) {
        this.systemName = systemName;
        this.schema = schema;
        this.multiple = multiple;
        this.entity = entity;
        this.data = data;
        this.system = system;
    }

    abstract init(): void;

    abstract pause(): void;

    abstract play(): void;

    abstract tick(time: number, timeDelta: number): void;
}