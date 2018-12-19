import {AbstractComponent, registerAFrameComponent} from "./../AFrame";
import {AbstractController} from "../controllers/AbstractController";

export class CompositeComponent extends AbstractComponent {

    controllers: Array<AbstractController> = [];

    constructor(name: string, schema: any, multiple: boolean) {
        super(name,
            schema,
            multiple);
    }

    init(): void {
        console.log(this.name + " init: " + JSON.stringify(this.data));
        this.controllers.forEach(controller => {
            controller.init();
        });

    }

    update(data: any, oldData: any): void {
        console.log(this.name + " update: " + JSON.stringify(this.data));
        this.controllers.forEach(controller => {
            controller.update(data, oldData);
        });
    }

    remove(): void {
        console.log(this.name + " remove");
        this.controllers.forEach(controller => {
            controller.remove();
        });
    }

    pause(): void {
        console.log(this.name + " pause");
        this.controllers.forEach(controller => {
            controller.pause();
        });
    }

    play(): void {
        console.log(this.name + " play");
        this.controllers.forEach(controller => {
            controller.play();
        });
    }

    tick(time: number, timeDelta: number): void {
        this.controllers.forEach(controller => {
            controller.tick(time, timeDelta);
        });
    }

    addController(controller: AbstractController) {
        this.controllers.push(controller);
    }

}


