import {Object3D, Plane, Raycaster, Vector3} from "three";
import {EntityStateEventDetail} from "../../../model/EntityStateEventDetail";
import {Events} from "../../../model/Events";
import {Component, Entity} from "aframe";
import {Device} from "../Device";
import {Tool} from "../Tool";
import {Slot} from "../model/Slot";
import {Button} from "../model/Button";
import {Stick} from "../model/Stick";
import {raycast} from "../../../three/raycast";
import {AbstractComponentController, ComponentControllerDefinition} from "aframe-typescript-boilerplate";
import {CodeRealityComponentController} from "../../../component/CodeRealityComponentController";


export class WalkTool extends CodeRealityComponentController implements Tool {

    public static DEFINITION = new ComponentControllerDefinition("walk-tool", {
        movementSpeed: {type: 'number', default: 2}, // Meters per second
        rotationSpeed: {type: 'number', default: 1}, // Radians per second
        height: {type: 'number', default: 2},
        width: {type: 'number', default: 0.5},
        jumpStartSpeed: {type: 'number', default: 5.0},
        minY: {type: 'number', default: -1}
    }, false, true, (component: Component, entity: Entity, data: any) => new WalkTool(component, entity, data));

    movementSpeed: number = 0;
    rotationSpeed: number = 0;
    height: number = 0;
    width: number = 0;
    jumpStartSpeed: number = 0;
    minY: number = 0;

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
    highCenterOfMassPosition: Vector3 = new Vector3(0, 0, 0);
    lowCenterOfMassPosition: Vector3 = new Vector3(0, 0, 0);

    forwardPositionStep: Vector3 = new Vector3(0, 0, 0);
    rightPositionStep: Vector3 = new Vector3(0, 0, 0);
    forwardPosition: Vector3 = new Vector3(0, 0, 0);
    backwardPosition: Vector3 = new Vector3(0, 0, 0);
    rightPosition: Vector3 = new Vector3(0, 0, 0);
    leftPosition: Vector3 = new Vector3(0, 0, 0);

    stickTranslation: Vector3 = new Vector3(0, 0, 0);
    stickRotation: Vector3 = new Vector3(0, 0, 0);
    cameraDirection: Vector3 = new Vector3(0, 0, 0);

