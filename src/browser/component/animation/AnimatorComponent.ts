import {CompositeComponent} from "../CompositeComponent";
import {AnimationController} from "../../controllers/animation/AnimationController";
import {Entity} from "aframe";

export class AnimatorComponent extends CompositeComponent {

    constructor(entity: Entity, data: any, state: any) {
        super("animator", {}, false,
            entity,
            data,
            state);
    }

    init(): void {
        this.addController(new AnimationController(this, this.entity!!));
        super.init();
    }

}


