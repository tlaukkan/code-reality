import {Component} from "../../AFrame";
import {AnimationAction, AnimationClip, AnimationMixer, Event, LoopOnce, LoopPingPong, LoopRepeat} from "three";
import {AnimationEventDetail} from "../../model/AnimateEventDetail";
import {AnimationEndEventDetail} from "../../model/AnimateEndEventDetail";
import {AnimationFinishedEventDetails} from "../../model/AnimationFinishedEventDetail";
import {Events} from "../../model/Events";
import {AnimationLoopStyle} from "./AnimationLoopStyle";
import {Entity} from "aframe";
import {AbstractController} from "../AbstractController";
import {EntityStateEventDetail} from "../../model/EntityStateEventDetail";

export class ExpressionController extends AbstractController {


    constructor(component: Component, entity: Entity) {
        super("expression-controller", component, entity);
    }

    init(): void {
        this.addEventListener(Events.EVENT_STATE_BEGIN, (detail: EntityStateEventDetail) => {
            if (detail.state === "forward" ||
                detail.state === "backward" ||
                detail.state === "left" ||
                detail.state === "right") {
                this.dispatchEvent(Events.EVENT_ANIMATE_BEGIN, new AnimationEventDetail("walking", AnimationLoopStyle.LOOP_REPEAT, 10));
            }
        });
        this.addEventListener(Events.EVENT_STATE_END, (detail: EntityStateEventDetail) => {
            if (detail.state === "forward" ||
                detail.state === "backward" ||
                detail.state === "left" ||
                detail.state === "right") {
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


