import {AbstractComponent} from "../../AFrame";
import {AnimationClip, AnimationMixer, LoopOnce, LoopPingPong, LoopRepeat, Event, AnimationAction} from "three";
import {AnimationEventDetail} from "../../model/AnimateEventDetail";
import {AnimationLoopStyle} from "./AnimationLoopStyle";
import {AnimationEndEventDetail} from "../../model/AnimateEndEventDetail";
import {AnimationFinishedEventDetails} from "../../model/AnimationFinishedEventDetail";
import {Events} from "../../model/Events";

export class AnimatorComponent extends AbstractComponent {


    mixer: AnimationMixer | undefined;
    clips: Map<string, AnimationClip> = new Map<string, AnimationClip>();
    actions: Map<string, AnimationAction> = new Map<string, AnimationAction>();

    constructor() {
        super(
            "animator",
            {},
            false);
    }


    init(): void {
        console.log(this.name + " init: " + JSON.stringify(this.data));

        this.entity!!.addEventListener("model-loaded", ((e: CustomEvent) => {
            console.log("model-loaded");
            this.initAnimation();
        }) as any);

        this.entity!!.addEventListener(Events.EVENT_ANIMATE_BEGIN, ((e: CustomEvent) => {
            const detail = e.detail as AnimationEventDetail;
            this.beginAnimation(detail.clipName, detail.style, detail.repetitions);
        }) as any);

        this.entity!!.addEventListener(Events.EVENT_ANIMATE_END, ((e: CustomEvent) => {
            const detail = e.detail as AnimationEndEventDetail;
            this.endAnimation(detail.clipName);
        }) as any);

    }


    private initAnimation() {
        const mesh = this.entity!!.getObject3D('mesh');
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
        this.entity!!.dispatchEvent(new CustomEvent(Events.EVENT_ANIMATE_BEGIN,
            {detail: new AnimationEventDetail("dance", AnimationLoopStyle.LOOP_REPEAT, 1)}));
    }


    private onAnimationFinished(clipName: string) {
        this.entity!!.dispatchEvent(new CustomEvent(Events.EVENT_ANIMATION_FINISHED,
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
        this.entity!!.dispatchEvent(new CustomEvent(Events.EVENT_ANIMATION_FINISHED,
            {detail: new AnimationFinishedEventDetails(clipName)}));
    }

    update(data: any, oldData: any): void {
        console.log(this.name + " update: " + JSON.stringify(this.data));
    }

    remove(): void {
        console.log(this.name + " remove");
    }

    pause(): void {
        console.log(this.name + " pause");
    }

    play(): void {
        console.log(this.name + " play");
    }

    tick(time: number, timeDelta: number): void {
        if (this.mixer) {
            this.mixer.update( timeDelta / 1000 );
        }
    }

}


