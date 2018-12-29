import {AbstractComponentController} from "../../../component/AbstractComponentController";
import {Object3D, Plane, Raycaster, Vector3} from "three";
import {EntityStateEventDetail} from "../../../model/EntityStateEventDetail";
import {Events} from "../../../model/Events";
import {Component, Entity} from "AFrame";
import {Device} from "../Device";
import {Tool} from "../Tool";
import {ToolSlot} from "../model/ToolSlot";
import {Button} from "../model/Button";
import {Stick} from "../model/Stick";
import {ComponentControllerDefinition} from "../../../AFrame";

export class MovementTool extends AbstractComponentController implements Tool {

    public static DEFINITION = new ComponentControllerDefinition(
        "movement-tool", {
            movementSpeed: {type: 'number', default: 2}, // Meters per second
            rotationSpeed: {type: 'number', default: 1}, // Radians per second
            height: {type: 'number', default: 2},
            width: {type: 'number', default: 0.5},
            jumpStartSpeed: {type: 'number', default: 5.0}
        }, false,
        (component: Component, entity: Entity, data: any) => new MovementTool(component, entity, data)
    );

    movementSpeed: number = 0;
    rotationSpeed: number = 0;
    height: number = 0;
    width: number = 0;
    jumpStartSpeed: number = 0;

    forwardKey: Button = Button.UP;
    backwardKey: Button = Button.DOWN;
    leftKey: Button = Button.LEFT;
    rightKey: Button = Button.RIGHT;
    jumpKey: Button = Button.TRIGGER;

    raycaster: Raycaster | undefined;
    yAxisPositive: Vector3 = new Vector3(0, 1, 0);
    yAxisNegative: Vector3 = new Vector3(0, -1, 0);
    xzPlane: Plane = new Plane(this.yAxisPositive);

    jumping: boolean = false;
    airborne: boolean = false;

    time: number = 0;
    yVelocity: number = 0;
    pressed: Map<Button, number> = new Map();

    centerOfMassPosition: Vector3 = new Vector3(0, 0, 0);

    stickTranslation: Vector3 = new Vector3(0, 0, 0);
    stickRotation: Vector3 = new Vector3(0, 0, 0);
    cameraDirection: Vector3 = new Vector3(0, 0, 0);

