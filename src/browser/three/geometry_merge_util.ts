/**
 * @author mrdoob, tlaukkan (copied from threejs BufferGeometryUtil.js typescript and added extendability, dropped morph attributes support)
 */


import {BufferAttribute, BufferGeometry, InterleavedBufferAttribute, Material} from "three";

export class BufferGeometryMerge {
    groupOffset = 0;
    indexOffset = 0;
    readonly indexMerge = new Array<number>();
    readonly attributeMerges: Map<string, BufferAttributeMerge> = new Map();

    material: Material | Material [];
    geometry = new BufferGeometry();

    constructor(material: Material | Material[]) {
        this.material = material;
    }

    freeObjectIndexes: Set<number> = new Set();
}

class BufferAttributeMerge {
    offset: number;
    attribute: BufferAttribute;

    objectIndexAttributeRanges: Map<number, Array<[number, number]>> = new Map();

    constructor(attribute: BufferAttribute, offset: number) {
        this.offset = offset;
        this.attribute = attribute;
    }
}

export async function mergeBufferGeometries(merge: BufferGeometryMerge, geometries: Array<BufferGeometry>, useGroups: boolean): Promise<BufferGeometry> {

    const mergedGeometry = merge.geometry;

    if (geometries.length > 0) {
        const isIndexed = geometries[0].index !== null;

        const attributeNames = new Set(Object.keys(geometries[0].attributes));
        const attributes: { [name: string]: Array<BufferAttribute | InterleavedBufferAttribute>; } = {};

        for (let i = 0; i < geometries.length; ++i) {

            const geometry = geometries[i];

            // ensure that all geometries are indexed, or none

            if (isIndexed !== (geometry.index !== null)) throw new Error("Inconsistent indexed in merged geometries.");

            // gather attributes, exit early if they're different

            for (const name in geometry.attributes) {

                if (!attributeNames.has(name)) throw new Error("Inconsistent attributes in merged geometries.");

                if (attributes[name] === undefined) attributes[name] = [];

                if ((geometry as any).mergeObjectIndex === undefined) {
                    throw new Error("Merge object index not defined for merging geometry.");
                }
                (geometry.attributes[name] as any).mergeObjectIndex = (geometry as any).mergeObjectIndex;
                attributes[name].push(geometry.attributes[name]);
            }

            (mergedGeometry as any).userData.mergedUserData = (mergedGeometry as any).userData.mergedUserData || [];
            (mergedGeometry as any).userData.mergedUserData.push((mergedGeometry as any).userData);

            if (useGroups) {
                let count;

                if (isIndexed) {
                    count = geometry.index.count;
                } else if (geometry.attributes.position !== undefined) {
                    count = geometry.attributes.position.count;
                } else {
                    throw new Error("Groups used in geometry merging but group count could not be resolved");
                }

                mergedGeometry.addGroup(merge.groupOffset, count, i);
                merge.groupOffset += count;
            }
        }

        // merge indices

        if (isIndexed) {
            for (let i = 0; i < geometries.length; ++i) {

                const index = geometries[i].index;

                for (let j = 0; j < index.count; ++j) {
                    merge.indexMerge.push(index.getX(j) + merge.indexOffset);
                }

                merge.indexOffset += geometries[i].attributes.position.count;
            }
            mergedGeometry.setIndex(merge.indexMerge);
        }

        for (const name in attributes) {
            //console.log(name);
            const arrayLength = sumArrayLength(attributes[name]);
            if (!merge.attributeMerges.has(name)) {
                // Lets add build capacity for 1000 more geometries.
                const extendedArrayLength = arrayLength + attributes[name][0].array.length * 1000;
                const attributeMerge = createBufferAttributeMerge(attributes[name], extendedArrayLength);
                merge.attributeMerges.set(name, attributeMerge);
            } else {
                const attributeMerge = merge.attributeMerges.get(name)!!;
                if (attributeMerge.offset + arrayLength >= attributeMerge.attribute.array.length) {
                    throw new Error("merge out of capacity");
                }
            }
        }

        for (const name in attributes) {
            const mergedAttribute = await mergeBufferAttributes(merge.attributeMerges.get(name)!!, name, attributes[name]);
            if (!mergedGeometry.attributes[name]) {
                mergedGeometry.addAttribute(name, mergedAttribute.attribute);
            }
        }
    }

    for (const attributeMerge of merge.attributeMerges.values()) {
        attributeMerge.attribute.needsUpdate = true;
    }

    mergedGeometry.computeBoundingSphere();
    return mergedGeometry;
}

