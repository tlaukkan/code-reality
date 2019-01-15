import {Component, Entity} from "AFrame";
import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {ComponentControllerDefinition} from "../../../AFrame";
import {addEntityEventListener} from "../../../util";
import {InterfaceTool} from "../InterfaceTool";
import {Device} from "../Device";
import {Button} from "../model/Button";
import {Slot} from "../model/Slot";
import {Stick} from "../model/Stick";

export class ToolSelectorTool extends AbstractComponentController implements InterfaceTool {

    public static DEFINITION = new ComponentControllerDefinition(
        "tool-selector-tool", {}, false,
        (component: Component, entity: Entity, data: any) => new ToolSelectorTool(component, entity, data)
    );

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        console.log(this.componentName + " init: " + JSON.stringify(this.data));

        this.interface.registerTool(this);
        this.interface.slotTool(Slot.PRIMARY_SELECTOR, this);
    }

    init(): void {
        addEntityEventListener(this.scene, "enter-vr", (detail: any) => {
            console.log("entered vr.");
            const toolSelectorObject = this.entity.object3D;
            const vrModePlaceholderObject = document.getElementById("tool-selector-vr-placeholder") as Entity;
            const desktopModePlaceholderObject = document.getElementById("tool-selector-desktop-placeholder") as Entity;
            if (vrModePlaceholderObject && desktopModePlaceholderObject) {
                desktopModePlaceholderObject.object3D.remove(toolSelectorObject);
                vrModePlaceholderObject.object3D.add(toolSelectorObject)
            } else {
                console.warn("tool-selector placeholders not found.");
            }
        });
        addEntityEventListener(this.scene, "exit-vr", (detail: any) => {
            console.log("exited vr.");
            const toolSelectorObject = this.entity.object3D;
            const vrModePlaceholderObject = document.getElementById("tool-selector-vr-placeholder") as Entity;
            const desktopModePlaceholderObject = document.getElementById("tool-selector-desktop-placeholder") as Entity;
            if (vrModePlaceholderObject && desktopModePlaceholderObject) {
                vrModePlaceholderObject.object3D.remove(toolSelectorObject)
                desktopModePlaceholderObject.object3D.add(toolSelectorObject);
            } else {
                console.warn("tool-selector placeholders not found.");
            }
        });

    }

    update(data: any, oldData: any): void {
        console.log(this.componentName + " update: " + JSON.stringify(this.data));
    }

    remove(): void {
        console.log(this.componentName + " remove");
    }

    pause(): void {
        console.log(this.componentName + " pause");
    }

    play(): void {
        console.log(this.componentName + " play");
    }

    tick(time: number, timeDelta: number): void {
    }

    buttonDown(device: Device, toolSlot: Slot, button: Button): void {
    }

    buttonUp(device: Device, toolSlot: Slot, button: Button): void {
    }

    stickTwist(device: Device, toolSlot: Slot, stick: Stick, x: number, y: number): void {
    }

}


