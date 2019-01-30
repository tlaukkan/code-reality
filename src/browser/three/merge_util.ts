import {BufferGeometry, BufferGeometryUtils, Group, Material, Mesh, Object3D} from "three";
require('./BufferGeometryUtils.js');

export function mergeObject3Ds(objects: Array<Object3D>) {
    const geometryDataMap = new Map<string, Array<GeometryData>>();
    for (const object of objects) {
        collectBufferGeometries(object, geometryDataMap);
    }

    const mergedGeometries = new Array<GeometryData>();
    for (const geometryId of geometryDataMap.keys()) {
        const geometryDataArray = geometryDataMap.get(geometryId)!!;
        console.log(geometryId + ": " + geometryDataMap.get(geometryId)!!.length);
        const material = geometryDataArray[0].material;
        const geometries = new Array<BufferGeometry>();
        for (const geometryData of geometryDataArray) {
            geometries.push(geometryData.geometry);
        }

        const mergedGeometry = mergeBufferGeometries(geometries);
        mergedGeometries.push(new GeometryData(mergedGeometry, material));
    }

    console.log(mergedGeometries.length);

    const group = new Group();
    for (const geometryData of mergedGeometries) {
        group.add(new Mesh(geometryData.geometry, geometryData.material));
    }
    return group;
}

class GeometryData {
    geometry: BufferGeometry;
    material: Material | Material [];


    constructor(geometry: BufferGeometry, material: Material | Material []) {
        this.geometry = geometry;
        this.material = material;
    }
}

function collectBufferGeometries(child: Object3D, geometries: Map<string, Array<GeometryData>>) {
    child.updateMatrix();
    child.updateMatrixWorld(true);
    //console.log(child.type);
    if (child.type == "Mesh") {
        const mesh = child as Mesh;
        const geometryUuid = mesh.geometry.uuid;
        const geometry = mesh.geometry.clone();

        //console.log(geometry.type);
        if (geometry.type == "BufferGeometry") {
            const bufferGeometry = geometry as BufferGeometry;
            const material = mesh.material;

            geometry.applyMatrix(mesh.matrixWorld);

            if (!geometries.has(geometryUuid)) {
                geometries.set(geometryUuid, []);
            }
            geometries.get(geometryUuid)!!.push(new GeometryData(bufferGeometry, material));
        }
    }

    if (child.children && child.children.length > 0) {
        collectChildBufferGeometries(child.children, geometries);
    }
}

function collectChildBufferGeometries(children: Object3D[], geometries: Map<string, Array<GeometryData>>) {
    for (const child of children) {
        collectBufferGeometries(child, geometries);
    }
}

export function cloneObject3D(source: Object3D) {

    const target = cloneObject3DCore(source);

    target.name = source.name;
    target.up.copy( source.up );
    target.position.copy( source.position );
    target.quaternion.copy( source.quaternion );
    target.scale.copy( source.scale );
    target.matrix.copy( source.matrix );
    target.matrixWorld.copy( source.matrixWorld );
    target.matrixAutoUpdate = source.matrixAutoUpdate;
    target.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;
    target.layers.mask = source.layers.mask;
    target.visible = source.visible;
    target.castShadow = source.castShadow;
    target.receiveShadow = source.receiveShadow;
    target.frustumCulled = source.frustumCulled;
    target.renderOrder = source.renderOrder;
    target.userData = JSON.parse( JSON.stringify( source.userData ) );

    for ( let i = 0; i < source.children.length; i ++ ) {
        const child = source.children[ i ];
        target.add(cloneObject3D(child));
    }

    return target;

}

function cloneObject3DCore(source: Object3D): Object3D {
    if (source.type == "Mesh") {
        const target = new Mesh((source as Mesh).geometry, (source as Mesh).material);
        Object3D.prototype.clone.call(source, target);
        return target;
    } else {
        return new (source as any).constructor();
    }
}

function mergeBufferGeometries(geometries: Array<BufferGeometry>): BufferGeometry {
    return BufferGeometryUtils.mergeBufferGeometries(geometries);
}

