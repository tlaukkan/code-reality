import {CompositeComponentController} from "../CompositeComponentController";
import {AnimationFeature} from "../../feature/animation/AnimationFeature";
import {ExpressionFeature} from "../../feature/animation/ExpressionFeature";
import {Component, Entity} from "aframe";
import {ComponentControllerDefinition} from "../../AFrame";

export class AvatarController extends CompositeComponentController {

    public static DEFINITION = new ComponentControllerDefinition("avatar", {}, false, true, (component: Component, entity: Entity, data: any) => new AvatarController(component, entity, data));

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
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


