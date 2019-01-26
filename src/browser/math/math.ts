import {Vector3} from "three";

/**
 * Snaps vector to axis aligned grid.
 * @param vector the vector
 * @param step the grid step
 */
export function snapVector3ToAxisAlignedGrid(vector: Vector3, step: number): Vector3 {
    const snappedPosition = new Vector3();
    snappedPosition.x = snapNumberToAxisAlignedGrid(vector.x, step);
    snappedPosition.y = snapNumberToAxisAlignedGrid(vector.y, step);
    snappedPosition.z = snapNumberToAxisAlignedGrid(vector.z, step);
    return snappedPosition;
}


/**
 * Snap number to grid.
 * @param number the number
 * @param step the grid step
 */
export function snapNumberToAxisAlignedGrid(number: number, step: number): number {
    return Math.round(number / step) * step;
}