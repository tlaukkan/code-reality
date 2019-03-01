import {Component, Entity, Geometry} from "aframe";
import {AbstractComponentController} from "../AbstractComponentController";
import {ComponentControllerDefinition} from "../../AFrame";

/**
 * Modified from https://github.com/nylki/aframe-fit-texture-component.
 */
export class PictureController extends AbstractComponentController {

    public static DEFINITION = new ComponentControllerDefinition("picture",
        {
            src: {type: 'asset', default: 'https://66.media.tumblr.com/14a4d4777e95162bfd126f0c99228261/tumblr_n59pgipQxX1t0naplo1_500.jpg'},
            width: {type: 'number'},
            height: {type: 'number', default: 1.8}
        },
        false, false, (component: Component, entity: Entity, data: any) => new PictureController(component, entity, data));

    width: number | undefined;
    height: number | undefined;
    geometryWidth: number | undefined;
    geometryHeight: number | undefined;
    heightCorrection: number | undefined;

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

        this.entity.setAttribute('geometry', 'primitive: plane;width: ' + width + '; height: '+height+ ';');

        if (this.heightCorrection) {
            this.entity.object3D.position.y -= this.heightCorrection;
        }

        this.heightCorrection = height / 2;
        this.entity.object3D.position.y += this.heightCorrection;
    }

}


