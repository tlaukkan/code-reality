import {Intersection, Object3D, Raycaster} from "three";

export function raycast(objects: Array<Object3D>, raycaster: Raycaster) {
    const intersects = new Array<Intersection>();
    raycastRecursive(objects, raycaster, intersects);
    intersects.sort(ascSort);
    return intersects;
}

function raycastRecursive(objects: Array<Object3D>, caster: Raycaster, intersects: Array<Intersection>) {
    for (const object of objects) {
        object.raycast(caster, intersects);
        if (object.children && object.children.length > 0) {
            raycastRecursive(object.children, caster, intersects);
        }
    }
}

function ascSort( a: Intersection, b: Intersection ) {

    return a.distance - b.distance;

}