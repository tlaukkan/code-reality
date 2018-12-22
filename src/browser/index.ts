import {registerComponentController, registerSystemController} from "./AFrame";
import {LabelController} from "./component/label/LabelController";
import {IdentityController} from "./component/identity/IdentityController";
import {ArcadeControlsController} from "./component/controls/ArcadeControlsController";
import {AnimatorController} from "./component/animation/AnimatorController";
import {AvatarController} from "./component/avatar/AvatarController";
import {Component, Entity, Scene, System} from "aframe";
import {ExampleSystemController} from "./system/ExampleSystemController";
import {SpaceSystemController} from "./system/space/SpaceSystemController";
import {StateSystemController} from "./system/state/StateSystemController";

registerSystemController((system: System, scene: Scene, data: any) => new StateSystemController(system, scene, data));
registerSystemController((system: System, scene: Scene, data: any) => new ExampleSystemController(system, scene, data));
registerSystemController((system: System, scene: Scene, data: any) => new SpaceSystemController(system, scene, data));

registerComponentController((component: Component, entity: Entity, data: any) => new IdentityController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new LabelController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new ArcadeControlsController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new AnimatorController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new AvatarController(component, entity, data));


