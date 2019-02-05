import {AbstractFeature} from "../feature/AbstractFeature";
import {Scene, System} from "aframe";
import {AbstractSystemController} from "./AbstractSystemController";

export class CompositeSystemController extends AbstractSystemController {

    features: Array<AbstractFeature> = [];

    constructor(systemName: string, schema: any, multiple: boolean, system: System, scene: Scene, data: any) {
        super(system, scene, data);
    }

    init(): void {
        //console.log(this.systemName + " init: " + JSON.stringify(this.data));
        this.features.forEach(controller => {
            controller.init();
        });

    }

    pause(): void {
        //console.log(this.systemName + " pause");
        this.features.forEach(controller => {
            controller.pause();
        });
    }

    play(): void {
        //console.log(this.systemName + " play");
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


