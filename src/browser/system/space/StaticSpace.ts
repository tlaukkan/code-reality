import {Entity, Scene} from "AFrame";
import {createElement} from "../../util";

export class StaticSpace {

    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    connected(serverUrl: string) {

    }

    disconnected(serverUrl: string) {
        const elements = document.querySelectorAll('[server="' + serverUrl + ']');
        elements.forEach(element => {
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
        })
    }

    setRootEntity(serverUrl: string, sid: string, entityXml: string) {
        console.log("Set root entity " + serverUrl + "/" + sid + ": " + entityXml);
        const existingElement = this.getElement(sid);
        if (existingElement) {
            // Remove old element as it is being replaced.
            this.scene.removeChild(existingElement);
        }

        const newElement = createElement(entityXml);
        newElement.setAttribute("server", serverUrl);
        this.scene.appendChild(newElement);
    }

    setChildEntity(serverUrl: string, parentSid: string, sid: string, entityXml: string) {
        console.log("Set child entity " + serverUrl + "/" + parentSid + "/" + sid + ": " + entityXml);
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
        newElement.setAttribute("server", serverUrl);
        parentElement.appendChild(newElement);
    }

    removeEntity(serverUrl: string, sid: string) {
        console.log("Removed entity " + serverUrl + "/" + sid);
        const element = this.getElement(sid);
        if (element === undefined) {
            console.log("Element to be removed not found sid: " + sid);
            return;
        }
    }

    getElement(sid: string) : Entity | undefined {
        const elements = document.querySelectorAll('[sid="' + sid + ']');
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
