import {AnimationLoopStyle} from "../component/animation/AnimationLoopStyle";

export class AnimationEndEventDetail {

    clipName: string;

    constructor(clip: string) {
        this.clipName = clip;
    }
}