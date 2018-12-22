import {Entity, Component, System} from "aframe";
import {ComponentController} from "./component/ComponentController";
import {SystemController} from "./system/SystemController";

interface NewController { (component: Component, entity: Entity, data: any): ComponentController }
interface NewSystemController { (system: System, entity: Entity, data: any): SystemController }

export function registerComponentController(newController: NewController) {
    if (typeof AFRAME !== 'undefined') {
        const controllerPrototype = newController({} as any, {} as any, {} as any);
        AFRAME.registerComponent(controllerPrototype.componentName, {
            schema: controllerPrototype.schema,
            multiple: controllerPrototype.multiple,
            init: function () {
                (this as any).controller = newController(this as Component, this.el!!, this.data);
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

export function registerSystemController(newController: NewSystemController) {
    if (typeof AFRAME !== 'undefined') {
        const controllerPrototype = newController({} as any, {} as any, {} as any);
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
