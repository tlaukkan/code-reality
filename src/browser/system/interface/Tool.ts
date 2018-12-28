import {ComponentController} from "../../component/ComponentController";
import {Device} from "./Device";
import {ToolSlot} from "./model/ToolSlot";
import {Button} from "./model/Button";

export interface Tool extends ComponentController{

    buttonUp(device: Device, toolSlot: ToolSlot,  button: Button): void;
    buttonDown(device: Device, toolSlot: ToolSlot, button: Button): void;
    stickTwist(device: Device, toolSlot: ToolSlot, x: number, y: number): void;
}