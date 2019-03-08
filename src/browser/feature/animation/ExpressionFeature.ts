import {AnimationEventDetail} from "../../model/AnimateEventDetail";
import {Events} from "../../model/Events";
import {AnimationLoopStyle} from "./AnimationLoopStyle";
import {Entity} from "aframe";
import {EntityStateEventDetail} from "../../model/EntityStateEventDetail";
import {AbstractFeature} from "aframe-typescript-boilerplate";
import {ComponentController} from "aframe-typescript-boilerplate";

export class ExpressionFeature extends AbstractFeature {

    expressions: Set<string> = new Set();

    constructor(controller: ComponentController, entity: Entity) {
        super("expression-controller", controller, entity);
    }

    init(): void {
        this.addEventListener(Events.EVENT_STATE_BEGIN, (detail: EntityStateEventDetail) => {
            if (detail.state === "moving") {
                this.dispatchEvent(Events.EVENT_ANIMATE_BEGIN, new AnimationEventDetail("walking", AnimationLoopStyle.LOOP_REPEAT, -1));
            }
        });
        this.addEventListener(Events.EVENT_STATE_END, (detail: EntityStateEventDetail) => {
            if (detail.state === "moving") {
                this.dispatchEvent(Events.EVENT_ANIMATE_END, new AnimationEventDetail("walking", AnimationLoopStyle.LOOP_REPEAT, 10));
            }
        });
    }

    update(data: any, oldData: any): void {
    }

    remove(): void {
    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
    }
}


