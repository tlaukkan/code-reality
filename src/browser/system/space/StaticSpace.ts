import {Entity, Scene} from "aframe";
import {StateSystemController} from "../state/StateSystemController";
import {Vector3} from "three";
import {LoaderSystemController} from "../loader/LoaderSystemController";
import {MergeSystemController} from "../merge/MergeSystemController";
import {ModelController} from "../merge/ModelController";
import {Element as XmlElement, js2xml, xml2js} from "xml-js";
import {createElement, getComponentController, getSystemController} from "aframe-typescript-boilerplate";
export class StaticSpace {

    scene: Scene;
    regionElements = new Map<string, Element>();
    loadingRegions: Set<string> = new Set();
    ignoreNextSetSids: Array<string> = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    connected(region: string, regionOrigo: Vector3) {
        if (!this.regionElements.has(region)) {
            const regionElement = createElement('<a-entity merge shadow region="' + region + '" position="' + regionOrigo.x + ' ' + regionOrigo.y + ' ' + regionOrigo.z + '"/>');
            this.regionElements.set(region, regionElement);
            this.scene.appendChild(regionElement);
        }
        this.addToLoadingRegions(region);
    }

    loaded(region: string) {
        this.removeFromLoadingRegions(region);
    }

    disconnected(region: string) {
        if (this.regionElements.has(region)) {
            const regionElement = this.regionElements.get(region)!!;
            if (regionElement.parentElement) {
                regionElement.parentElement!!.removeChild(regionElement);
            }
            this.regionElements.delete(region);
        }

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
            console.log("added to loading regions: " + region);
        }
    }

    private removeFromLoadingRegions(region: string) {
        if (this.loadingRegions.has(region)) {
            this.loadingRegions.delete(region);
            (getSystemController(this.scene, "loader-system") as LoaderSystemController).decreaseLoadingCounter();
            console.log("removed from loading regions: " + region);
        }
    }

    setRootEntity(region: string, sid: string, entityXml: string) {

        if (this.ignoreNextSetSids.indexOf(sid) > -1) {
            this.ignoreNextSetSids.splice(this.ignoreNextSetSids.indexOf(sid), 1);
            return;
        }

        //console.log("Set root entity " + region + "/" + sid + ": " + entityXml);
        const existingElement = this.getElement(sid);
        if (existingElement) {
            // Remove old element as it is being replaced.
            //existingElement.parentElement!!.removeChild(existingElement);
            const newElement = xml2js(entityXml).elements[0];
            this.recursiveUpdate(existingElement, newElement);

            const modelController = getComponentController(existingElement, "model") as ModelController | undefined;
            if (modelController && modelController.merge) {
                const mergeSystem = getSystemController(this.scene, "merge") as MergeSystemController;
                mergeSystem.updateMergeChild(modelController.merge!!, existingElement);
            }

        } else {
            // If element exists with oid then update that element.

            const newElement = createElement(entityXml);
            const oid = newElement.getAttribute("oid");
            newElement.setAttribute("server", region);
            newElement.setAttribute("collidable", "");

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
    }

    recursiveUpdate(existingElement: Element, newElement: XmlElement) {
        const existingAttributeNames = new Set(existingElement.getAttributeNames());

        if (newElement.attributes) {
            for (const attributeName in newElement.attributes) {
                const value = newElement.attributes[attributeName]!!.toString();

                if (attributeName != "model") {
                    existingElement.setAttribute(attributeName, value);
                }

                existingAttributeNames.delete(attributeName);
            }
        }

        // Remove attribute names not present in new element.
        for (const attributeName of existingAttributeNames) {
            existingElement.removeAttribute(attributeName);
        }

        const existingChildElements = new Map<string, Element>();
        for (const child of existingElement.children) {
            const sid = child.getAttribute("sid");
            if (sid) {
                existingChildElements.set(sid, child);
            }

        }

        if (newElement.elements) {
            for (const newChild of newElement.elements) {
                const sid = newChild.attributes!!["sid"]!!.toString();
                if (existingChildElements.has(sid)) {
                    const existingChild = existingChildElements.get("sid")!!;
                    // Update child recursively.
                    this.recursiveUpdate(existingChild, newChild);
                    existingChildElements.delete(sid);
                } else {
                    // Append child as new element.
                    existingElement.appendChild(createElement(js2xml(newChild)));
                }
            }
        }

        // Remove existing children with sid not present in new element.
        for (const existingChild of existingChildElements.values()) {
            existingElement.removeChild(existingChild);
        }

    }

    setChildEntity(region: string, parentSid: string, sid: string, entityXml: string) {
        if (this.ignoreNextSetSids.indexOf(sid) > -1) {
            this.ignoreNextSetSids.splice(this.ignoreNextSetSids.indexOf(sid), 1);
            return;
        }

        //console.log("Set child entity " + region + "/" + parentSid + "/" + sid + ": " + entityXml);
        const parentElement = this.getElement(parentSid);
        if (parentElement === undefined) {
            //console.log("Parent element not found sid: " + sid);
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
        //console.log("Removed entity " + region + "/" + sid);
        const element = this.getElement(sid);
        if (element === undefined) {
            //console.log("Element to be removed not found sid: " + sid);
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
        if (elements.length > 1) {
            //console.log("More than one element found with sid: " + sid);
            return undefined;
        }
        return elements.item(0) as Entity;
    }


}
