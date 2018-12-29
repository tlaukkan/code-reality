import {Entity, Component, System, Scene, ComponentDefinition} from "aframe";
import {ComponentController} from "./component/ComponentController";
import {SystemController} from "./system/SystemController";


export class ComponentControllerDefinition {
    readonly componentName: string;
    readonly schema: any;
    readonly multiple: boolean;
    readonly constructComponentController: ConstructComponentController;

    constructor(componentName: string, schema: any, multiple: boolean, constructComponentController: ConstructComponentController) {
        this.componentName = componentName;
        this.schema = schema;
        this.multiple = multiple;
        this.constructComponentController = constructComponentController;
    }
}

interface ConstructComponentController { (component: Component, entity: Entity, data: any): ComponentController }
interface NewSystemController { (system: System, scene: Scene, data: any): SystemController }

export function registerSystemController(newController: NewSystemController) {
    if (typeof AFRAME !== 'undefined') {
        const controllerPrototype = newController(undefined as any, undefined as any, undefined);
        AFRAME.registerSystem(controllerPrototype.systemName, {
            schema: controllerPrototype.schema,
            multiple: controllerPrototype.multiple,
            init: function () {
                (this as any).controller = newController(this as Component, (this as any)!!.el, this.data);
                (this as any).controller.init();
            },
            tick: function (time: number, timeDelta: number) {  (this as any).controller.tick(time, timeDelta); },
            pause: function () { (this as any).controller.pause(); },
            play: function () { (this as any).controller.play(); }
        });
    }
}


export function registerComponentControllerV2(definition: ComponentControllerDefinition) {
    if (typeof AFRAME !== 'undefined') {
        AFRAME.registerComponent(definition.componentName, {
            schema: definition.schema,
            multiple: definition.multiple,
            init: function () {
                (this as any).controller = definition.constructComponentController(this as Component, this.el!!, this.data);
                (this as any).controller.init();
            },
            update: function (oldData) { (this as any).controller.setData(this.data); (this as any).controller.update(this.data, oldData); },
            remove: function () { (this as any).controller.remove(); },
            tick: function (time: number, timeDelta: number) {  (this as any).controller.tick(time, timeDelta); },
            pause: function () { (this as any).controller.pause(); },
            play: function () { (this as any).controller.play(); }
        });
    }
}

export function getSystemController<C extends SystemController>(scene: Scene, systemName: string): C {
    if (!scene) {
        throw new Error("Scene is undefined.");
    }
    if (!scene.systems) {
        throw new Error("Scene systems is undefined.");
    }


    const system = scene.systems[systemName];
    if (!system) {
        throw new Error("System is not registered to scene: " + system);
    }

    return (system as any).controller;
}