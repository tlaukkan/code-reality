import {Entity, Scene} from "aframe";
import {createElement} from "../../util";
import {StateSystemController} from "../state/StateSystemController";
import {getSystemController} from "../../AFrame";
import {Vector3} from "three";
import {LoaderSystemController} from "../loader/LoaderSystemController";

export class StaticSpace {

    scene: Scene;
    regionElements = new Map<string, Element>();
    loadingRegions: Set<string> = new Set();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    connected(region: string, regionOrigo: Vector3) {
        if (!this.regionElements.has(region)) {
            const regionElement = createElement('<a-entity merge region="' + region + '" position="' + regionOrigo.x + ' ' + regionOrigo.y + ' ' + regionOrigo.z + '"/>');
            this.regionElements.set(region, regionElement);
            this.scene.appendChild(regionElement);
        }
        this.addToLoadingRegions(region);
    }

    loaded(region: string) {
        this.removeFromLoadingRegions(region);
    }

    disconnected(region: string) {
        this.scene.removeChild(this.regionElements.get(region)!!);

        const elements = document.querySelectorAll('[server="' + region + '"]');
        elements.forEach(element => {
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
        });

        this.removeFromLoadingRegions(region);
    }

    private addToLoadingRegions(region: string) {
        if (!this.loadingRegions.has(region)) {
            this.loadingRegions.add(region);
            (getSystemController(this.scene, "loader-system") as LoaderSystemController).increaseLoadingCounter();
        }
    }

    private removeFromLoadingRegions(region: string) {
        if (this.loadingRegions.has(region)) {
            this.loadingRegions.delete(region);
            (getSystemController(this.scene, "loader-system") as LoaderSystemController).decreaseLoadingCounter();
        }
    }

    setRootEntity(region: string, sid: string, entityXml: string) {
        //console.log("Set root entity " + region + "/" + sid + ": " + entityXml);
        const existingElement = this.getElement(sid);
        if (existingElement) {
            // Remove old element as it is being replaced.
            this.scene.removeChild(existingElement);
        }

        const newElement = createElement(entityXml);
        const oid = newElement.getAttribute("oid");
        newElement.setAttribute("server", region);

        // If element exists with oid then update that element.
        if (oid) {
            const elements = document.querySelectorAll('[oid="' + oid + '"]');
            for (const element of elements) {
                element.setAttribute("sid", sid);
                element.setAttribute("server", region);
                return;
            }
        }

        // Add element as element does not exist yet.
        this.regionElements.get(region)!!.appendChild(newElement);

    }

    setChildEntity(region: string, parentSid: string, sid: string, entityXml: string) {
        console.log("Set child entity " + region + "/" + parentSid + "/" + sid + ": " + entityXml);
        const parentElement = this.getElement(parentSid);
        if (parentElement === undefined) {
            console.log("Parent element not found sid: " + sid);
            return;
        }
        const oldElement = this.getElement(sid);
        if (oldElement) {
            // Remove old element as it is being replaced.
            parentElement!!.removeChild(oldElement);
        }

        const newElement = createElement(entityXml);
        newElement.setAttribute("server", region);
        parentElement.appendChild(newElement);
    }

    removeEntity(region: string, sid: string) {
        console.log("Removed entity " + region + "/" + sid);
        const element = this.getElement(sid);
        if (element === undefined) {
            console.log("Element to be removed not found sid: " + sid);
            return;
        }
        if (element.parentElement) {
            element.parentElement.removeChild(element);
        }
        (getSystemController(this.scene, "state") as StateSystemController).removeStates(element);
    }

    getElement(sid: string) : Entity | undefined {
        const elements = document.querySelectorAll('[sid="' + sid + '"]');
        if (!elements || elements.length == 0) {
            return undefined;
        }
        if (elements.length == 2) {
            console.log("More than one element found with sid: " + sid);
            return undefined;
        }
        return elements.item(0) as Entity;
    }


}