function createBufferAttributeMerge(attributes: Array<BufferAttribute|InterleavedBufferAttribute>, arrayLength: number) {
    const array = new (attributes[0].array.constructor as any)(arrayLength);
    const merge = new BufferAttributeMerge(new BufferAttribute(array, attributes[0].itemSize, attributes[0].normalized), 0);
    // Zero as no attributes added yet.
    merge.attribute.count = 0;
    return merge;
}

function sumArrayLength(attributes: Array<BufferAttribute|InterleavedBufferAttribute>) {
    let arrayLength = 0;
    for (let i = 0; i < attributes.length; ++i) {
        arrayLength += attributes[i].array.length;
    }
    return arrayLength;
}

async function mergeBufferAttributes(merge: BufferAttributeMerge, name: string, attributes: Array<BufferAttribute|InterleavedBufferAttribute>) {
    for (const attribute of attributes) {
        if ((attribute as any).isInterleavedBufferAttribute) throw new Error("Attributes had interleaved attributes..");

        await mergeBufferAttributeWithDelay(merge, attribute as BufferAttribute);
    }
    return merge;

}

let niceTimeoutCounter = 0;

function mergeBufferAttributeWithDelay(merge: BufferAttributeMerge, attribute: BufferAttribute) : Promise<void> {
    return new Promise(function (resolve, reject) {
        mergeBufferAttribute(merge, attribute).then(() => {
           niceTimeoutCounter++;
           if (niceTimeoutCounter % 100 == 0) {
               setTimeout(() => {
                   resolve();
               }, 1);
           } else {
               resolve();
           }
        }).catch((error) => {
           reject(error)
        });
    });
}

async function mergeBufferAttribute(merge: BufferAttributeMerge, attribute: BufferAttribute) {
    if (merge.attribute.itemSize !== attribute.itemSize) throw new Error("Inconsistent item size in merged attributes.");
    if (merge.attribute.normalized !== attribute.normalized) throw new Error("Inconsistent normalized in merged attributes.");
    const mergeObjectIndex = (attribute as any).mergeObjectIndex;
    if (mergeObjectIndex === undefined) {
        throw new Error("Merge object index not defined for merging attribute.");
    }
    if (!merge.objectIndexAttributeRanges.has(mergeObjectIndex)) {
        merge.objectIndexAttributeRanges.set(mergeObjectIndex, []);
    }
    merge.objectIndexAttributeRanges.get(mergeObjectIndex)!!.push([merge.offset, attribute.array.length]);

    (merge.attribute.array as any).set(attribute.array, merge.offset);
    merge.attribute.count = merge.attribute.count + attribute.array.length / attribute.itemSize;
    merge.offset += attribute.array.length;
}


export function clearBufferGeometries(merge: BufferGeometryMerge, geometries: Array<BufferGeometry>): BufferGeometry {

    const mergedGeometry = merge.geometry;

    if (geometries.length > 0) {
        const attributes: { [name: string]: Array<BufferAttribute | InterleavedBufferAttribute>; } = {};

        for (let i = 0; i < geometries.length; ++i) {
            const geometry = geometries[i]
            for (const name in geometry.attributes) {
                if (attributes[name] === undefined) attributes[name] = [];
                if ((geometry as any).mergeObjectIndex === undefined) {
                    throw new Error("Merge object index not defined for merging geometry.");
                }
                // Store merge object index to free object indexes.
                if (!merge.freeObjectIndexes.has((geometry as any).mergeObjectIndex)) {
                    merge.freeObjectIndexes.add((geometry as any).mergeObjectIndex);
                }
                (geometry.attributes[name] as any).mergeObjectIndex = (geometry as any).mergeObjectIndex;
                attributes[name].push(geometry.attributes[name]);
            }
        }

        for (const name in attributes) {
            if (name == "position") { // clear only positions to disable the geometry
                clearBufferAttributes(merge.attributeMerges.get(name)!!, name, attributes[name]);
            }
        }
    }

    for (const attributeMerge of merge.attributeMerges.values()) {
        attributeMerge.attribute.needsUpdate = true;
    }


    return mergedGeometry;
}

