import {CompositeComponentController} from "../CompositeComponentController";
import {AnimationFeature} from "../../controller/animation/AnimationFeature";
import {ExpressionFeature} from "../../controller/animation/ExpressionFeature";
import {Component, Entity} from "aframe";

export class AvatarController extends CompositeComponentController {


    constructor(component: Component, entity: Entity, data: any) {
        super("avatar", {}, false, component, entity, data);
    }

    init(): void {
        this.addController(new ExpressionFeature(this, this.entity!!));
        this.addController(new AnimationFeature(this, this.entity!!));
        super.init();
    }

}


