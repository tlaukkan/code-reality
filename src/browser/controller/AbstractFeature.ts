import {Entity} from "AFrame";
import {ComponentController} from "../component/ComponentController";

export abstract class AbstractFeature {
    name: string;
    entity: Entity;
    controller: ComponentController;

    constructor(name: string, controller: ComponentController, entity: Entity) {
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