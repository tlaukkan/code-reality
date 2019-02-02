import {Entity, Scene, System} from "aframe";

import {Clock, Color, DoubleSide, Mesh, MeshBasicMaterial, SphereGeometry} from "three";
import {AbstractSystemController} from "../AbstractSystemController";
import {SystemControllerDefinition} from "../../AFrame";


export class LoaderSystemController extends AbstractSystemController {


    sceneEl: Scene;
    enabled = false;

    sphereGeometry= new SphereGeometry(1, 36, 18, 0, 2 * Math.PI, 0, Math.PI);
    sphereMaterial= new MeshBasicMaterial({color: 'white', side: DoubleSide});
    sphereMesh1= new Mesh(this.sphereGeometry, this.sphereMaterial);
    //sphereMesh2= this.sphereMesh1.clone();
    //sphereMesh3= this.sphereMesh1.clone();

    public static DEFINITION = new SystemControllerDefinition(
        "loader-system",
        {},
        (system: System, scene: Scene, data: any) => new LoaderSystemController(system, scene, data)
    );

    constructor(system: System, scene: Scene, data: any) {
        super(system, scene, data);

        this.sceneEl = scene;
        this.sphereMesh1.renderOrder = 1;
    }

    init(): void {


    }

    pause(): void {

    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
        if (!this.enabled) {
            this.enabled = true;

            this.sphereMesh1.position.set(0, 0, 0);
            //this.sphereMesh2.position.set(0, 0, -15);
            //this.sphereMesh3.position.set(1, 0, -15);
            this.sceneEl.camera.add(this.sphereMesh1);
            //this.sceneEl.camera.add(this.sphereMesh2);
            //this.sceneEl.camera.add(this.sphereMesh3);

        }
    }

    remove() {
        this.sceneEl.camera.remove(this.sphereMesh1);
        //this.sceneEl.camera.remove(this.sphereMesh2);
        //this.sceneEl.camera.remove(this.sphereMesh3);
    };


}

