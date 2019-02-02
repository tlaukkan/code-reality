import {Entity, Scene, System, utils} from "aframe";

import {Clock, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene as ThreeScene, SphereGeometry} from "three";
import {AbstractSystemController} from "../AbstractSystemController";
import {SystemControllerDefinition} from "../../AFrame";
import {Camera} from "three";

var ATTR_NAME = 'custom-loading-screen';
var LOADER_TITLE_CLASS = 'a-loader-title';


export class LoaderSystemController extends AbstractSystemController {


    sceneEl: Scene;
    titleEl: Element | undefined;

    public static DEFINITION = new SystemControllerDefinition(
        "loader-system",
        {},
        (system: System, scene: Scene, data: any) => new LoaderSystemController(system, scene, data)
    );

    constructor(system: System, scene: Scene, data: any) {
        super(system, scene, data);

        this.sceneEl = scene;

    }

    init(): void {

        // It catches vrdisplayactivate early to ensure we can enter VR mode after the scene loads.
        window.addEventListener('vrdisplayactivate', async () => {
            var vrManager = this.sceneEl.renderer.vr;
            var vrDisplay = await this.getVrDisplay();

            vrManager.setDevice(vrDisplay);
            vrManager.enabled = true;
            if (!vrDisplay.isPresenting) {
                return vrDisplay.requestPresent([{source: this.sceneEl.canvas}]).then(function () {}, function () {});
            }
        });

        //var loaderAttribute = this.sceneEl.hasAttribute(ATTR_NAME) ? this.styleParser.parse(this.sceneEl.getAttribute(ATTR_NAME)) : undefined;
        var dotsColor = 'white';
        var backgroundColor = 'red';
        var loaderEnabled = true;

        if (!loaderEnabled) { return; }

        var loaderScene= new ThreeScene();
        var sphereGeometry= new SphereGeometry(0.20, 36, 18, 0, 2 * Math.PI, 0, Math.PI);
        var sphereMaterial= new MeshBasicMaterial({color: dotsColor});
        var sphereMesh1= new Mesh(sphereGeometry, sphereMaterial);
        var sphereMesh2= sphereMesh1.clone();
        var sphereMesh3= sphereMesh1.clone();
        var camera= new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.0005, 10000);
        var clock= new Clock();
        var time= 0;
        var render= () => {
            this.sceneEl!!.renderer.render(loaderScene, camera);
            time = clock.getElapsedTime() % 4;
            sphereMesh1.visible = time >= 1;
            sphereMesh2.visible = time >= 2;
            sphereMesh3.visible = time >= 3;
        };


        loaderScene.background = new Color(backgroundColor);
        loaderScene.add(camera);
        sphereMesh1.position.set(-1, 0, -15);
        sphereMesh2.position.set(0, 0, -15);
        sphereMesh3.position.set(1, 0, -15);
        camera.add(sphereMesh1);
        camera.add(sphereMesh2);
        camera.add(sphereMesh3);
        this.setupTitle();

        // Delay 200ms to avoid loader flashes.
        setTimeout(() => {
            if (this.sceneEl!!.hasLoaded) { return; }
            this.resize(camera);
            (this.titleEl!! as any).style.display = 'block';
            window.addEventListener('resize', () => { this.resize(camera); });
            this.sceneEl!!.renderer.setAnimationLoop(render);
        }, 200);

    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
        //console.log((this.sceneEl as any).getCanvasSize);
    }

    remove() {
        window.removeEventListener('resize', this.resize);
        if (!this.titleEl) { return; }
        // Hide title.
        (this.titleEl!! as any).style.display = 'none';
    };

    resize(camera: any) {
        var size = this.getCanvasSize();
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        // Notify renderer of size change.
        this.sceneEl!!.renderer.setSize(size.width, size.height, false);
    }

    setupTitle() {
        this.titleEl = document.createElement('div');
        this.titleEl.className = LOADER_TITLE_CLASS;
        this.titleEl.innerHTML = document.title;
        (this.titleEl as any).style.display = 'none';
        this.sceneEl!!.appendChild(this.titleEl);
    }

    getCanvasSize () {
        const embedded = this.sceneEl.hasAttribute("embedded");
        const isVr= this.sceneEl.is('vr-mode');
        const canvasEl = document.getElementsByClassName("a-canvas")[0] as Element;
        if (embedded) {
            return {
                height: canvasEl.parentElement!!.offsetHeight,
                width: canvasEl.parentElement!!.offsetWidth
            };
        }
        return this.getMaxSize({width: 1920, height: 1920}, isVr);
    }

    getMaxSize (maxSize: any, isVR: boolean) {
        var aspectRatio;
        var size;
        var pixelRatio = window.devicePixelRatio;

        size = {height: document.body.offsetHeight, width: document.body.offsetWidth};
        if (!maxSize || isVR || (maxSize.width === -1 && maxSize.height === -1)) {
            return size;
        }

        if (size.width * pixelRatio < maxSize.width &&
            size.height * pixelRatio < maxSize.height) {
            return size;
        }

        aspectRatio = size.width / size.height;

        if ((size.width * pixelRatio) > maxSize.width && maxSize.width !== -1) {
            size.width = Math.round(maxSize.width / pixelRatio);
            size.height = Math.round(maxSize.width / aspectRatio / pixelRatio);
        }

        if ((size.height * pixelRatio) > maxSize.height && maxSize.height !== -1) {
            size.height = Math.round(maxSize.height / pixelRatio);
            size.width = Math.round(maxSize.height * aspectRatio / pixelRatio);
        }

        return size;
    }

    getVrDisplay(): Promise<VRDisplay> {
        return new Promise<VRDisplay>(function (resolve, reject) {
            try {
                if ((navigator as any).xr) {
                    (navigator as any).xr.requestDevice().then(function (device: any) {
                        device.supportsSession({immersive: true, exclusive: true}).then(function () {
                            resolve(device as VRDisplay);
                        });
                    });
                } else {
                    if ((navigator as any).getVRDisplays) {
                        navigator.getVRDisplays().then(function (displays) {
                            resolve((displays.length && displays[0]) as VRDisplay);
                        });
                    }
                }
                reject("unable to resolve VR display.");
            } catch (error) {
                reject(error);
            }
        });
    }

}

