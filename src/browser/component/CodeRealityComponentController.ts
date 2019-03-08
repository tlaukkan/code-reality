import {AbstractComponentController, getSystemController} from "aframe-typescript-boilerplate";
import {InterfaceSystemController} from "../..";
import {Component, Entity} from "aframe";

export abstract class CodeRealityComponentController extends AbstractComponentController {

    protected interface: InterfaceSystemController;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);

        this.interface = getSystemController(this.entity.sceneEl!!, "interface");
    }

}