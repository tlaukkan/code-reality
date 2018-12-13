import {registerAFrameComponent} from "./AFrame";
import {LabelComponent} from "./LabelComponent";
import {IdentityComponent} from "./IdentityComponent";
import {DataspaceComponent} from "./DataspaceComponent";
import {ArcadeControls} from "./component/controls/ArcadeControls";

registerAFrameComponent(() => new DataspaceComponent());
registerAFrameComponent(() => new IdentityComponent());
registerAFrameComponent(() => new LabelComponent());
registerAFrameComponent(() => new ArcadeControls());



