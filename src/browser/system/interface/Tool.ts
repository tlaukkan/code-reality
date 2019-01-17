import {ComponentController} from "../../component/ComponentController";
import {Device} from "./Device";
import {Slot} from "./model/Slot";
import {Button} from "./model/Button";
import {Stick} from "./model/Stick";

export interface Tool extends ComponentController{

    buttonUp(device: Device, toolSlot: Slot, button: Button): void;
    buttonDown(device: Device, toolSlot: Slot, button: Button): void;
    stickTwist(device: Device, toolSlot: Slot, stick: Stick, x: number, y: number): void;

}