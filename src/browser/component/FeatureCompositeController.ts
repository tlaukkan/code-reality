import {AbstractFeature} from "../controller/AbstractFeature";
import {Entity, Component} from "aframe";
import {AbstractController} from "./AbstractController";

export class FeatureCompositeController extends AbstractController {

    features: Array<AbstractFeature> = [];

    constructor(componentName: string, component: Component, schema: any, multiple: boolean, entity: Entity, data: any) {
        super(componentName, component, schema, multiple, entity, data);
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

    addController(controller: AbstractFeature) {
        this.features.push(controller);
    }

}


