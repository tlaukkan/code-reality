import {registerAFrameComponent} from "./AFrame";
import {LabelController} from "./component/label/LabelController";
import {IdentityController} from "./component/identity/IdentityController";
import {DataspaceController} from "./component/space/DataspaceController";
import {ArcadeControlsController} from "./component/controls/ArcadeControlsController";
import {AnimatorController} from "./component/animation/AnimatorController";
import {AvatarController} from "./component/avatar/AvatarController";
import {Component, Entity} from "aframe";

registerAFrameComponent((component: Component, entity: Entity, data: any) => new DataspaceController(component, entity, data));
registerAFrameComponent((component: Component, entity: Entity, data: any) => new IdentityController(component, entity, data));
registerAFrameComponent((component: Component, entity: Entity, data: any) => new LabelController(component, entity, data));
registerAFrameComponent((component: Component, entity: Entity, data: any) => new ArcadeControlsController(component, entity, data));
registerAFrameComponent((component: Component, entity: Entity, data: any) => new AnimatorController(component, entity, data));
registerAFrameComponent((component: Component, entity: Entity, data: any) => new AvatarController(component, entity, data));



