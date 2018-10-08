import {Quaternion, Vector3} from "three";

export class Spring {


    relaxationTime: number = 1.2;
    currentPosition: Vector3 = new Vector3();
    targetPosition: Vector3 = new Vector3();
    temporary: Vector3 = new Vector3();

    currentOrientation: Quaternion = new Quaternion();
    targetOrientation: Quaternion = new Quaternion();


    simulate(t: number) {
        // Calculate distance between current position and target position.
        const totalDistance = this.currentPosition.distanceTo(this.targetPosition);
        const v = Math.pow(totalDistance / this.relaxationTime, 2);
        const s = v * t;

        // Calculate normalized direction vector between current position and target position.
        this.temporary.copy(this.targetPosition);
        this.temporary.sub(this.currentPosition).normalize();

        // Calculate delta vector.
        this.temporary.multiplyScalar(s);

        // Add delta to current position-
        this.currentPosition.add(this.temporary);

        // Interpolate orientation change
        this.currentOrientation.slerp(this.targetOrientation, t / this.relaxationTime);
        this.currentOrientation.normalize();

    }

}