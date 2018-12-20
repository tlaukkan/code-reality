import {Entity, Component} from "aframe";
import {Controller} from "./component/Controller";

interface NewController { (component: Component, entity: Entity, data: any): Controller }

export function registerAFrameComponent(newController: NewController) {
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
