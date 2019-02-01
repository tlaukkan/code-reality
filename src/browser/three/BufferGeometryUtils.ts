/**
 * @author mrdoob, tlaukkan (typescript and extendability)
 */


import {BufferAttribute, BufferGeometry, InterleavedBufferAttribute} from "three";

/**
 * @param  {Array<THREE.BufferGeometry>} geometries
 * @param  {Boolean} useGroups
 * @return {THREE.BufferGeometry}
 */
export function mergeBufferGeometries(geometries: Array<BufferGeometry>, useGroups: boolean): BufferGeometry | null {

    const mergedGeometry = new BufferGeometry();

    const isIndexed = geometries[0].index !== null;

    const attributesUsed = new Set(Object.keys(geometries[0].attributes));
    const morphAttributesUsed = new Set(Object.keys(geometries[0].morphAttributes));

    const attributes: { [name: string]: Array<BufferAttribute|InterleavedBufferAttribute>; } = {};
    const morphAttributes: { [name: string]: Array<Array<BufferAttribute|InterleavedBufferAttribute>>; } = {};


    let offset = 0;

    for (let i = 0; i < geometries.length; ++i) {

        const geometry = geometries[i];

        // ensure that all geometries are indexed, or none

        if (isIndexed !== (geometry.index !== null)) throw new Error("Inconsistent indexed in merged geometries.");

        // gather attributes, exit early if they're different

        for (const name in geometry.attributes) {

            if (!attributesUsed.has(name)) throw new Error("Inconsistent attributes in merged geometries.");

            if (attributes[name] === undefined) attributes[name] = [];

            attributes[name].push(geometry.attributes[name]);

        }

        // gather morph attributes, exit early if they're different

        for (const name in geometry.morphAttributes) {

            if (!morphAttributesUsed.has(name)) throw new Error("Inconsistent morph attributes in merged geometries.");

            if (morphAttributes[name] === undefined) morphAttributes[name] = [];

            morphAttributes[name].push(geometry.morphAttributes[name]);

        }

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

            mergedGeometry.addGroup(offset, count, i);
            offset += count;
        }

    }

    // merge indices

    if (isIndexed) {

        let indexOffset = 0;
        const mergedIndex = [];

        for (let i = 0; i < geometries.length; ++i) {

            const index = geometries[i].index;

            for (let j = 0; j < index.count; ++j) {

                mergedIndex.push(index.getX(j) + indexOffset);

            }

            indexOffset += geometries[i].attributes.position.count;

        }

        mergedGeometry.setIndex(mergedIndex);

    }

    // merge attributes

    for (const name in attributes) {
        const mergedAttribute = mergeBufferAttributes(attributes[name]);
        mergedGeometry.addAttribute(name, mergedAttribute);
    }

    // merge morph attributes

    for (const name in morphAttributes) {

        let numMorphTargets = morphAttributes[name][0].length;

        if (numMorphTargets === 0) break;

        mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
        mergedGeometry.morphAttributes[name] = [];

        for (let i = 0; i < numMorphTargets; ++i) {

            let morphAttributesToMerge = [];

            for (let j = 0; j < morphAttributes[name].length; ++j) {

                morphAttributesToMerge.push(morphAttributes[name][j][i]);

            }

            const mergedMorphAttribute = mergeBufferAttributes(morphAttributesToMerge);
            mergedGeometry.morphAttributes[name].push(mergedMorphAttribute);

        }

    }

    return mergedGeometry;

}

/**
 * @param {Array<THREE.BufferAttribute>} attributes
 * @return {THREE.BufferAttribute}
 */
function mergeBufferAttributes(attributes: Array<BufferAttribute|InterleavedBufferAttribute>) {

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

    return new BufferAttribute(array, itemSize, normalized);

}

