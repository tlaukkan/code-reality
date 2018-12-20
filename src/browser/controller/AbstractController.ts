import {Entity} from "AFrame";
import {Component} from "../component/Component";

export abstract class AbstractController {
    name: string;
    entity: Entity;
    component: Component;

    constructor(name: string, component: Component, entity: Entity) {
        this.name = name;
        this.entity = entity;
        this.component = component;
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