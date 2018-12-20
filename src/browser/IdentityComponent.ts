import {registerAFrameComponent} from "./AFrame";
import {Entity} from "aframe";
import {AbstractComponent} from "./AbstractComponent";

export class IdentityComponent extends AbstractComponent {
    constructor(entity: Entity, data: any, state: any) {
        super(
            "identity",
            {}
            , false,
            entity,
            data,
            state
        );
    }

    init(): void {
        console.log(this.name + " init");
        fetch('/api/users/current')
        .then((response) => {
            response.json().then((data) => {
                console.log(data);
                this.entity!!.setAttribute("label", "text:" + data.name + "; height:1.2;");
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    update(data: any, oldData: any): void {
        console.log(this.name + " update");
    }

    remove(): void {
        console.log(this.name + " remove");
    }

    pause(): void {
        console.log(this.name + " pause");
    }

    play(): void {
        console.log(this.name + " play");
    }

    tick(time: number, timeDelta: number): void {
    }
}


