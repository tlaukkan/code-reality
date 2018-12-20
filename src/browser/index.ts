import {registerAFrameComponent} from "./AFrame";
import {LabelComponent} from "./LabelComponent";
import {IdentityComponent} from "./IdentityComponent";
import {DataspaceComponent} from "./DataspaceComponent";
import {ArcadeControlsComponent} from "./component/controls/ArcadeControlsComponent";
import {AnimatorComponent} from "./component/animation/AnimatorComponent";
import {AvatarComponent} from "./component/avatar/AvatarComponent";
import {Entity} from "aframe";

registerAFrameComponent((entity: Entity, data: any, state: any) => new DataspaceComponent(entity, data, state));
registerAFrameComponent((entity: Entity, data: any, state: any) => new IdentityComponent(entity, data, state));
registerAFrameComponent((entity: Entity, data: any, state: any) => new LabelComponent(entity, data, state));
registerAFrameComponent((entity: Entity, data: any, state: any) => new ArcadeControlsComponent(entity, data, state));
registerAFrameComponent((entity: Entity, data: any, state: any) => new AnimatorComponent(entity, data, state));
registerAFrameComponent((entity: Entity, data: any, state: any) => new AvatarComponent(entity, data, state));