    xzCameraDirection: Vector3 = new Vector3(0, 0, 0);
    xDirection: Vector3 = new Vector3(0, 0, 0);
    zDirection: Vector3 = new Vector3(0, 0, 0);
    direction: Vector3 = new Vector3(0, 0, 0);

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
        this.interface.registerTool(this);
        this.interface.slotTool(Slot.WALK, this);
    }

    init(): void {
        //console.log(this.componentName + " init");

        // Configuration
        this.movementSpeed = this.data.movementSpeed;
        this.rotationSpeed = this.data.rotationSpeed;
        this.minY = this.data.minY;

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
            this.interface.interfaceEntity!!.dispatchEvent(new CustomEvent(Events.EVENT_STATE_BEGIN, {detail: new EntityStateEventDetail(state)}));
        } else {
            this.interface.interfaceEntity!!.dispatchEvent(new CustomEvent(Events.EVENT_STATE_END, {detail: new EntityStateEventDetail(state)}));
        }
    }

    update(data: any, oldData: any): void {
    }

    remove(): void {
    }

    pause(): void {
    }

    play(): void {
        // Reused vector variables.
        this.setCenterOfMassFromInterfaceEntity();
    }

    setCenterOfMassFromInterfaceEntity() {
        this.centerOfMassPosition = new Vector3(0, 0, 0); // Center of mass for collision checks
        this.centerOfMassPosition.x = this.interface.interfaceEntity!!!!.object3D.position.x;
        this.centerOfMassPosition.y = this.interface.interfaceEntity!!!!.object3D.position.y + this.interface.getSelfScale() * this.height / 2;
        this.centerOfMassPosition.z = this.interface.interfaceEntity!!!!.object3D.position.z;
    }

    tick(time: number, timeDelta: number): void {
        this.time = time;

        if (timeDelta > 40) {
            timeDelta = 40;
        }

        let collidables = this.interface.getCollidables();

        let position = this.interface.interfaceEntity!!.object3D.position;
        const x = this.centerOfMassPosition.x;
        const z = this.centerOfMassPosition.z;

        this.updateXZ(timeDelta, collidables);
        const blocked = this.updateY(timeDelta, collidables);
        if (blocked) {
            this.centerOfMassPosition.x = x;
            this.centerOfMassPosition.z = z;
        } else {
            position.x = this.centerOfMassPosition.x;
            position.z = this.centerOfMassPosition.z;
        }

        if (this.stickRotation.x != 0 || this.stickRotation.y != 0 || this.stickRotation.z != 0) {
            let delta = this.rotationSpeed * timeDelta / 1000.0;
            this.interface.interfaceEntity!!.object3D.rotation.y -= this.stickRotation.y * delta;
        }
    }


    buttonDown(device: Device, toolSlot: Slot, button: Button): void {
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

    buttonUp(device: Device, toolSlot: Slot, button: Button): void {
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

    stickTwist(device: Device, toolSlot: Slot, stick: Stick, x: number, y: number): void {
        if (stick == Stick.PRIMARY) {
            this.stickTranslation.x = 1.5 * x;
            this.stickTranslation.z = 1.5 * y;
        }
        if (stick == Stick.SECONDARY) {
            this.stickRotation.x = 1.0 * x;
            this.stickRotation.y = 1.0 * y;
        }
    }

    updateXZ(timeDelta: number, collidables: Array<Object3D>) {
        this.computeXZDirectionFromCamera();

        if (this.stickTranslation.x != 0 || this.stickTranslation.z != 0) {
            let delta = this.interface.getSelfScale() * this.movementSpeed * timeDelta / 1000.0;

            this.xDirection.copy(this.xzCameraDirection);

            this.zDirection.copy(this.xzCameraDirection);
            this.zDirection.cross(this.yAxisPositive);

            this.xDirection.multiplyScalar(this.stickTranslation.x * delta);
            this.zDirection.multiplyScalar(this.stickTranslation.z * delta);

            this.direction.copy(this.xDirection);
            this.direction.add(this.zDirection);

            if (!this.testCollision(this.direction, collidables)) {
                this.centerOfMassPosition.x += this.direction.x;
                this.centerOfMassPosition.z += this.direction.z;
            }
        }

    }

    updateY(timeDelta: number, collidables: Array<Object3D>) {
        let position = this.interface.interfaceEntity!!.object3D.position;

        //this.computeXZDirectionFromCamera();
        this.forwardPositionStep.copy(this.xzCameraDirection);


        this.forwardPositionStep.multiplyScalar(0.25 * this.width * this.interface.getSelfScale());

        this.rightPositionStep.copy(this.xzCameraDirection);
        this.rightPositionStep.cross(this.yAxisPositive);
        this.rightPositionStep.multiplyScalar(0.25 * this.width * this.interface.getSelfScale());

        this.forwardPosition.copy(this.centerOfMassPosition).add(this.forwardPositionStep);
        this.backwardPosition.copy(this.centerOfMassPosition).add(this.forwardPositionStep.multiplyScalar(-1));
        this.rightPosition.copy(this.centerOfMassPosition).add(this.rightPositionStep);
        this.leftPosition.copy(this.centerOfMassPosition).add(this.rightPositionStep.multiplyScalar(-1));

        const distanceToNearestBelow = this.findDistanceToNearestFromPositions(
            [this.centerOfMassPosition,
                this.forwardPosition,
                this.backwardPosition,
                this.rightPosition,
                this.leftPosition
            ], this.yAxisNegative, collidables);
        //console.log(distanceToNearestBelow);

        if (this.pressed.has(this.jumpKey) && !this.jumping && !this.airborne) {
            this.setJumping(true);
            this.yVelocity = this.interface.getSelfScale() * this.jumpStartSpeed
        }

        let freeDropDelta = this.yVelocity * timeDelta / 1000.0;
        let delta;

        if (distanceToNearestBelow && !this.jumping) {
            let distanceFromBottom = distanceToNearestBelow - this.interface.getSelfScale() * this.height / 2;

            if (distanceFromBottom < 0 && -distanceFromBottom > this.height * this.interface.getSelfScale() * 0.25) {
                // Too high obstacle to climb (greater than 0.25 height)
                return true;
            }

            if (Math.abs(freeDropDelta) > Math.abs(distanceFromBottom) || Math.abs(distanceFromBottom) < 0.1 * this.interface.getSelfScale()) {
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
            this.yVelocity -= this.interface.getSelfScale() * 9.81 * timeDelta / 1000.0;
        } else {
            this.yVelocity = 0;
        }

        if (this.yVelocity < 0) {
            this.setJumping(false);
        }

        this.centerOfMassPosition.y = this.centerOfMassPosition.y + delta;

        if (this.centerOfMassPosition.y - this.interface.getSelfScale() * this.height / 2 < this.minY) {
            this.centerOfMassPosition.y = this.minY + this.interface.getSelfScale() * this.height / 2;
        }

        position.y = this.centerOfMassPosition.y - this.interface.getSelfScale() * this.height / 2;
        return false;
    }

    computeXZDirectionFromCamera() {
        this.interface.cameraEntity!!.object3D.getWorldDirection(this.cameraDirection);
        this.cameraDirection.multiplyScalar(-1);
        this.xzPlane.projectPoint(this.cameraDirection, this.xzCameraDirection);
        this.xzCameraDirection.normalize();
    }

    findDistanceToNearestFromPositions(positions: Array<Vector3>, rayDirection: Vector3, objects: Array<Object3D>): number | undefined {
        const distances = positions.map(position => {
            return this.findDistanceToNearestFromPosition(position, rayDirection, objects);
        }).filter(distance => distance != null);
        distances.sort(function sortNumber(a, b) {
            return a!! - b!!;
        });
        if (distances.length > 0) {
            return distances[0]!!;
        } else {
            return undefined;
        }
    }

    findDistanceToNearestFromPosition(position: Vector3, rayDirection: Vector3, objects: Array<Object3D>) {
        this.raycaster!!.near = 0;
        this.raycaster!!.far = this.height * this.interface.getSelfScale();
        this.raycaster!!.set(position, rayDirection);

        const caster = this.raycaster!!;
        const intersects = raycast(objects, caster);
        if (intersects.length > 0) {
            return intersects[0].distance;
        } else {
            return null;
        }
    }

    testCollision(direction: Vector3, objects: Array<Object3D>) {
        this.highCenterOfMassPosition.copy(this.centerOfMassPosition);
        this.highCenterOfMassPosition.y += this.height * this.interface.getSelfScale() / 2;
        this.lowCenterOfMassPosition.copy(this.centerOfMassPosition);
        this.lowCenterOfMassPosition.y -= this.height * this.interface.getSelfScale() / 4;


        let distanceToNearestAhead = this.findDistanceToNearestFromPositions([this.centerOfMassPosition,
            this.highCenterOfMassPosition,
            this.centerOfMassPosition,
            this.lowCenterOfMassPosition
        ], direction, objects);

        let collisionAhead = distanceToNearestAhead && distanceToNearestAhead < this.interface.getSelfScale() * this.width / 2;
        return collisionAhead;
    }
}


