import {Component, Entity} from "aframe";
import {AbstractComponentController} from "../AbstractComponentController";
import {ComponentControllerDefinition} from "../../AFrame";

/**
 * Modified from https://github.com/nylki/aframe-fit-texture-component.
 */
export class PictureController extends AbstractComponentController {

    public static DEFINITION = new ComponentControllerDefinition("picture", {type: 'string', default: 'https://66.media.tumblr.com/14a4d4777e95162bfd126f0c99228261/tumblr_n59pgipQxX1t0naplo1_500.jpg'}, false, false, (component: Component, entity: Entity, data: any) => new PictureController(component, entity, data));

    width: number | undefined;
    height: number | undefined;
    heightCorrection: number | undefined;

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


