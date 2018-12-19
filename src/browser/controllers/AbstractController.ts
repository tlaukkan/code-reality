import {Entity} from "aframe";
import {Component} from "../AFrame";

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
}