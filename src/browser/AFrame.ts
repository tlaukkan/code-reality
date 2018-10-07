import {ComponentConstructor, Entity} from "aframe";

interface Component {

    /**
     * Component name.
     */
    readonly name: string;

    /**
     * Component schema.
     */
    readonly schema: any;
    /**
     * Whether component requires multiple instancing.
     */
    readonly multiple: boolean;

    readonly entity: Entity | undefined;

    readonly data: any;

    setEntity(entity: Entity): void;
    setData(data: any): void;

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

export abstract class AbstractComponent implements Component {
    readonly name: string;
    readonly schema: any;
    readonly multiple: boolean;
    entity: Entity | undefined;
    data: any;
    protected constructor(name: string, schema: any, multiple: boolean) {
        this.name = name;
        this.schema = schema;
        this.multiple = multiple;
    }
    setEntity(entity: Entity): void {
        this.entity = entity;
    }
    setData(data: any): void {
        this.data = data;
    }
    abstract init(): void;
    abstract update(data: any, oldData: any): void;
    abstract remove(): void;
    abstract pause(): void;
    abstract play(): void;
    abstract tick(time: number, timeDelta: number): void;

    createElement(html: string) : Element {
        const template = document.createElement('div');
        template.innerHTML = html.trim();
        return (template as any).firstChild;
    }

}

interface NewComponent { (): Component }

export function registerAFrameComponent(newComponent: NewComponent) {
    if (typeof AFRAME !== 'undefined') {
        const prototype = newComponent();
        AFRAME.registerComponent(prototype.name, {
            schema: prototype.schema,
            multiple: prototype.multiple,
            init: function () {
                let c = newComponent();
                (this as any).component = c;
                c.setEntity(this.el!!);
                c.setData(this.data);
                c.init();
            },
            update: function (oldData) { (this as any).component.setData(this.data); (this as any).component.update(this.data, oldData); },
            remove: function () { (this as any).component.remove(); },
            tick: function (time: number, timeDelta: number) {  (this as any).component.tick(time, timeDelta); },
            pause: function () { (this as any).component.pause(); },
            play: function () { (this as any).component.play(); }
        });
    }
}
