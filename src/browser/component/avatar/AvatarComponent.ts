import {CompositeComponent} from "../CompositeComponent";
import {AnimationController} from "../../controllers/animation/AnimationController";
import {ExpressionController} from "../../controllers/animation/ExpressionController";
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


