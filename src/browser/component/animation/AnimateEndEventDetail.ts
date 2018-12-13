import {AnimationLoopStyle} from "./AnimationLoopStyle";

export class AnimationEndEventDetail {

    clipName: string;

    constructor(clip: string) {
        this.clipName = clip;
    }
}