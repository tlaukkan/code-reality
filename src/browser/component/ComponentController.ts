import {Entity, Component} from "AFrame";

/**
 * Interface for component controllers.
 */
export interface ComponentController {

    /**
     * Component name.
     */
    readonly componentName: string;

    /**
     * Component schema.
     */
    readonly schema: any;
    /**
     * Whether component requires multiple instancing.
     */
    readonly multiple: boolean;
    /**
     * The entity (HTML element)
     */
    readonly entity: Entity;
    /**
     * The properties data.
     */
    readonly data: any;
    /**
     * The state, this of component definition functions.
     */
    readonly component: Component;

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init(): void;

    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     */
    update(data: any, oldData: any): void;

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    remove(): void;

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