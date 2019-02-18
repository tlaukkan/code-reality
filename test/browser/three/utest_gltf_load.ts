import { expect } from 'chai';
import {getGltfModel} from "../../../src/browser/three/gltf_load";
import {BufferGeometry, GeometryUtils, Group, Material, Mesh, Object3D} from "three";
import {cloneObject3D, mergeObject3Ds, ObjectMerge} from "../../../src/browser/three/merge_util";

describe('GLTF model loading tests.', () => {

    /*it('Test loading GLTF model.', async () => {

        const src = "https://cdn.jsdelivr.net/gh/tlaukkan/aframe-asset-collection@0.0.3/primitives/cube.glb";
        const gltf = await getGltfModel(src);

        const scene = gltf.scene;
        const scene2 = cloneObject3D(gltf.scene);
        scene2.position.x = 1;

        const objects = new Array<Object3D>();
        objects.push(scene);
        objects.push(scene2);
        const merge = new ObjectMerge();
        await mergeObject3Ds(merge, objects);

        //console.log(group.children.length);

    });*/

});


