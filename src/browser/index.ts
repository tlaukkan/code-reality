import {registerComponentController, registerSystemController} from "./AFrame";
import {LabelController} from "./component/label/LabelController";
import {IdentityController} from "./component/identity/IdentityController";
import {DataspaceController} from "./component/space/DataspaceController";
import {ArcadeControlsController} from "./component/controls/ArcadeControlsController";
import {AnimatorController} from "./component/animation/AnimatorController";
import {AvatarController} from "./component/avatar/AvatarController";
import {Component, Entity, System} from "aframe";
import {ExampleSystemController} from "./system/ExampleSystemController";

registerComponentController((component: Component, entity: Entity, data: any) => new DataspaceController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new IdentityController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new LabelController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new ArcadeControlsController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new AnimatorController(component, entity, data));
registerComponentController((component: Component, entity: Entity, data: any) => new AvatarController(component, entity, data));


registerSystemController((system: System, entity: Entity, data: any) => new ExampleSystemController(system, entity, data));
