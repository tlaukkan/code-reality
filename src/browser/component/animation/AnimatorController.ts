import {CompositeComponentController} from "../CompositeComponentController";
import {AnimationFeature} from "../../feature/animation/AnimationFeature";
import {Component, Entity} from "aframe";
import {ComponentControllerDefinition} from "../../AFrame";

export class AnimatorController extends CompositeComponentController {

    public static DEFINITION = new ComponentControllerDefinition(
        "animator", {}, false,
        (component: Component, entity: Entity, data: any) => new AnimatorController(component, entity, data)
    );

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        this.addFeature(new AnimationFeature(this, this.entity!!));
        super.init();
    }

}