function clearBufferAttributes(merge: BufferAttributeMerge, name: string, attributes: Array<BufferAttribute|InterleavedBufferAttribute>) {
    for (const attribute of attributes) {
        clearBufferAttribute(merge, attribute as BufferAttribute);
    }
}

function clearBufferAttribute(merge: BufferAttributeMerge, attribute: BufferAttribute) {
    if (merge.attribute.itemSize !== attribute.itemSize) throw new Error("Inconsistent item size in merged attributes.");
    if (merge.attribute.normalized !== attribute.normalized) throw new Error("Inconsistent normalized in merged attributes.");
    const mergeObjectIndex = (attribute as any).mergeObjectIndex;

    if (mergeObjectIndex === undefined) {
        throw new Error("Merge object index not defined for merging attribute.");
    }

    if (!merge.objectIndexAttributeRanges.has(mergeObjectIndex)) {
        throw new Error("Merge object index does not have attribute ranges to clear.");
    }
    for (const range of merge.objectIndexAttributeRanges.get(mergeObjectIndex)!!) {
        const offset = range[0];
        const length = range[1];
        for (let i = 0; i < length; i++) {
            (merge.attribute.array as any)[offset + i] = 0;
        }
    }

}



export function updateBufferGeometries(merge: BufferGeometryMerge, geometries: Array<BufferGeometry>): BufferGeometry {

    const mergedGeometry = merge.geometry;

    if (geometries.length > 0) {
        const attributes: { [name: string]: Array<BufferAttribute | InterleavedBufferAttribute>; } = {};

        for (let i = 0; i < geometries.length; ++i) {
            const geometry = geometries[i]
            for (const name in geometry.attributes) {
                if (attributes[name] === undefined) attributes[name] = [];
                if ((geometry as any).mergeObjectIndex === undefined) {
                    throw new Error("Merge object index not defined for merging geometry.");
                }

                (geometry.attributes[name] as any).mergeObjectIndex = (geometry as any).mergeObjectIndex;
                attributes[name].push(geometry.attributes[name]);
            }
        }

        for (const name in attributes) {
            if (name == "position") { // update only positions to disable the geometry
                updateBufferAttributes(merge.attributeMerges.get(name)!!, name, attributes[name]);
            }
        }
    }

    for (const attributeMerge of merge.attributeMerges.values()) {
        attributeMerge.attribute.needsUpdate = true;
    }


    return mergedGeometry;
}

function updateBufferAttributes(merge: BufferAttributeMerge, name: string, attributes: Array<BufferAttribute|InterleavedBufferAttribute>) {
    for (const attribute of attributes) {
        updateBufferAttribute(merge, attribute as BufferAttribute);
    }
}

function updateBufferAttribute(merge: BufferAttributeMerge, attribute: BufferAttribute) {
    if (merge.attribute.itemSize !== attribute.itemSize) throw new Error("Inconsistent item size in merged attributes.");
    if (merge.attribute.normalized !== attribute.normalized) throw new Error("Inconsistent normalized in merged attributes.");
    const mergeObjectIndex = (attribute as any).mergeObjectIndex;

    if (mergeObjectIndex === undefined) {
        throw new Error("Merge object index not defined for merging attribute.");
    }

    if (!merge.objectIndexAttributeRanges.has(mergeObjectIndex)) {
        throw new Error("Merge object index does not have attribute ranges to clear.");
    }
    for (const range of merge.objectIndexAttributeRanges.get(mergeObjectIndex)!!) {
        const offset = range[0];
        const length = range[1];
        for (let i = 0; i < length; i++) {
            (merge.attribute.array as any)[offset + i] = attribute.array[i];
        }
    }

}
