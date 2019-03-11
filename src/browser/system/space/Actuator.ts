import {Entity, Scene} from "aframe";
import {Euler, Quaternion, Vector3} from "three";
import {Spring} from "./Spring";
import {Events} from "../../model/Events";
import {EntityStateEventDetail} from "../../model/EntityStateEventDetail";
import {StateSystemController} from "../state/StateSystemController";
import {States} from "../../model/States";
import {MovementState} from "../../model/MovementState";
import {Element, js2xml, xml2js} from "xml-js";
import {EntityActionEventDetail} from "../../model/EntityActionEventDetail";
import {createElement, getSystemController} from "aframe-typescript-boilerplate";
import {InterfaceSystemController, SpaceSystemController} from "../../..";

export class Actuator {

    id: string;
    serverUrl: string;
    description: string;
    scene: Scene;
    entity: Entity;

    springOne: Spring = new Spring();
    springTwo: Spring = new Spring();
    lastPosition: Vector3 = new Vector3();
    facingDirection: Vector3 = new Vector3( 0, 0, -1 );

    targetOrientation: Quaternion = new Quaternion();
    currentOrientation: Quaternion = new Quaternion();

    lastUpdateTime: number = 0;
    averageUpdateInterval: number = 0.200;
    moving: boolean = false;
    turning: boolean = false;
    firstSimulate: boolean = true;

    stateSystemController: StateSystemController;
    movementState: MovementState;

    cameraPosition: Vector3 = new Vector3(0,0,0);

    constructor(scene: Scene, serverUrl: string, id: string, description: string) {
        this.scene = scene;
        this.serverUrl = serverUrl;
        this.id = id;
        this.description = description;
        this.entity = createElement(description) as Entity;
        this.entity.setAttribute("did", id);
        this.entity.setAttribute("server", serverUrl);
        this.springOne.relaxationTime = 0.2;
        this.springTwo.relaxationTime = 0.2;
        this.stateSystemController = getSystemController(this.scene, "state");
        this.movementState = this.stateSystemController.getState(this.entity, States.STATE_MOVEMENT);
    }

    added(x: number, y: number, z: number, rx: number, ry: number, rz: number, rw: number) : void {
        this.scene.appendChild(this.entity);

        this.springOne.currentPosition.x = x;
        this.springOne.currentPosition.y = y;
        this.springOne.currentPosition.z = z;
        this.springOne.targetPosition.x = x;
        this.springOne.targetPosition.y = y;
        this.springOne.targetPosition.z = z;

        this.springOne.currentOrientation.x = rx;
        this.springOne.currentOrientation.y = ry;
        this.springOne.currentOrientation.z = rz;
        this.springOne.currentOrientation.w = rw;
        this.springOne.targetOrientation.x = rx;
        this.springOne.targetOrientation.y = ry;
        this.springOne.targetOrientation.z = rz;
        this.springOne.targetOrientation.w = rw;

        this.springTwo.currentPosition.x = x;
        this.springTwo.currentPosition.y = y;
        this.springTwo.currentPosition.z = z;
        this.springTwo.targetPosition.x = x;
        this.springTwo.targetPosition.y = y;
        this.springTwo.targetPosition.z = z;

        this.springTwo.currentOrientation.x = rx;
        this.springTwo.currentOrientation.y = ry;
        this.springTwo.currentOrientation.z = rz;
        this.springTwo.currentOrientation.w = rw;
        this.springTwo.targetOrientation.x = rx;
        this.springTwo.targetOrientation.y = ry;
        this.springTwo.targetOrientation.z = rz;
        this.springTwo.targetOrientation.w = rw;

        this.lastPosition.x = this.springTwo.currentPosition.x;
        this.lastPosition.y = this.springTwo.currentPosition.y;
        this.lastPosition.z = this.springTwo.currentPosition.z;

        //this.moving = true;
        //this.turning = true;
        //this.entity.dispatchEvent(new CustomEvent(Events.EVENT_STATE_BEGIN, {detail: new EntityStateEventDetail("moving")}));
        //console.log(this.entity.tagName + ":" + "start moving");

        /*this.entity.object3D.position.x = this.springTwo.currentPosition.x;
        this.entity.object3D.position.y = this.springTwo.currentPosition.y;
        this.entity.object3D.position.z = this.springTwo.currentPosition.z;
        this.entity.object3D.rotation.setFromQuaternion(this.springTwo.currentOrientation);

        if (this.entity.tagName != "A-DODECAHEDRON") {
            console.log(this.entity.tagName + ":" + JSON.stringify(this.entity.object3D.position));
        }*/

        //this.moving = true;
        //this.entity.dispatchEvent(new CustomEvent(Events.EVENT_STATE_BEGIN, {detail: new EntityStateEventDetail("moving")}));
        //console.log("start moving");
        //this.simulate(1);
    }

    updated(x: number, y: number, z: number, rx: number, ry: number, rz: number, rw: number) : void {
        const time = new Date().getTime() / 1000.0;
        if (this.lastUpdateTime != 0) {
            this.averageUpdateInterval = (this.averageUpdateInterval * 9 + (time - this.lastUpdateTime)) / 10;
            this.springOne.relaxationTime = 2 * this.averageUpdateInterval;
            this.springTwo.relaxationTime = 2 * this.averageUpdateInterval;
        }
        this.lastUpdateTime = time;

        //this.entity.setAttribute("position", x + " " + y + " " + z);

        this.springOne.targetPosition.x = x;
        this.springOne.targetPosition.y = y;
        this.springOne.targetPosition.z = z;

        this.springOne.targetOrientation.x = rx;
        this.springOne.targetOrientation.y = ry;
        this.springOne.targetOrientation.z = rz;
        this.springOne.targetOrientation.w = rw;
        if (!this.moving) {
            this.checkIfMoving();
        }
    }

