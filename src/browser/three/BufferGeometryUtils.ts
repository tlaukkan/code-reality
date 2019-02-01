/**
 * @author mrdoob, tlaukkan (typescript and extendability)
 */


import {BufferAttribute, BufferGeometry, InterleavedBufferAttribute, Material} from "three";

export class BufferGeometryMerge {
    groupOffset = 0;
    indexOffset = 0;
    readonly indexMerge = new Array<number>();
    readonly attributeMerges: Map<string, BufferAttributeMerge> = new Map();
    material: Material | Material [];
    geometry = new BufferGeometry();
    vertexCount = 0;

    constructor(material: Material | Material[]) {
        this.material = material;
    }
}

export function mergeBufferGeometries(merge: BufferGeometryMerge, geometries: Array<BufferGeometry>, useGroups: boolean): BufferGeometry {

    const mergedGeometry = merge.geometry;

    if (geometries.length > 0) {
        const isIndexed = geometries[0].index !== null;

        //const merge = new BufferGeometryMerge();

        //let groupOffset = 0;
        //let indexOffset = 0;
        //const indexMerge = [];
        //const attributeMerges: Map<string, BufferAttributeMerge> = new Map();

        //const morphAttributesUsed = new Set(Object.keys(geometries[0].morphAttributes));
        //const morphAttributes: { [name: string]: Array<Array<BufferAttribute|InterleavedBufferAttribute>>; } = {};
        //const morphAttributesMerges: Map<string, Array<BufferAttributeMerge>> = new Map();

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

                attributes[name].push(geometry.attributes[name]);

            }

            // gather morph attributes, exit early if they're different

            /*for (const name in geometry.morphAttributes) {

                if (!morphAttributesUsed.has(name)) throw new Error("Inconsistent morph attributes in merged geometries.");

                if (morphAttributes[name] === undefined) morphAttributes[name] = [];

                morphAttributes[name].push(geometry.morphAttributes[name]);

            }*/

            // gather .userData

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

                    const x = 0;
                    merge.indexMerge.push(index.getX(j) + merge.indexOffset);
                    //merge.indexMerge.push(index.getX(j) + x);
                }

                merge.indexOffset += geometries[i].attributes.position.count;

            }

            mergedGeometry.setIndex(merge.indexMerge);

        }


        for (const name in attributes) {
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
            const mergedAttribute = mergeBufferAttributes(merge.attributeMerges.get(name)!!, name, attributes[name]);
            if (!mergedGeometry.attributes[name]) {
                mergedGeometry.addAttribute(name, mergedAttribute.attribute);
            }
        }
    }

    // merge attributes



    // merge morph attributes

    /*for (const name in morphAttributes) {

        let numMorphTargets = morphAttributes[name][0].length;

        if (numMorphTargets === 0) break;

        mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
        mergedGeometry.morphAttributes[name] = [];

        for (let i = 0; i < numMorphTargets; ++i) {

            let morphAttributesToMerge = [];

            for (let j = 0; j < morphAttributes[name].length; ++j) {

                morphAttributesToMerge.push(morphAttributes[name][j][i]);

            }

            const mergedMorphAttribute = mergeBufferAttributes(morphAttributesMerges.get(name)!![i], name, morphAttributesToMerge);
            mergedGeometry.morphAttributes[name].push(mergedMorphAttribute.attribute);

        }

    }*/

    /*for (const attributeName in mergedGeometry.attributes) {
        mergedGeometry.attributes[attributeName].
    }*/

    for (const attributeMerge of merge.attributeMerges.values()) {
        attributeMerge.attribute.needsUpdate = true;
    }
    //mergedGeometry.setDrawRange(0, merge.vertexCount);
    //mergedGeometry.computeVertexNormals();
    //console.log("merged vertex count: "+ merge.vertexCount);
    return mergedGeometry;

}

class BufferAttributeMerge {
    offset: number;
    attribute: BufferAttribute;


    constructor(attribute: BufferAttribute, offset: number) {
        this.offset = offset;
        this.attribute = attribute;
    }
}

/**
 * @param {Array<THREE.BufferAttribute>} attributes
 * @return {THREE.BufferAttribute}
 */
function mergeBufferAttributesOld(attributes: Array<BufferAttribute|InterleavedBufferAttribute>) {

    let TypedArray: any;
    let itemSize: any;
    let normalized;
    let arrayLength = 0;

    for (let i = 0; i < attributes.length; ++i) {

        const attribute = attributes[i];

        if ((attribute as any).isInterleavedBufferAttribute) throw new Error("Attributes had interleaved attributes..");

        if (TypedArray === undefined) TypedArray = attribute.array.constructor;
        if (TypedArray !== attribute.array.constructor) throw new Error("Inconsistent array type in merged attributes.");

        if (itemSize === undefined) itemSize = attribute.itemSize;
        if (itemSize !== attribute.itemSize) throw new Error("Inconsistent item size in merged attributes.");

        if (normalized === undefined) normalized = attribute.normalized;
        if (normalized !== attribute.normalized) throw new Error("Inconsistent normalized in merged attributes.");

        arrayLength += attribute.array.length;

    }

    const array = new TypedArray(arrayLength);
    let offset = 0;

    for (let i = 0; i < attributes.length; ++i) {

        array.set(attributes[i].array, offset);

        offset += attributes[i].array.length;

    }

    return new BufferAttributeMerge(new BufferAttribute(array, itemSize, normalized), offset);
}

function mergeBufferAttributes(merge: BufferAttributeMerge, name: string, attributes: Array<BufferAttribute|InterleavedBufferAttribute>) {

    console.log("Merging attribute: " + name + " with ");
    /*
    const arrayLength = sumArrayLength(attributes);
    const merge = createBufferAttributeMerge(attributes, arrayLength);
    */
    for (const attribute of attributes) {
        if ((attribute as any).isInterleavedBufferAttribute) throw new Error("Attributes had interleaved attributes..");
        mergeBufferAttribute(merge, attribute as BufferAttribute);
    }
    return merge;
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

function mergeBufferAttribute(merge: BufferAttributeMerge, attribute: BufferAttribute) {
    if (merge.attribute.itemSize !== attribute.itemSize) throw new Error("Inconsistent item size in merged attributes.");
    if (merge.attribute.normalized !== attribute.normalized) throw new Error("Inconsistent normalized in merged attributes.");

    (merge.attribute.array as any).set(attribute.array, merge.offset);
    // Increase merge attribute count by 1.
    merge.attribute.count = merge.attribute.count + attribute.array.length / attribute.itemSize;
    //console.log(merge.attribute.count);
    merge.offset += attribute.array.length;
}

