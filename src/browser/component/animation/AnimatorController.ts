import {FeatureCompositeController} from "../FeatureCompositeController";
import {AnimationFeature} from "../../controller/animation/AnimationFeature";
import {Component, Entity} from "aframe";

export class AnimatorController extends FeatureCompositeController {

    constructor(component: Component, entity: Entity, data: any) {
        super("animator", component, {}, false, entity, data);
    }

    init(): void {
        this.addController(new AnimationFeature(this, this.entity!!));
        super.init();
    }

}


