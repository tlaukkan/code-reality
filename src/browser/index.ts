import {registerAFrameComponent} from "./AFrame";
import {LabelComponent} from "./component/label/LabelComponent";
import {IdentityComponent} from "./component/identity/IdentityComponent";
import {DataspaceComponent} from "./component/space/DataspaceComponent";
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



