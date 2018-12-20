import {CompositeComponent} from "../CompositeComponent";
import {AnimationController} from "../../controllers/animation/AnimationController";
import {ExpressionController} from "../../controllers/animation/ExpressionController";

export class AvatarComponent extends CompositeComponent {


    constructor() {
        super("avatar", {}, false);
    }

    init(): void {
        this.addController(new ExpressionController(this, this.entity!!));
        this.addController(new AnimationController(this, this.entity!!));
        super.init();
    }

}