    removed() : void {
        if (this.entity.parentElement) {
            this.entity.parentElement.removeChild(this.entity);
        }
    }

    described(description: string) : void {
        this.description = description;

        const element = (xml2js(description)!!.elements as Array<Element>)[0];
        if (element.attributes) {
            // TODO recursive updates.
            for (const attributeName in element.attributes) {
                const attributeValue = element.attributes[attributeName];

                if (attributeName == 'gltf-model') {
                    continue;
                }

                if (attributeName == 'avatar') {
                    continue;
                }

                this.entity.setAttribute(attributeName, attributeValue);
            }
        }
    }

    acted(action: string, description: string) : void {
        if (action === 'state-begin') {
            this.entity.dispatchEvent(new CustomEvent(Events.EVENT_STATE_BEGIN, {detail: new EntityStateEventDetail(description)}));
        } else if (action === 'state-end') {
            this.entity.dispatchEvent(new CustomEvent(Events.EVENT_STATE_END, {detail: new EntityStateEventDetail(description)}));
        } else {
            this.entity.dispatchEvent(new CustomEvent(Events.EVENT_ACTION, {detail: new EntityActionEventDetail(action, description)}));
        }
    }

    simulate(t: number) {
        if (this.moving || this.turning || this.firstSimulate) {
            this.firstSimulate = false;
            this.lastPosition.x = this.springTwo.currentPosition.x;
            this.lastPosition.y = this.springTwo.currentPosition.y;
            this.lastPosition.z = this.springTwo.currentPosition.z;

            this.springOne.simulate(t);

            this.springTwo.targetPosition.x = this.springOne.currentPosition.x;
            this.springTwo.targetPosition.y = this.springOne.currentPosition.y;
            this.springTwo.targetPosition.z = this.springOne.currentPosition.z;

            this.springTwo.targetOrientation.x = this.springOne.currentOrientation.x;
            this.springTwo.targetOrientation.y = this.springOne.currentOrientation.y;
            this.springTwo.targetOrientation.z = this.springOne.currentOrientation.z;
            this.springTwo.targetOrientation.w = this.springOne.currentOrientation.w;

            this.springTwo.simulate(t);


            if (this.entity.object3D) {
                // Update location only after 3d presentation is ready.
                this.entity.object3D.position.x = this.springTwo.currentPosition.x;
                this.entity.object3D.position.y = this.springTwo.currentPosition.y;
                this.entity.object3D.position.z = this.springTwo.currentPosition.z;
                /*if (this.entity.tagName != "A-DODECAHEDRON") {
                    console.log(this.entity.tagName + ":" + t + ":" + JSON.stringify(this.entity.object3D.position));
                }*/
                this.entity.object3D.rotation.setFromQuaternion(this.springTwo.currentOrientation);

                this.movementState.distanceDelta = Math.abs(this.lastPosition.distanceTo(this.springTwo.currentPosition));
                this.movementState.timeDeltaSeconds = t;

                const movementDirection = this.lastPosition.sub(this.springTwo.currentPosition);
                this.facingDirection.x = 0;
                this.facingDirection.y = 0;
                this.facingDirection.z = -1;
                this.facingDirection = this.facingDirection.applyQuaternion( this.entity.object3D.quaternion );

                this.movementState.facing = movementDirection.angleTo(this.facingDirection) < Math.PI / 2 ? 1 : -1;
            }

            this.checkIfMoving();
        }

        // Check if dynamic object is in observation range. Do this every round to keep the cost independent of whether user is moving or not.
        const spaceSystem = getSystemController(this.scene, "space") as SpaceSystemController;
        const interfaceSystem = getSystemController(this.scene, "interface") as InterfaceSystemController;
        const range = spaceSystem.getObservationRange();
        //console.log("Observation range: "+ range);
        this.cameraPosition.copy(interfaceSystem.cameraPosition);
        this.cameraPosition.sub(this.entity.object3D.position);
        const distanceToCamera = this.cameraPosition.length();
        this.entity.object3D.visible = distanceToCamera < range;

    }

    checkIfMoving() {
        const positionDelta = this.springOne.targetPosition.distanceTo(this.springTwo.currentPosition);

        this.targetOrientation.x = this.springOne.targetOrientation.x;
        this.targetOrientation.y = this.springOne.targetOrientation.y;
        this.targetOrientation.z = this.springOne.targetOrientation.z;
        this.targetOrientation.w = this.springOne.targetOrientation.w;

        this.currentOrientation.x = this.springTwo.currentOrientation.x;
        this.currentOrientation.y = this.springTwo.currentOrientation.y;
        this.currentOrientation.z = this.springTwo.currentOrientation.z;
        this.currentOrientation.w = this.springTwo.currentOrientation.w;

        const dot = this.targetOrientation.dot(this.currentOrientation);
        const orientationDelta = Math.acos(2 * dot * dot - 1);
        //console.log(orientationDelta);

        //const orientationDelta = ((this.springOne.targetOrientation) as any).angleTo(this.springTwo.currentOrientation) as number;
        const moving = positionDelta > 0.2;
        const turning = orientationDelta > 0.2;
        //console.log(positionDelta);

        if (!this.moving && moving) {
            this.entity.dispatchEvent(new CustomEvent(Events.EVENT_STATE_BEGIN, {detail: new EntityStateEventDetail("moving")}));
            //console.log(this.entity.tagName + ":" + "start moving");
        }
        if (this.moving && !moving) {
            this.entity.dispatchEvent(new CustomEvent(Events.EVENT_STATE_END, {detail: new EntityStateEventDetail("moving")}));
            //console.log(this.entity.tagName + ":" + "end moving");
        }
        this.moving = moving;
        this.turning = turning;
    }

}