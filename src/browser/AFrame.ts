import {Entity} from "aframe";
import {Component} from "./Component";

interface NewComponent { (entity: Entity, data: any, state: any): Component }

export function registerAFrameComponent(newComponent: NewComponent) {
    if (typeof AFRAME !== 'undefined') {
        const prototype = newComponent({} as any, {} as any, {} as any);
        AFRAME.registerComponent(prototype.name, {
            schema: prototype.schema,
            multiple: prototype.multiple,
            init: function () {
                (this as any).component = newComponent(this.el!!, this.data, this);
                (this as any).component.init();
            },
            update: function (oldData) { (this as any).component.setData(this.data); (this as any).component.update(this.data, oldData); },
            remove: function () { (this as any).component.remove(); },
            tick: function (time: number, timeDelta: number) {  (this as any).component.tick(time, timeDelta); },
            pause: function () { (this as any).component.pause(); },
            play: function () { (this as any).component.play(); }
        });
    }
}
