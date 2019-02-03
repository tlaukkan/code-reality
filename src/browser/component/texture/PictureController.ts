import {Component, Entity} from "aframe";
import {AbstractComponentController} from "../AbstractComponentController";
import {ComponentControllerDefinition} from "../../AFrame";
import {Material, Mesh, PlaneBufferGeometry, PlaneGeometry} from "three";

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
        console.log(this.componentName + " init: " + srcUrl);

        this.entity.setAttribute("material", "src: url(" + srcUrl + ")");
    }

    update(data: any, oldData: any): void {
        if (this.data === false) return;

        if (this.width != undefined || this.height != undefined) {
            this.applyTransformation();
        } else {
            const textureLoaded = (e: any) => {

                const width = e.detail.texture.image.videoWidth || e.detail.texture.image.width;
                const height = e.detail.texture.image.videoHeight || e.detail.texture.image.height;

                console.log("texture loaded: " + width + ", " + height);

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
        //const geometry = this.entity.getAttribute('geometry');

        const heightWithRatio = this.height!! / this.width!!;

        let width = 2;
        let height = 0;

        if (width) {
            //geometry.height = geometry.width * heightWithRatio;
            height = width * heightWithRatio;
            //console.log("texture fit setting geometry height: " + height);
            //this.entity.setAttribute('height', height);
            //this.entity.setAttribute('geometry', 'primitive: plane;width: ' + width + '; height: '+height+ ';');
        } else if (height) {
            //const height = geometry.height;
            width = height / heightWithRatio;
            console.log("texture fit setting geometry width: " + width);
            //this.entity.setAttribute('width', width);
            //this.entity.setAttribute('geometry', 'primitive: plane;width: ' + width + '; height: '+height+ ';');
        } else {
            // Neither width nor height is set.
            width = 2.0;
            height = width * heightWithRatio;
            //this.entity.setAttribute('width', '' + width);
            //this.entity.setAttribute('height', height);
            //this.entity.setAttribute('geometry', 'primitive: plane;width: ' + width + '; height: '+height+ ';');
        }

        console.log("texture fit setting geometry height: " + height);
        console.log("texture fit setting geometry width: " + width);

        this.entity.setAttribute('geometry', 'primitive: plane;width: ' + width + '; height: '+height+ ';');

        if (this.heightCorrection) {
            this.entity.object3D.position.y -= this.heightCorrection;
            console.log("negated height correction: " + this.heightCorrection);
        }

        this.heightCorrection = height / 2;
        this.entity.object3D.position.y += this.heightCorrection;
        console.log("applied height correction: " + this.heightCorrection);

        /*console.log(this.entity.object3D);
        const material= this.entity.getAttribute("material") as Material;
        console.log(material);

        const geometry = new PlaneBufferGeometry(width, height, 1, 1);

        if (this.currentMesh) {
            this.entity.object3D.remove(this.currentMesh);
        }
        this.currentMesh = new Mesh(geometry, material);
        //this.currentMesh.material = material;
        this.entity.object3D.add(this.currentMesh);*/

    }

}


