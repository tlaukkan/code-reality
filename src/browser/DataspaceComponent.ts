import {AbstractComponent} from "./AFrame";

export class DataspaceComponent extends AbstractComponent {
    constructor() {
        super(
            "dataspace",
            {url: {type: 'string', default: '?'}}
            , false
        );
    }

    init(): void {
        console.log(this.name + " init");
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


