import {AnimationLoopStyle} from "../feature/animation/AnimationLoopStyle";

export class AnimationEventDetail {

    clipName: string;
    style: AnimationLoopStyle;
    repetitions: number;

    constructor(animation: string, style: AnimationLoopStyle, repeats: number) {
        this.clipName = animation;
        this.style = style;
        this.repetitions = repeats;
    }
}