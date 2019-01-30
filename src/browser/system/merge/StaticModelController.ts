import {Component, Entity} from "aframe";
import {AbstractComponentController} from "../../component/AbstractComponentController";
import {ComponentControllerDefinition} from "../../AFrame";
import {setEntityGltfModel} from "../../three/gltf_load";

export class StaticModelController extends AbstractComponentController {

    public static DEFINITION = new ComponentControllerDefinition(
        "static-model",
        {type: 'model'},
        false,
        (component: Component, entity: Entity, data: any) => new StaticModelController(component, entity, data)
    );

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        console.log(this.componentName + " init: " + JSON.stringify(this.data));
    }

    update(data: any, oldData: any): void {
        console.log(this.componentName + " update: " + JSON.stringify(this.data));
        setEntityGltfModel(this.entity, data).then(() => {
            console.log("Static model loaded: " + data);
        }).catch((error) => {
            console.error("Error loading static model:" + data, error);
        });
    }

    remove(): void {
    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
    }

}


