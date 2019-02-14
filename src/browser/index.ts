import {registerComponentController, registerSystemController} from "./AFrame";
import {LabelController} from "./component/label/LabelController";
import {IdentityController} from "./component/identity/IdentityController";
import {KeyboardAndMouseDevice} from "./system/interface/device/KeyboardAndMouseDevice";
import {AnimatorController} from "./component/animation/AnimatorController";
import {AvatarController} from "./component/avatar/AvatarController";
import {SpaceSystemController} from "./system/space/SpaceSystemController";
import {registerStateFactory, StateSystemController} from "./system/state/StateSystemController";
import {States} from "./model/States";
import {MovementState} from "./model/MovementState";
import {InterfaceSystemController} from "./system/interface/InterfaceSystemController";
import {InterfaceController} from "./system/interface/InterfaceController";
import {WalkTool} from "./system/interface/tool/WalkTool";
import {PrimaryControllerDevice} from "./system/interface/device/PrimaryControllerDevice";
import {ExampleController} from "./component/ExampleController";
import {ExampleSystemController} from "./system/ExampleSystemController";
import {AddObjectTool} from "./system/interface/tool/AddObjectTool";
import {CollidableController} from "./component/collidable/CollidableController";
import {QuaternionController} from "./component/quaternion/QuaternionController";
import {TeleportTool} from "./system/interface/tool/TeleportTool";
import {ToolSelectorTool} from "./system/interface/tool/ToolSelectorTool";
import {RemoveObjectTool} from "./system/interface/tool/RemoveObjectTool";
import {ModelController} from "./system/merge/ModelController";
import {MergeController} from "./system/merge/MergeController";
import {MergeSystemController} from "./system/merge/MergeSystemController";
import {LoaderSystemController} from "./system/loader/LoaderSystemController";
import {PictureController} from "./component/texture/PictureController";
import {BillboardController} from "./component/texture/BillboardController";
import {ScaleObjectTool} from "./system/interface/tool/ScaleObjectTool";
import {MoveObjectTool} from "./system/interface/tool/MoveObjectTool";
import {RotateObjectTool} from "./system/interface/tool/RotateObjectTool";
import {AvatarActionLoggerFeature} from "./component/avatar/AvatarActionLoggerFeature";

registerSystemController(LoaderSystemController.DEFINITION);
registerSystemController(ExampleSystemController.DEFINITION);
registerSystemController(InterfaceSystemController.DEFINITION);
registerSystemController(StateSystemController.DEFINITION);
registerSystemController(SpaceSystemController.DEFINITION);
registerSystemController(MergeSystemController.DEFINITION);

registerComponentController(InterfaceController.DEFINITION);
registerComponentController(ToolSelectorTool.DEFINITION);

registerComponentController(AddObjectTool.DEFINITION);
registerComponentController(ScaleObjectTool.DEFINITION);
registerComponentController(MoveObjectTool.DEFINITION);
registerComponentController(RotateObjectTool.DEFINITION);
registerComponentController(RemoveObjectTool.DEFINITION);
registerComponentController(WalkTool.DEFINITION);
registerComponentController(TeleportTool.DEFINITION);

registerComponentController(PrimaryControllerDevice.DEFINITION);
registerComponentController(KeyboardAndMouseDevice.DEFINITION);

registerComponentController(ExampleController.DEFINITION);
registerComponentController(CollidableController.DEFINITION);
registerComponentController(AnimatorController.DEFINITION);
registerComponentController(AvatarController.DEFINITION.add(AvatarActionLoggerFeature.DEFINITION));
registerComponentController(IdentityController.DEFINITION);
registerComponentController(LabelController.DEFINITION);
registerComponentController(QuaternionController.DEFINITION);

registerComponentController(MergeController.DEFINITION);
registerComponentController(ModelController.DEFINITION);
registerComponentController(PictureController.DEFINITION);
registerComponentController(BillboardController.DEFINITION);

registerStateFactory(States.STATE_MOVEMENT, () => { return new MovementState() });

// Fix facebook bug adding hash to url
if (window.location.hash && window.location.hash == '#_=_') {
    history.pushState("", document.title, window.location.pathname + window.location.search);
}