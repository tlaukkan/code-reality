export class AnimationFinishedEventDetails {

    clipName: string;

    constructor(clip: string) {
        this.clipName = clip;
    }
}