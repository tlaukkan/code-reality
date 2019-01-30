import {GLTF, GLTFLoader} from "three";
import {Entity} from "aframe";
import {cloneObject3D, mergeObject3Ds} from "./merge_util";

const models = new Map<string, GLTF>();
const modelLoadedCallbacks = new Map<string, Array<() => void>>();

export async function setEntityGltfModel(entity: Entity, src: string): Promise<void> {
    const gltf = await getGltfModel(src);
    let mesh = cloneObject3D(gltf.scene) || cloneObject3D(gltf.scenes[0]);
    const mesh2 = cloneObject3D(mesh);
    mesh2.position.y = 3;

    const mergedMesh = mergeObject3Ds([mesh, mesh2]);
    mesh = mergedMesh;

    (mesh as any).animations = gltf.animations;
    entity.setObject3D('mesh', mesh);
    entity.emit('model-loaded', {format: 'gltf', model: mesh});
}

export function getGltfModel(src: string): Promise<GLTF> {
    return new Promise<GLTF>(function(resolve, reject) {

        if (!models.has(src)) {
            if (!modelLoadedCallbacks.has(src)) {
                modelLoadedCallbacks.set(src, []);
                loadGltfModel(src);
            }

            modelLoadedCallbacks.get(src)!!.push(() => {
                if (!models.has(src)) {
                    console.error("GLTF manager - reporting to waiter that loading failed: " + src);
                    reject(new Error("Loading has failed: " + src));
                } else {
                    console.info("GLTF manager - providing from loading result: " + src);
                    resolve(models.get(src)!!);
                }
            });
        } else {
            console.error("GLTF manager - providing from cache: " + src);
            resolve(models.get(src)!!);
        }

    });
}

function loadGltfModel(src: string) {
    const loader = new GLTFLoader();
    console.log("GLTF manager - loading: " + src);

    loader.load(src, function (gltf: GLTF) {
        console.log("GLTF manager - loaded: " + src);

        models.set(src, gltf);

        for (const modelLoaded of modelLoadedCallbacks.get(src)!!) {
            modelLoaded();
        }
        modelLoadedCallbacks.delete(src);
    }, undefined /* onProgress */, function (error) {
        console.error("GLTF manager - loading failed: " + src, error);
    });
}
