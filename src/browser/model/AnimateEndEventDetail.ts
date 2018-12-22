import {AnimationLoopStyle} from "../feature/animation/AnimationLoopStyle";

export class AnimationEndEventDetail {

    clipName: string;

    constructor(clip: string) {
        this.clipName = clip;
    }
}