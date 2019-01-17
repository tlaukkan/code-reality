import {Entity} from "aframe";

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