import {AbstractComponent, registerAFrameComponent} from "./AFrame";

export class IdentityComponent extends AbstractComponent {
    constructor() {
        super(
            "identity",
            {}
            , false
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


