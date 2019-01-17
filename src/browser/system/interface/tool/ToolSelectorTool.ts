import {Component, Entity} from "AFrame";
import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {ComponentControllerDefinition} from "../../../AFrame";
import {addEntityEventListener, createElement} from "../../../util";
import {Tool} from "../Tool";
import {Device} from "../Device";
import {Button} from "../model/Button";
import {Slot} from "../model/Slot";
import {Stick} from "../model/Stick";
import {SlotListener} from "../SlotListener";

export class ToolSelectorTool extends AbstractComponentController implements Tool, SlotListener {

    public static DEFINITION = new ComponentControllerDefinition(
        "tool-selector-tool", {}, false,
        (component: Component, entity: Entity, data: any) => new ToolSelectorTool(component, entity, data)
    );

    toolSymbolEntities: Map<String, Entity> = new Map();
    currentToolName: string | undefined;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        console.log(this.componentName + " init: " + JSON.stringify(this.data));

        this.interface.slotTool(Slot.PRIMARY_SELECTOR, this);
    }

    init(): void {
        this.interface.registerSlotListener(Slot.PRIMARY, this);

        addEntityEventListener(this.scene, "enter-vr", (detail: any) => {
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
        if (button === Button.LEFT) {
            this.interface.slotPreviousTool(Slot.PRIMARY);
        }
        if (button === Button.RIGHT) {
            this.interface.slotNextTool(Slot.PRIMARY);
        }
    }

    stickTwist(device: Device, toolSlot: Slot, stick: Stick, x: number, y: number): void {
    }

    onToolSlotted(slot: Slot, toolName: string): void {
        if (!this.toolSymbolEntities.has(toolName)) {
            const toolSymbolEntity = createElement('<a-entity gltf-model="#' + toolName + '" visible="false"></a-entity>') as Entity;
            this.entity.appendChild(toolSymbolEntity);
            this.toolSymbolEntities.set(toolName, toolSymbolEntity);
        }

        if (this.currentToolName) {
            this.toolSymbolEntities.get(this.currentToolName)!!.setAttribute("visible", false);
        }

        this.toolSymbolEntities.get(toolName)!!.setAttribute("visible", true);
        this.currentToolName = toolName;
    }


}


