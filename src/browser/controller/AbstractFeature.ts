import {Entity} from "AFrame";
import {Controller} from "../component/Controller";

export abstract class AbstractFeature {
    name: string;
    entity: Entity;
    controller: Controller;

    constructor(name: string, controller: Controller, entity: Entity) {
        this.name = name;
        this.entity = entity;
        this.controller = controller;
    }

    abstract init(): void;

    abstract update(data: any, oldData: any): void;

    abstract remove(): void;

    abstract pause(): void;

    abstract play(): void;

    abstract tick(time: number, timeDelta: number): void;

    addEventListener(type: string, listener: ((detail: any) => void)) {
        this.entity.addEventListener(type, ((e: CustomEvent) => {
            listener(e.detail);
        }) as any);
    }

    dispatchEvent(eventType: string, detail: any) {
        this.entity.dispatchEvent(new CustomEvent(eventType, { detail: detail } ));
    }
}