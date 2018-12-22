import {CompositeComponentController} from "../CompositeComponentController";
import {AnimationFeature} from "../../feature/animation/AnimationFeature";
import {ExpressionFeature} from "../../feature/animation/ExpressionFeature";
import {Component, Entity} from "aframe";

export class AvatarController extends CompositeComponentController {


    constructor(component: Component, entity: Entity, data: any) {
        super("avatar", {}, false, component, entity, data);
    }

    init(): void {
        this.addFeature(new ExpressionFeature(this, this.entity!!));
        this.addFeature(new AnimationFeature(this, this.entity!!));
        super.init();
    }

    tick(time: number, timeDelta: number): void {
        super.tick(time, timeDelta);
    }

}


