import {ComponentController} from "../../component/ComponentController";
import {AnimationAction, AnimationClip, AnimationMixer, Event, LoopOnce, LoopPingPong, LoopRepeat} from "three";
import {AnimationEventDetail} from "../../model/AnimateEventDetail";
import {AnimationEndEventDetail} from "../../model/AnimateEndEventDetail";
import {AnimationFinishedEventDetails} from "../../model/AnimationFinishedEventDetail";
import {Events} from "../../model/Events";
import {AnimationLoopStyle} from "./AnimationLoopStyle";
import {Entity} from "aframe";
import {AbstractFeature} from "../AbstractFeature";
import {EntityStateEventDetail} from "../../model/EntityStateEventDetail";

export class ExpressionFeature extends AbstractFeature {

    expressions: Set<string> = new Set();

    constructor(controller: ComponentController, entity: Entity) {
        super("expression-controller", controller, entity);
    }

    init(): void {
        /*this.addEventListener(Events.EVENT_STATE_BEGIN, (detail: EntityStateEventDetail) => {
            if (detail.state === "forward" ||
                detail.state === "backward" ||
                detail.state === "left" ||
                detail.state === "right") {
                this.dispatchEvent(Events.EVENT_ANIMATE_BEGIN, new AnimationEventDetail("walking", AnimationLoopStyle.LOOP_REPEAT, 10));
                this.expressions.add("walking");
            }
        });
        this.addEventListener(Events.EVENT_STATE_END, (detail: EntityStateEventDetail) => {
            if (detail.state === "forward" ||
                detail.state === "backward" ||
                detail.state === "left" ||
                detail.state === "right") {
                this.dispatchEvent(Events.EVENT_ANIMATE_END, new AnimationEventDetail("walking", AnimationLoopStyle.LOOP_REPEAT, 10));
            }
        });*/
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


