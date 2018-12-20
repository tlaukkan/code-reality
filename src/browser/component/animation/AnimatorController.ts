import {CompositeComponentController} from "../CompositeComponentController";
import {AnimationFeature} from "../../controller/animation/AnimationFeature";
import {Component, Entity} from "aframe";

export class AnimatorController extends CompositeComponentController {

    constructor(component: Component, entity: Entity, data: any) {
        super("animator", {}, false, component, entity, data);
    }

    init(): void {
        this.addController(new AnimationFeature(this, this.entity!!));
        super.init();
    }

}


