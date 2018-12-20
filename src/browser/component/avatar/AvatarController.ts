import {FeatureCompositeController} from "../FeatureCompositeController";
import {AnimationFeature} from "../../controller/animation/AnimationFeature";
import {ExpressionFeature} from "../../controller/animation/ExpressionFeature";
import {Component, Entity} from "aframe";

export class AvatarController extends FeatureCompositeController {


    constructor(component: Component, entity: Entity, data: any) {
        super("avatar", component, {}, false, entity, data);
    }

    init(): void {
        this.addController(new ExpressionFeature(this, this.entity!!));
        this.addController(new AnimationFeature(this, this.entity!!));
        super.init();
    }

}


