import {Component, Entity} from "aframe";
import {AbstractComponentController} from "../AbstractComponentController";
import {ComponentControllerDefinition} from "../../AFrame";
import {Quaternion, Vector3} from "three";

/**
 * Modified from https://github.com/nylki/aframe-fit-texture-component.
 */
export class BillboardController extends AbstractComponentController {

    public static DEFINITION = new ComponentControllerDefinition("billboard", {type: 'string', default: 'https://66.media.tumblr.com/14a4d4777e95162bfd126f0c99228261/tumblr_n59pgipQxX1t0naplo1_500.jpg'},
        false, true, (component: Component, entity: Entity, data: any) => new BillboardController(component, entity, data));

    width: number | undefined;
    height: number | undefined;
    heightCorrection: number | undefined;
    cameraLastPosition: Vector3 = new Vector3(0,0,0);

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        const srcUrl = new URL(this.data).toString();
        //console.log(this.componentName + " init: " + srcUrl);
        this.entity.setAttribute("material", "src: url(" + srcUrl + ");  side: double;");
    }

    update(data: any, oldData: any): void {
        if (this.data === false) return;

        if (this.width != undefined || this.height != undefined) {
            this.applyTransformation();
        } else {
            const textureLoaded = (e: any) => {

                const width = e.detail.texture.image.videoWidth || e.detail.texture.image.width;
                const height = e.detail.texture.image.videoHeight || e.detail.texture.image.height;

                //console.log("texture loaded: " + width + ", " + height);

                if(width === 0 || height === 0) return;

                this.width = width;
                this.height = height;

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

        const cameraPosition = this.interface.cameraEntity.object3D.parent!!.localToWorld(this.interface.cameraEntity.object3D.position.clone());

        if (cameraPosition.x == this.cameraLastPosition.x &&
            cameraPosition.y == this.cameraLastPosition.y &&
            cameraPosition.z == this.cameraLastPosition.z) {
            // No need to turn billboard.
            return;
        }

        this.cameraLastPosition = cameraPosition.clone();

        const billboardPosition = this.entity.object3D.parent!!.localToWorld(this.entity.object3D.position.clone());

        const direction = billboardPosition.sub(cameraPosition).normalize();
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
        const heightWithRatio = this.height!! / this.width!!;

        let width = 2;
        let height = 0;

        if (width) {
            height = width * heightWithRatio;
        } else if (height) {
            width = height / heightWithRatio;
        } else {
            width = 2.0;
            height = width * heightWithRatio;
        }

        this.entity.setAttribute('geometry', 'primitive: plane;width: ' + width + '; height: '+height+ ';');

        if (this.heightCorrection) {
            this.entity.object3D.position.y -= this.heightCorrection;
        }

        this.heightCorrection = height / 2;
        this.entity.object3D.position.y += this.heightCorrection;
    }

}


