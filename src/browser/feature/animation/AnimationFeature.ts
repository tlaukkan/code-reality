import {ComponentController} from "../../component/ComponentController";
import {AnimationAction, AnimationClip, AnimationMixer, Event, LoopOnce, LoopPingPong, LoopRepeat} from "three";
import {AnimationEventDetail} from "../../model/AnimateEventDetail";
import {AnimationEndEventDetail} from "../../model/AnimateEndEventDetail";
import {AnimationFinishedEventDetails} from "../../model/AnimationFinishedEventDetail";
import {Events} from "../../model/Events";
import {AnimationLoopStyle} from "./AnimationLoopStyle";
import {Entity} from "AFrame";
import {AbstractFeature} from "../AbstractFeature";
import {StateSystemController} from "../../system/state/StateSystemController";
import {getSystemController} from "../../AFrame";
import {MovementState} from "../../model/MovementState";
import {States} from "../../model/States";

export class AnimationFeature extends AbstractFeature {

    mixer: AnimationMixer | undefined;
    clips: Map<string, AnimationClip> = new Map<string, AnimationClip>();
    actions: Map<string, AnimationAction> = new Map<string, AnimationAction>();
    stateSystemController: StateSystemController;
    movementState: MovementState;

    constructor(controller: ComponentController, entity: Entity) {
        super("animation-controller", controller, entity);
        this.stateSystemController = controller.getSystemController("state-system");
        this.movementState = this.stateSystemController.getState(this.entity, States.STATE_MOVEMENT);
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
            if (this.actions.has("walking")) {
                const walkingAction = this.actions.get("walking")!!;

                const walkingAnimationNormalSpeed = 1.9; // 1 m/s
                const entityActualSpeed = this.movementState.distanceDelta / this.movementState.timeDeltaSeconds;
                const timeScale = this.movementState.facing * entityActualSpeed / walkingAnimationNormalSpeed;

                walkingAction.setEffectiveTimeScale(timeScale);
            }
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
            console.log(clip.name);
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

        const clip = this.clips.get(clipName);

        if (clip) {
            const action = this.actions.has(clipName) ? this.actions.get(clipName)!! : this.mixer!!.clipAction(clip);
            if (style == AnimationLoopStyle.ONCE) {
                action.setLoop(LoopOnce, repetitions);
            } else if (style == AnimationLoopStyle.LOOP_REPEAT) {
                if (repetitions > -1) {
                    action.setLoop(LoopRepeat, repetitions);
                }
            } else {
                action.setLoop(LoopPingPong, repetitions);
            }

            action.reset();
            action.fadeIn(0.25);
            action.play();
            this.actions.set(clipName, action);
        }
    }

    private endAnimation(clipName: string) {
        if (!this.actions.has(clipName)) {
            return;
        }
        const action = this.actions.get(clipName)!!;

        action.fadeOut(0.25);
        this.dispatchEvent(Events.EVENT_ANIMATION_FINISHED, new AnimationFinishedEventDetails(clipName));

        setTimeout(() => {
            if (this.actions.has(clipName) && this.actions.get(clipName)!!.weight == 0) {
                action.stop();
            }
        }, 1000);
    }

}


