import {Component, Entity, Scene, System} from "AFrame";
import {AbstractSystemController} from "../AbstractSystemController";
import {InterfaceController} from "./InterfaceController";
import {DeviceSlot} from "./model/DeviceSlot";
import {Device} from "./Device";
import {ToolSlot} from "./model/ToolSlot";
import {Tool} from "./Tool";
import {Button} from "./model/Button";

export class InterfaceSystemController extends AbstractSystemController {

    public interfaceEntity: Entity | undefined;
    public cameraEntity: Entity | undefined;

    private interfaceController: InterfaceController | undefined;

    private devices: Map<DeviceSlot, Device> = new Map();
    private tools: Map<ToolSlot, Tool> = new Map();

    constructor(system: System, scene: Scene, data: any) {
        super("interface", {}, false, system, scene, data);
    }

    init(): void {
        console.log(this.systemName + " system init.");
    }

    pause(): void {
        console.log(this.systemName + " system pause");
    }

    play(): void {
        console.log(this.systemName + " system play");
    }

    tick(time: number, timeDelta: number): void {
    }

    setInterfaceEntity(interfaceEntity: Entity) {
        this.interfaceEntity = interfaceEntity;
        console.log("interface entity set.");
        this.cameraEntity = this.interfaceEntity!!.querySelector('[camera]') as Entity;
        if (!this.cameraEntity) {
            console.error("interface did not find camera under interface entity.");
        } else {
            console.log("interface camera entity set.");
        }
    }

    setInterfaceController(interfaceController: InterfaceController) {
        this.interfaceController = interfaceController;
    }

    setDevice(slot: DeviceSlot, device: Device) {
        if (this.devices.has(slot)) {
            console.log("interface already has controls at: " + DeviceSlot[slot]);
        } else {
            this.devices.set(slot, device);
            console.log("interface controls " + device.componentName + " set at: " + DeviceSlot[slot]);
        }
    }

    getDevice(slot: DeviceSlot): Device | undefined {
        return this.devices.get(slot);
    }

    setTool(slot: ToolSlot, tool: Tool) {
        if (this.tools.has(slot)) {
            console.log("interface already has tool at: " + ToolSlot[slot]);
        } else {
            this.tools.set(slot, tool);
            console.log("interface tool " + tool.componentName + " set at: " + ToolSlot[slot]);
        }
    }

    buttonUp(device: Device, toolSlot: ToolSlot,  button: Button) {
        if (this.tools.has(toolSlot)) {
            this.tools.get(toolSlot)!!.buttonUp(device, toolSlot, button);
        }
    }

    buttonDown(device: Device, toolSlot: ToolSlot, button: Button) {
        if (this.tools.has(toolSlot)) {
            this.tools.get(toolSlot)!!.buttonDown(device, toolSlot, button);
        }
    }

    stickTwist(device: Device, toolSlot: ToolSlot, x: number, y: number) {
        if (this.tools.has(toolSlot)) {
            this.tools.get(toolSlot)!!.stickTwist(device, toolSlot, x, y);
        }
    }

}


