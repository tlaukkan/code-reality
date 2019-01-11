import {Raycaster} from "three";
import {Component, Entity} from "AFrame";
import {Device} from "../Device";
import {ToolSlot} from "../model/ToolSlot";
import {Button} from "../model/Button";
import {ComponentControllerDefinition} from "../../../AFrame";
import {PointerTool} from "./PointerTool";
import {MovementTool} from "./MovementTool";

export class TeleportTool extends PointerTool {

    public static DEFINITION = new ComponentControllerDefinition(
        "teleport-tool", {}, false, (component: Component, entity: Entity, data: any) => new TeleportTool(component, entity, data)
    );

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        //this.interface.setTool(ToolSlot.PRIMARY, this);
        this.raycaster = new Raycaster();
        this.interface.registerTool(this);
        this.interface.setTool(ToolSlot.PRIMARY, this);
    }

    init(): void {
        console.log(this.componentName + " init");
        super.init();
    }

    tick(time: number, timeDelta: number): void {
        super.tick(time, timeDelta);
    }

    buttonDown(device: Device, toolSlot: ToolSlot, button: Button): void {
        if (!this.pressed.has(button)) {

        }
        super.buttonDown(device, toolSlot, button);
    }

    buttonUp(device: Device, toolSlot: ToolSlot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == Button.TRIGGER) {
                if (this.cursorPosition) {
                    const movementTool: MovementTool = this.interface.getTool("movement-tool");
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


