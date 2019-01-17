import {Slot} from "./model/Slot";

export interface SlotListener {

    onToolSlotted(slot: Slot, toolName: string): void;

}