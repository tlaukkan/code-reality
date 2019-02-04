import {Entity} from "aframe";
import {Object3D} from "three";

export function createElement(html: string) : Element {
    const template = document.createElement('div');
    template.innerHTML = html.trim();
    return (template as any).firstChild;
}

export function addEntityEventListener(entity: Entity, type: string, listener: ((detail: any) => void)) {
    entity.addEventListener(type, ((e: CustomEvent) => {
        listener(e.detail);
    }) as any);
}

export function addDocumentEventListener(type: string, listener: ((detail: any) => void)) {
    document.addEventListener(type, ((e: CustomEvent) => {
        listener(e.detail);
    }) as any);
}

export function getEntity(object: Object3D): Entity | undefined {
    if ((object as any).el) {
        return (object as any).el;
    }
    let parentObject: Object3D | undefined = undefined;
    object.traverseAncestors((a: Object3D) => {
        if (parentObject === undefined && (a as any).el) {
            parentObject = a;
        }
    });
    if (parentObject) {
        return (parentObject as any).el
    }
    return undefined;
}