    xzCameraDirection: Vector3 = new Vector3(0, 0, 0);
    xDirection: Vector3 = new Vector3(0, 0, 0);
    zDirection: Vector3 = new Vector3(0, 0, 0);
    direction: Vector3 = new Vector3(0, 0, 0);

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        this.interface.setTool(ToolSlot.SECONDARY, this);
    }

    init(): void {
        console.log(this.componentName + " init");

        // Configuration
        this.movementSpeed = this.data.movementSpeed;
        this.rotationSpeed = this.data.rotationSpeed;

        this.height = this.data.height;
        this.width = this.data.width;
        this.jumpStartSpeed = this.data.jumpStartSpeed;

        // Utility objects
        this.raycaster = new Raycaster();

        // Constants
        this.yAxisPositive = new Vector3(0, 1, 0);
        this.yAxisNegative = new Vector3(0, -1, 0);
        this.xzPlane = new Plane(this.yAxisPositive);

        // State booleans
        this.jumping = false;
        this.airborne = false;

        // State variables
        this.time = 0;
        this.yVelocity = 0;

        // Reused vector variables.
        this.centerOfMassPosition = new Vector3(0, 0, 0); // Center of mass for collision checks
        this.centerOfMassPosition.x = this.interface.interfaceEntity!!!!.object3D.position.x;
        this.centerOfMassPosition.y = this.interface.interfaceEntity!!!!.object3D.position.y + this.height / 2;
        this.centerOfMassPosition.z = this.interface.interfaceEntity!!!!.object3D.position.z;

        this.cameraDirection = new Vector3(0, 0, 0);
        this.xzCameraDirection = new Vector3(0, 0, 0);
        this.xDirection = new Vector3(0, 0, 0);
        this.zDirection = new Vector3(0, 0, 0);

    }

    setJumping(state: boolean) {
        if (this.jumping !== state) {
            this.jumping = state;
            this.entityStateChange("jumping", this.jumping);
        }
    }

    setAirborne(state: boolean) {
        if (this.airborne !== state) {
            this.airborne = state;
            this.entityStateChange("airborne", this.airborne);
        }
    }

    entityStateChange(state: string, enabled: boolean) {
        if (enabled) {
            this.interface.interfaceEntity!!.dispatchEvent(new CustomEvent(Events.EVENT_STATE_BEGIN, { detail: new EntityStateEventDetail(state) }));
        } else {
            this.interface.interfaceEntity!!.dispatchEvent(new CustomEvent(Events.EVENT_STATE_END, { detail: new EntityStateEventDetail(state) }));
        }
    }

    update(data: any, oldData: any): void {}

    remove(): void {}

    pause(): void {}

    play(): void {}

    tick(time: number, timeDelta: number): void {
        this.time = time;

        if (timeDelta > 40) {
            timeDelta = 40;
        }

        let collidables = this.interface.getCollidables();
        this.updateXZ(timeDelta, collidables);
        this.updateY(timeDelta, collidables);
        if (this.stickRotation.x != 0 || this.stickRotation.y != 0 || this.stickRotation.z != 0) {
            let delta = this.rotationSpeed * timeDelta / 1000.0;
            this.interface.interfaceEntity!!.object3D.rotation.y -= this.stickRotation.y * delta;
        }
    }


    buttonDown(device: Device, toolSlot: ToolSlot, button: Button): void {
        if (!this.pressed.has(button)) {
            if (button == this.backwardKey) {
                this.entityStateChange("backward", true);
                this.stickTranslation.x = -1;
            }
            if (button == this.forwardKey) {
                this.entityStateChange("forward", true);
                this.stickTranslation.x = 1;
            }
            if (button == this.leftKey) {
                this.entityStateChange("left", true);
                this.stickTranslation.z = -1;
            }
            if (button == this.rightKey) {
                this.entityStateChange("right", true);
                this.stickTranslation.z = 1;
            }
        }
        this.pressed.set(button, this.time);
    }

    buttonUp(device: Device, toolSlot: ToolSlot, button: Button): void {
        if (this.pressed.has(button)) {
            if (button == this.backwardKey) {
                this.entityStateChange("backward", false);
                this.stickTranslation.x = 0;
            }
            if (button == this.forwardKey) {
                this.entityStateChange("forward", false);
                this.stickTranslation.x = 0;
            }
            if (button == this.leftKey) {
                this.entityStateChange("left", false);
                this.stickTranslation.z = 0;
            }
            if (button == this.rightKey) {
                this.entityStateChange("right", false);
                this.stickTranslation.z = 0;
            }
            this.pressed.delete(button)
        }
    }

    stickTwist(device: Device, toolSlot: ToolSlot, stick: Stick, x: number, y: number): void {
        if (stick == Stick.TRANSLATE) {
            this.stickTranslation.x = 1.5 * x;
            this.stickTranslation.z = 1.5 * y;
        }
        if (stick == Stick.ROTATE) {
            this.stickRotation.x = 1.0 * x;
            this.stickRotation.y = 1.0 * y;
        }
    }

    updateXZ(timeDelta: number, collidables: Array<Object3D>) {
        let position = this.interface.interfaceEntity!!.object3D.position;

        if (this.stickTranslation.x != 0 || this.stickTranslation.z != 0) {
            let delta = this.movementSpeed * timeDelta / 1000.0;
            this.computeXZDirectionFromCamera();
            this.centerOfMassPosition.x = this.interface.interfaceEntity!!.object3D.position.x;
            this.centerOfMassPosition.z = this.interface.interfaceEntity!!.object3D.position.z;

            this.xDirection.copy(this.xzCameraDirection);

            this.zDirection.copy(this.xzCameraDirection);
            this.zDirection.cross(this.yAxisPositive);

            this.xDirection.multiplyScalar(this.stickTranslation.x * delta);
            this.zDirection.multiplyScalar(this.stickTranslation.z * delta);

            this.direction.copy(this.xDirection);
            this.direction.add(this.zDirection);

            if (!this.testCollision(this.direction, collidables)) {
                position.x += this.direction.x;
                position.z += this.direction.z;
            }
        }

    }

    updateY(timeDelta: number, collidables: Array<Object3D>) {
        let position = this.interface.interfaceEntity!!.object3D.position;

        var distanceToNearestBelow = this.findDistanceToNearest(this.yAxisNegative, collidables);

        if (this.pressed.has(this.jumpKey) && !this.jumping && !this.airborne) {
            this.setJumping(true);
            this.yVelocity = this.jumpStartSpeed
        }

        let freeDropDelta = this.yVelocity * timeDelta / 1000.0;
        let delta;

        if (distanceToNearestBelow && !this.jumping) {
            let distanceFromBottom = distanceToNearestBelow - this.height / 2;
            if (Math.abs(freeDropDelta) > Math.abs(distanceFromBottom) || Math.abs(distanceFromBottom) < 0.1) {
                delta = -distanceFromBottom;
                this.setAirborne(false);
            } else {
                if (distanceFromBottom && distanceFromBottom < 0) {
                    delta = -freeDropDelta;
                } else {
                    delta = freeDropDelta;
                }
                this.setAirborne(true);
            }
        } else {
            delta = freeDropDelta;
            this.setAirborne(true);
        }

        if (this.airborne) {
            this.yVelocity -= 9.81 * timeDelta / 1000.0;
        } else {
            this.yVelocity = 0;
        }

        if (this.yVelocity < 0) {
            this.setJumping(false);
        }

        this.centerOfMassPosition.y = this.centerOfMassPosition.y + delta;

        position.y = this.centerOfMassPosition.y - this.height/2;
    }

    computeXZDirectionFromCamera() {
        this.interface.cameraEntity!!.object3D.getWorldDirection(this.cameraDirection);
        this.cameraDirection.multiplyScalar(-1);
        this.xzPlane.projectPoint(this.cameraDirection, this.xzCameraDirection);
        this.xzCameraDirection.normalize();
    }

    findDistanceToNearest(rayDirection: Vector3, objects: Array<Object3D>) {
        this.raycaster!!.near = 0;
        this.raycaster!!.far = this.height;
        this.raycaster!!.set(this.centerOfMassPosition, rayDirection);
        var intersects = this.raycaster!!.intersectObjects(objects, true);
        if (intersects.length > 0) {
            return intersects[0].distance;
        } else {
            return null;
        }
    }

    testCollision(direction: Vector3, objects: Array<Object3D>) {
        let distanceToNearestAhead = this.findDistanceToNearest(direction, objects);
        let collisionAhead = distanceToNearestAhead && distanceToNearestAhead < this.width / 2;
        return collisionAhead;
    }
}


