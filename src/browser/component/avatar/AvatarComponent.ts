import {CompositeComponent} from "../CompositeComponent";
import {AnimationController} from "../../controllers/animation/AnimationController";

export class AvatarComponent extends CompositeComponent {


    constructor() {
        super("avatar", {}, false);
    }

    init(): void {
        this.addController(new AnimationController(this, this.entity!!));
        super.init();
    }

}


