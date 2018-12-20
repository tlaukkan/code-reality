import {CompositeComponent} from "../CompositeComponent";
import {AnimationController} from "../../controller/animation/AnimationController";
import {ExpressionController} from "../../controller/animation/ExpressionController";
import {Entity} from "aframe";

export class AvatarComponent extends CompositeComponent {


    constructor(entity: Entity, data: any, state: any) {
        super("avatar",
            {},
            false,
            entity,
            data,
            state);
    }

    init(): void {
        this.addController(new ExpressionController(this, this.entity!!));
        this.addController(new AnimationController(this, this.entity!!));
        super.init();
    }

}


