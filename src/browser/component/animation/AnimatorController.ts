import {Component, Entity} from "aframe";
import {ComponentControllerDefinition, CompositeComponentController} from "aframe-typescript-boilerplate";
import {AnimationFeature} from "../../feature/animation/AnimationFeature";

export class AnimatorController extends CompositeComponentController {

    public static DEFINITION = new ComponentControllerDefinition("animator", {}, false, true, (component: Component, entity: Entity, data: any) => new AnimatorController(component, entity, data));

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        this.addFeature(new AnimationFeature(this, this.entity!!));
        super.init();
    }

}


