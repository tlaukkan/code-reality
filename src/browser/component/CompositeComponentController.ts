import {AbstractFeature} from "../feature/AbstractFeature";
import {Entity, Component} from "aframe";
import {AbstractComponentController} from "./AbstractComponentController";

export class CompositeComponentController extends AbstractComponentController {

    features: Array<AbstractFeature> = [];

    constructor(componentName: string, schema: any, multiple: boolean, component: Component, entity: Entity, data: any) {
        super(componentName, schema, multiple, component, entity, data);
    }

    init(): void {
        console.log(this.componentName + " init: " + JSON.stringify(this.data));
        this.features.forEach(controller => {
            controller.init();
        });

    }

    update(data: any, oldData: any): void {
        console.log(this.componentName + " update: " + JSON.stringify(this.data));
        this.features.forEach(controller => {
            controller.update(data, oldData);
        });
    }

    remove(): void {
        console.log(this.componentName + " remove");
        this.features.forEach(controller => {
            controller.remove();
        });
    }

    pause(): void {
        console.log(this.componentName + " pause");
        this.features.forEach(controller => {
            controller.pause();
        });
    }

    play(): void {
        console.log(this.componentName + " play");
        this.features.forEach(controller => {
            controller.play();
        });
    }

    tick(time: number, timeDelta: number): void {
        this.features.forEach(controller => {
            controller.tick(time, timeDelta);
        });
    }

    addFeature(feature: AbstractFeature) {
        this.features.push(feature);
    }

}


