import {Controller} from "../../component/Controller";
import {AnimationAction, AnimationClip, AnimationMixer, Event, LoopOnce, LoopPingPong, LoopRepeat} from "three";
import {AnimationEventDetail} from "../../model/AnimateEventDetail";
import {AnimationEndEventDetail} from "../../model/AnimateEndEventDetail";
import {AnimationFinishedEventDetails} from "../../model/AnimationFinishedEventDetail";
import {Events} from "../../model/Events";
import {AnimationLoopStyle} from "./AnimationLoopStyle";
import {Entity} from "AFrame";
import {AbstractFeature} from "../AbstractFeature";

export class AnimationFeature extends AbstractFeature {

    mixer: AnimationMixer | undefined;
    clips: Map<string, AnimationClip> = new Map<string, AnimationClip>();
    actions: Map<string, AnimationAction> = new Map<string, AnimationAction>();

    constructor(controller: Controller, entity: Entity) {
        super("animation-controller", controller, entity);
    }

    init(): void {
        this.addEventListener(Events.EVENT_MODEL_LOADED, () => {
            this.initAnimation();
        });
        this.addEventListener(Events.EVENT_ANIMATE_BEGIN, (detail: AnimationEventDetail) => {
            this.beginAnimation(detail.clipName, detail.style, detail.repetitions);
        });
        this.addEventListener(Events.EVENT_ANIMATE_END, (detail: AnimationEndEventDetail) => {
            this.endAnimation(detail.clipName);
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
        this.dispatchEvent(Events.EVENT_ANIMATE_BEGIN, new AnimationEventDetail("dance", AnimationLoopStyle.LOOP_REPEAT, 0));
    }


    private onAnimationFinished(clipName: string) {
        this.dispatchEvent(Events.EVENT_ANIMATION_FINISHED, new AnimationFinishedEventDetails(clipName));

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
                if (repetitions > -1) {
                    action.setLoop(LoopRepeat, repetitions);
                }
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
        this.dispatchEvent(Events.EVENT_ANIMATION_FINISHED, new AnimationFinishedEventDetails(clipName));
    }

}


