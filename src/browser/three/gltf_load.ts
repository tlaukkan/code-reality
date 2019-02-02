import {GLTF, GLTFLoader} from "three";
import {Entity} from "aframe";
import {cloneObject3D} from "./merge_util";

const models = new Map<string, GLTF>();
const modelLoadedCallbacks = new Map<string, Array<() => void>>();

export async function setEntityGltfModel(entity: Entity, src: string): Promise<void> {
    const gltf = await getGltfModel(src);
    let mesh = cloneObject3D(gltf.scene) || cloneObject3D(gltf.scenes[0]);
    (mesh as any).animations = gltf.animations;
    entity.setObject3D('mesh', mesh);
    entity.emit('model-loaded', {format: 'gltf', model: mesh});
}

export function getGltfModel(src: string): Promise<GLTF> {
    return new Promise<GLTF>(function(resolve, reject) {

        if (!models.has(src)) {
            if (!modelLoadedCallbacks.has(src)) {
                modelLoadedCallbacks.set(src, []);
                loadGltfModelWithDelay(src).then(() => {
                    modelLoadedCallbacks.get(src)!!.push(() => {
                        invokeCallbackWithDelay(src, reject, resolve);
                    });
                });
            } else {
                modelLoadedCallbacks.get(src)!!.push(() => {
                    invokeCallbackWithDelay(src, reject, resolve);
                });
            }
        } else {
            setTimeout(() => {
                resolve(models.get(src)!!);
            }, 50);
        }

    });
}

function invokeCallbackWithDelay(src: string, reject: ((error: Error) => void), resolve: ((gltf: GLTF) => void)) {
    if (!models.has(src)) {
        console.error("GLTF manager - reporting to waiter that loading failed: " + src);
        reject(new Error("Loading has failed: " + src));
    } else {
        setTimeout(() => {
            resolve(models.get(src)!!);
        }, 50);
    }
}

function loadGltfModelWithDelay(src: string) {
    return new Promise(function (resolve, reject) {
        try {
            setTimeout(() => {
                loadGltfModel(src);
                resolve();
            }, Math.random() * 200);
        } catch (error) {
            reject(error);
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

