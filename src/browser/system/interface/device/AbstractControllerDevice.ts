import {Button} from "../model/Button";
import {Component, Entity} from "aframe";
import {CodeRealityComponentController} from "../../../component/CodeRealityComponentController";

export abstract class AbstractControllerDevice extends CodeRealityComponentController {
    protected controllerName: string = "";
    protected axis: Array<number> | undefined;
    protected lastStickButton: Button | undefined;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    getStickButton(x: number, y: number): Button {
        var angle = Math.atan2(y, x) * 180 / Math.PI;
        if (angle >= -45 && angle < 45) {
            return Button.RIGHT;
        } else if (angle >= 45 && angle < 135) {
            return Button.UP;
        } else if (angle >= 135 || angle <= -135) {
            return Button.LEFT;
        } else {
            return Button.DOWN;
        }
    }
}