import {Scene, System} from "aframe";

import {DoubleSide, Mesh, MeshBasicMaterial, SphereGeometry} from "three";
import {AbstractSystemController, SystemControllerDefinition} from "aframe-typescript-boilerplate";

export class LoaderSystemController extends AbstractSystemController {


    sceneEl: Scene;

    loadingCounter = 0;
    added = false;

    loaderGeometry= new SphereGeometry(1, 36, 18, 0, 2 * Math.PI, 0, Math.PI);
    loaderMaterial= new MeshBasicMaterial({color: 'white', side: DoubleSide, depthTest: false, transparent: true});
    loaderObject= new Mesh(this.loaderGeometry, this.loaderMaterial);
    sphereGeometry = new SphereGeometry(0.01, 36, 18, 0, 2 * Math.PI, 0, Math.PI);
    sphereMaterial= new MeshBasicMaterial({color: 'gray', depthTest: false, transparent: true});
    sphereMesh1= new Mesh(this.sphereGeometry, this.sphereMaterial);
    sphereMesh2= this.sphereMesh1.clone();
    sphereMesh3= this.sphereMesh1.clone();

    public static DEFINITION = new SystemControllerDefinition(
        "loader-system",
        {},
        (system: System, scene: Scene, data: any) => new LoaderSystemController(system, scene, data)
    );

    constructor(system: System, scene: Scene, data: any) {
        super(system, scene, data);

        this.sceneEl = scene;
        this.loaderObject.renderOrder = 1;

        this.loaderObject.position.set(0, 0, 0);
        this.sphereMesh1.position.set(-0.05, 0, -0.3);
        this.sphereMesh1.renderOrder = 2;
        this.sphereMesh2.position.set(0, 0, -0.3);
        this.sphereMesh2.renderOrder = 2;
        this.sphereMesh3.position.set(0.05, 0, -0.3);
        this.sphereMesh3.renderOrder = 2;

        this.loaderObject.add(this.sphereMesh1);
        this.loaderObject.add(this.sphereMesh2);
        this.loaderObject.add(this.sphereMesh3);

    }

    init(): void {


    }

    pause(): void {

    }

    play(): void {
    }

    progressTime: number = 0;

    tick(time: number, timeDelta: number): void {

        this.progressTime += timeDelta < 25 ? timeDelta : 25;

        if (this.loadingCounter > 0) {
            if (!this.added) {
                this.added = true;
                this.sceneEl.camera.add(this.loaderObject);
            }

            this.sphereMesh1.visible = Math.floor(this.progressTime / 150) % 3 == 0;
            this.sphereMesh2.visible = Math.floor(this.progressTime / 150) % 3 == 1;
            this.sphereMesh3.visible = Math.floor(this.progressTime / 150) % 3 == 2;
        }  else {
            if (this.added) {
                this.added = false;
                this.sceneEl.camera.remove(this.loaderObject);
            }
        }

    }

    increaseLoadingCounter() {
        this.loadingCounter ++;
        console.log("loading counter increase: " + this.loadingCounter);
    };

    decreaseLoadingCounter() {
        if (this.loadingCounter == 0) {
            console.warn("Notify loaded attempting to drop loading counter lower than zero.");
        }
        this.loadingCounter --;
        console.log("loading counter decrease: " + this.loadingCounter);
    };


}

