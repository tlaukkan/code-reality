import {Component, Entity} from "aframe";
import {Quaternion, Vector3} from "three";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate";
import {CodeRealityComponentController} from "../CodeRealityComponentController";

/**
 * Modified from https://github.com/nylki/aframe-fit-texture-component.
 */
export class BillboardController extends CodeRealityComponentController {

    public static DEFINITION = new ComponentControllerDefinition("billboard",
        {
            src: {type: 'asset', default: 'https://66.media.tumblr.com/14a4d4777e95162bfd126f0c99228261/tumblr_n59pgipQxX1t0naplo1_500.jpg'},
            width: {type: 'number'},
            height: {type: 'number', default: 1.8}
        },
        false, true, (component: Component, entity: Entity, data: any) => new BillboardController(component, entity, data));

    width: number | undefined;
    height: number | undefined;

    geometryWidth: number | undefined;
    geometryHeight: number | undefined;
    heightCorrection: number | undefined;

    cameraPosition: Vector3 = new Vector3(0,0,0);
    billboardPosition: Vector3 = new Vector3(0,0,0);
    cameraLastPosition: Vector3 = new Vector3(0,0,0);

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        const srcUrl = this.data.src;
        this.width = this.data.width;
        this.height = this.data.height;
        //console.log(this.componentName + " init: " + srcUrl);
        this.entity.setAttribute("material", "src: url(" + srcUrl + ");  side: double; transparent: true;");
    }

    update(data: any, oldData: any): void {
        if (this.data === false) return;

        if (this.geometryWidth != undefined || this.geometryHeight != undefined) {
            this.applyTransformation();
        } else {
            const textureLoaded = (e: any) => {

                const width = e.detail.texture.image.videoWidth || e.detail.texture.image.width;
                const height = e.detail.texture.image.videoHeight || e.detail.texture.image.height;

                //console.log("texture loaded: " + width + ", " + height);

                if(width === 0 || height === 0) return;

                this.geometryWidth = width;
                this.geometryHeight = height;

                this.applyTransformation();
            };
            this.entity.addEventListener('materialvideoloadeddata', textureLoaded);
            this.entity.addEventListener('materialtextureloaded', textureLoaded);
        }
    }

    remove(): void {
    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {

        this.cameraPosition.copy(this.interface.cameraEntity.object3D.position);
        this.cameraPosition = this.interface.cameraEntity.object3D.parent!!.localToWorld(this.cameraPosition);

        if (this.cameraPosition.x == this.cameraLastPosition.x &&
            this.cameraPosition.y == this.cameraLastPosition.y &&
            this.cameraPosition.z == this.cameraLastPosition.z) {
            // No need to turn billboard.
            return;
        }

        this.cameraLastPosition.copy(this.cameraPosition);

        this.billboardPosition.copy(this.entity.object3D.position);
        this.billboardPosition = this.entity.object3D.parent!!.localToWorld(this.billboardPosition);

        const direction = this.billboardPosition.sub(this.cameraPosition).normalize();
        direction.y = 0;
        direction.normalize();

        const billboardNormal = this.entity.object3D.localToWorld(new Vector3(0, 0, 1)).sub(this.entity.object3D.localToWorld(new Vector3(0, 0, 0))).normalize();
        billboardNormal.y = 0;
        billboardNormal.normalize();

        const quaternion = new Quaternion(); // create one and reuse it

        quaternion.setFromUnitVectors(billboardNormal, direction);

        const newBillboardQuaternion = quaternion.multiply(this.entity.object3D.quaternion);

        this.entity.object3D.quaternion.copy(newBillboardQuaternion);
    }

    applyTransformation() {
        const heightWithRatio = this.geometryHeight!! / this.geometryWidth!!;

        let width = this.width;
        let height = this.height;

        if (width) {
            height = width * heightWithRatio;
        } else if (height) {
            width = height / heightWithRatio;
        } else {
            height = 1.8;
            width = height / heightWithRatio;
        }

        this.entity.setAttribute('geometry', 'primitive: plane;width: ' + width + ';height: '+height+ ';');

        if (this.heightCorrection) {
            this.entity.object3D.position.y -= this.heightCorrection;
        }

        this.heightCorrection = height / 2;
        this.entity.object3D.position.y += this.heightCorrection;
    }

}


