import {Component} from "../../AFrame";
import {AnimationAction, AnimationClip, AnimationMixer, Event, LoopOnce, LoopPingPong, LoopRepeat} from "three";
import {AnimationEventDetail} from "../../model/AnimateEventDetail";
import {AnimationEndEventDetail} from "../../model/AnimateEndEventDetail";
import {AnimationFinishedEventDetails} from "../../model/AnimationFinishedEventDetail";
import {Events} from "../../model/Events";
import {AnimationLoopStyle} from "./AnimationLoopStyle";
import {Entity} from "aframe";
import {AbstractController} from "../AbstractController";

export class AnimationController extends AbstractController {

    mixer: AnimationMixer | undefined;
    clips: Map<string, AnimationClip> = new Map<string, AnimationClip>();
    actions: Map<string, AnimationAction> = new Map<string, AnimationAction>();

    constructor(component: Component, entity: Entity) {
        super("animation-controller", component, entity);
    }

    init(): void {
        this.entity.addEventListener("model-loaded", ((e: CustomEvent) => {
            console.log("model-loaded");
            this.initAnimation();
        }) as any);
        this.entity.addEventListener(Events.EVENT_ANIMATE_BEGIN, ((e: CustomEvent) => {
            const detail = e.detail as AnimationEventDetail;
            this.beginAnimation(detail.clipName, detail.style, detail.repetitions);
        }) as any);
        this.entity.addEventListener(Events.EVENT_ANIMATE_END, ((e: CustomEvent) => {
            const detail = e.detail as AnimationEndEventDetail;
            this.endAnimation(detail.clipName);
        }) as any);
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
        if (this.mixer) {
            this.mixer.update(timeDelta / 1000);
        }
    }

    private initAnimation() {
        const mesh = this.entity.getObject3D('mesh');
        const clips = (mesh as any).animations as Array<AnimationClip>;
        if (!clips) {
            return;
        }
        if (clips.length == 0) {
            return;
        }

        this.mixer = new AnimationMixer(mesh);
        this.mixer.addEventListener('finished', (event: Event) => {
            this.onAnimationFinished(((event as any).action._clip as AnimationClip).name);
        });
        this.clips.clear();
        clips.forEach(clip => {
            this.clips.set(clip.name.toLocaleLowerCase(), clip);
        });
        this.actions.clear();
        this.entity.dispatchEvent(new CustomEvent(Events.EVENT_ANIMATE_BEGIN,
            {detail: new AnimationEventDetail("dance", AnimationLoopStyle.LOOP_REPEAT, 0)}));
    }


    private onAnimationFinished(clipName: string) {
        this.entity.dispatchEvent(new CustomEvent(Events.EVENT_ANIMATION_FINISHED,
            {detail: new AnimationFinishedEventDetails(clipName)}));

        this.actions.delete(clipName);
    }

    private beginAnimation(clipName: string, style: AnimationLoopStyle, repetitions: number) {
        if (!this.mixer) {
            return;
        }
        if (!this.clips.has(clipName)) {
            return;
        }
        if (this.actions.has(clipName)) {
            return;
        }

        const clip = this.clips.get(clipName);

        if (clip) {
            const action = this.mixer!!.clipAction(clip);
            if (style == AnimationLoopStyle.ONCE) {
                action.setLoop(LoopOnce, repetitions);
            } else if (style == AnimationLoopStyle.LOOP_REPEAT) {
                action.setLoop(LoopRepeat, repetitions);
            } else {
                action.setLoop(LoopPingPong, repetitions);
            }

            action.play();
            this.actions.set(clipName, action);
        }
    }

    private endAnimation(clipName: string) {
        if (!this.actions.has(clipName)) {
            return;
        }
        this.actions.get(clipName)!!.stop();
        this.actions.delete(clipName);
        this.entity.dispatchEvent(new CustomEvent(Events.EVENT_ANIMATION_FINISHED,
            {detail: new AnimationFinishedEventDetails(clipName)}));
    }

}


