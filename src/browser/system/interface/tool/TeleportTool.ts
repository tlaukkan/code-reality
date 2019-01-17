import {Raycaster} from "three";
import {Component, Entity} from "AFrame";
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
                if (this.cursorPosition) {
                    const movementTool: WalkTool = this.interface.getToolAtSlot(Slot.WALK) as WalkTool;
                    this.interface.interfaceEntity.object3D.position.x = this.cursorPosition.x;
                    this.interface.interfaceEntity.object3D.position.y = this.cursorPosition.y;
                    this.interface.interfaceEntity.object3D.position.z = this.cursorPosition.z;
                    movementTool.setCenterOfMassFromInterfaceEntity();
                }
            }
        }
        super.buttonUp(device, toolSlot, button);
    }

}


