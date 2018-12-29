import {registerComponentControllerV2, registerSystemController} from "./AFrame";
import {LabelController} from "./component/label/LabelController";
import {IdentityController} from "./component/identity/IdentityController";
import {KeyboardAndMouseDevice} from "./system/interface/device/KeyboardAndMouseDevice";
import {AnimatorController} from "./component/animation/AnimatorController";
import {AvatarController} from "./component/avatar/AvatarController";
import {Scene, System} from "aframe";
import {SpaceSystemController} from "./system/space/SpaceSystemController";
import {registerStateFactory, StateSystemController} from "./system/state/StateSystemController";
import {States} from "./model/States";
import {MovementState} from "./model/MovementState";
import {InterfaceSystemController} from "./system/interface/InterfaceSystemController";
import {InterfaceController} from "./system/interface/InterfaceController";
import {MovementTool} from "./system/interface/tool/MovementTool";
import {ViveControllerDevice} from "./system/interface/device/ViveControllerDevice";
import {ExampleController} from "./component/ExampleController";

registerSystemController((system: System, scene: Scene, data: any) => new InterfaceSystemController(system, scene, data));
registerSystemController((system: System, scene: Scene, data: any) => new StateSystemController(system, scene, data));
registerSystemController((system: System, scene: Scene, data: any) => new SpaceSystemController(system, scene, data));

registerComponentControllerV2(ExampleController.DEFINITION);
registerComponentControllerV2(AnimatorController.DEFINITION);
registerComponentControllerV2(AvatarController.DEFINITION);
registerComponentControllerV2(IdentityController.DEFINITION);
registerComponentControllerV2(LabelController.DEFINITION);
registerComponentControllerV2(InterfaceController.DEFINITION);
registerComponentControllerV2(KeyboardAndMouseDevice.DEFINITION);
registerComponentControllerV2(ViveControllerDevice.DEFINITION);
registerComponentControllerV2(MovementTool.DEFINITION);

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