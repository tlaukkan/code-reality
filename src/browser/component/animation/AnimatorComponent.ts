import {CompositeComponent} from "../CompositeComponent";
import {AnimationController} from "../../controllers/animation/AnimationController";

export class AnimatorComponent extends CompositeComponent {

    constructor() {
        super("animator", {}, false);
    }

    init(): void {
        this.addController(new AnimationController(this, this.entity!!));
        super.init();
    }

}

