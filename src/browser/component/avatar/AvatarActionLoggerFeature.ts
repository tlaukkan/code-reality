

import {Entity} from "AFrame";
import {Events} from "../../model/Events";
import {EntityActionEventDetail} from "../../model/EntityActionEventDetail";
import {AbstractFeature} from "aframe-typescript-boilerplate";
import {ComponentController} from "aframe-typescript-boilerplate";

export class AvatarActionLoggerFeature extends AbstractFeature {

    static readonly DEFINITION = (controller: ComponentController, entity: Entity) => { return new AvatarActionLoggerFeature(controller, entity)};

    constructor(controller: ComponentController, entity: Entity) {
        super("expression-controller", controller, entity);
    }

    init(): void {
        this.addEventListener(Events.EVENT_ACTION, (detail: EntityActionEventDetail) => {
            console.log("avatar action: " + detail.action +  ": " + detail.description);
        });
    }

    update(data: any, oldData: any): void {
    }

    remove(): void {
    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
    }
}


