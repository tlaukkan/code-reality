import {registerComponentController, registerSystemController} from "./AFrame";
import {LabelController} from "./component/label/LabelController";
import {IdentityController} from "./component/identity/IdentityController";
import {KeyboardAndMouseController} from "./system/interface/device/KeyboardAndMouseController";
import {AnimatorController} from "./component/animation/AnimatorController";
import {AvatarController} from "./component/avatar/AvatarController";
import {Component, Entity, Scene, System} from "aframe";
import {ExampleSystemController} from "./system/ExampleSystemController";
import {SpaceSystemController} from "./system/space/SpaceSystemController";
import {registerStateFactory, StateSystemController} from "./system/state/StateSystemController";
import {States} from "./model/States";
import {MovementState} from "./model/MovementState";
import {InterfaceSystemController} from "./system/interface/InterfaceSystemController";
import {InterfaceController} from "./system/interface/InterfaceController";
import {MovementToolController} from "./system/interface/tool/MovementToolController";
import {ViveController} from "./system/interface/device/ViveController";

registerSystemController((system: System, scene: Scene, data: any) => new InterfaceSystemController(system, scene, data));
registerSystemController((system: System, scene: Scene, data: any) => new StateSystemController(system, scene, data));
registerSystemController((system: System, scene: Scene, data: any) => new ExampleSystemController(system, scene, data));
registerSystemController((system: System, scene: Scene, data: any) => new SpaceSystemController(system, scene, data));

registerComponentController((component: Component, entity: Entity, data: any) => new InterfaceController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new KeyboardAndMouseController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new ViveController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new MovementToolController(component, entity, data));



registerComponentController((component: Component, entity: Entity, data: any) => new IdentityController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new LabelController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new AnimatorController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new AvatarController(component, entity, data));

registerStateFactory(States.STATE_MOVEMENT, () => { return new MovementState() });

// Set terrain function.
(window as any).TINY_TERRAIN.heightFunctions.set('custom', (x: number, y: number) => {
    const d = Math.sqrt(x*x + y*y);
    return 20 + 20 * ( -1 + 1 / (1 + d * d / 500));
});

// Fix facebook bug adding hash to url
if (window.location.hash && window.location.hash == '#_=_') {
    history.pushState("", document.title, window.location.pathname + window.location.search);
}