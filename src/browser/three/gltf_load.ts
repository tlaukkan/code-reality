import {
    BufferGeometry,
    GLTF,
    GLTFLoader, LinearMipMapNearestFilter,
    Material,
    Mesh,
    MeshBasicMaterial, NearestMipMapLinearFilter,
    NearestMipMapNearestFilter,
    Object3D
} from "three";
import {Entity} from "aframe";
import {cloneObject3D, ObjectMerge} from "./merge_util";

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
                loadGltfModelQueue(src).then(() => {
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


async function loadGltfModelQueue(src: string) {
    while(!(await attemptGltfModelWithDelay(src))) { }
}

function attemptGltfModelWithDelay(src: string): Promise<boolean> {
    return new Promise(function (resolve, reject) {
        try {
            setTimeout(async () => {
                if (loading) {
                    resolve(false);
                    return;
                }
                await loadGltfModel(src);
                resolve(true);
            }, Math.random() * 300);
        } catch (error) {
            reject(error);
        }
    });
}

let loading = false;

function setMaterialAnisotropy(material: MeshBasicMaterial) {
    if (material.map) {
        material.map.anisotropy = 2;
        material.map.minFilter = NearestMipMapLinearFilter;
    }
}

function setObjectMaterialAnisotropy(object: Object3D) {
    if (object.type == "Mesh") {
        const mesh = object as Mesh;
        if (mesh.material instanceof Array) {
            const materials = mesh.material as Array<Material>;
            for (const material of materials) {
                setMaterialAnisotropy(material as MeshBasicMaterial);
            }
        } else if (mesh.material) {
            setMaterialAnisotropy(mesh.material as MeshBasicMaterial);
        }
    }

    if (object.children) {
        for (const child of object.children) {
            setObjectMaterialAnisotropy(child);
        }
    }
}

async function loadGltfModel(src: string) {
    loading = true;
    const loader = new GLTFLoader();

    loader.load(src, function (gltf: GLTF) {
        let scene = (gltf.scene || gltf.scenes[0]);
        setObjectMaterialAnisotropy(scene);

        //console.log("GLTF manager - loaded: " + src);
        models.set(src, gltf);
        for (const modelLoaded of modelLoadedCallbacks.get(src)!!) {
            modelLoaded();
        }
        modelLoadedCallbacks.delete(src);
        loading = false;
    }, undefined /* onProgress */, function (error) {
        console.error("GLTF manager - loading failed: " + src, error);
        for (const modelLoaded of modelLoadedCallbacks.get(src)!!) {
            modelLoaded();
        }
        modelLoadedCallbacks.delete(src);
        loading = false;
    });
}

