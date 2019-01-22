import {Entity, Scene, System} from "aframe";

/**
 * Interface for system controllers.
 */
export interface SystemController {

    /**
     * Component name.
     */
    readonly systemName: string;
    /**
     * The entity (HTML element)
     */
    readonly scene: Scene;
    /**
     * The properties data.
     */
    readonly data: any;
    /**
     * The state, this of component definition functions.
     */
    readonly system: System;

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init(): void;

    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     */
    pause(): void;

    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     */
    play(): void;

    /**
     * Called on each scene tick.
     */
    tick(time: number, timeDelta: number): void;
}