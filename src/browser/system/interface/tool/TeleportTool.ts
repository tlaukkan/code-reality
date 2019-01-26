import {Raycaster} from "three";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {ComponentControllerDefinition} from "../../../AFrame";
import {PointerTool} from "./PointerTool";
import {WalkTool} from "./WalkTool";

export class TeleportTool extends PointerTool {

    public static DEFINITION = new ComponentControllerDefinition(
        "teleport-tool", {}, false, (component: Component, entity: Entity, data: any) => new TeleportTool(component, entity, data)
    );

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        //this.interface.setTool(ToolSlot.PRIMARY, this);
        this.raycaster = new Raycaster();
        this.interface.registerTool(this);
        this.interface.slotTool(Slot.PRIMARY, this);
    }

    init(): void {
        console.log(this.componentName + " init");
        super.init();
    }

    tick(time: number, timeDelta: number): void {
        super.tick(time, timeDelta);
    }

    buttonDown(device: Device, toolSlot: Slot, button: Button): void {
        if (!this.pressed.has(button)) {

        }
        super.buttonDown(device, toolSlot, button);
    }

    buttonUp(device: Device, toolSlot: Slot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == Button.TRIGGER) {
                if (this.pointedPosition) {
                    const movementTool: WalkTool = this.interface.getToolAtSlot(Slot.WALK) as WalkTool;
                    this.interface.interfaceEntity.object3D.position.x = this.pointedPosition.x;
                    this.interface.interfaceEntity.object3D.position.y = this.pointedPosition.y;
                    this.interface.interfaceEntity.object3D.position.z = this.pointedPosition.z;
                    movementTool.setCenterOfMassFromInterfaceEntity();
                }
            }
        }
        super.buttonUp(device, toolSlot, button);
    }

}


