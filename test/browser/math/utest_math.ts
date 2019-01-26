import {RealityClient} from "reality-space";
import { expect } from 'chai';
import {snapNumberToAxisAlignedGrid, snapVector3ToAxisAlignedGrid} from "../../../src/browser/math/math";
import {Vector3} from "three";
import {Entity} from "aframe";

describe('Math tests.', () => {

    it('Test number snap to grid.', async () => {
        expect(snapNumberToAxisAlignedGrid(0, 0.5)).eq(0);

        expect(snapNumberToAxisAlignedGrid(0.1, 0.5)).eq(0);
        expect(snapNumberToAxisAlignedGrid(0.4, 0.5)).eq(0.5);
        expect(snapNumberToAxisAlignedGrid(0.5, 0.5)).eq(0.5);
        expect(snapNumberToAxisAlignedGrid(0.6, 0.5)).eq(0.5);
        expect(snapNumberToAxisAlignedGrid(0.9, 0.5)).eq(1);
        expect(snapNumberToAxisAlignedGrid(1, 0.5)).eq(1);

        expect(snapNumberToAxisAlignedGrid(-0.1, 0.5)).eq(0);
        expect(snapNumberToAxisAlignedGrid(-0.4, 0.5)).eq(-0.5);
        expect(snapNumberToAxisAlignedGrid(-0.5, 0.5)).eq(-0.5);
        expect(snapNumberToAxisAlignedGrid(-0.6, 0.5)).eq(-0.5);
        expect(snapNumberToAxisAlignedGrid(-0.9, 0.5)).eq(-1);
        expect(snapNumberToAxisAlignedGrid(-1, 0.5)).eq(-1);

    });

    it('Test vector3 snap to grid.', async () => {
        expect(snapVector3ToAxisAlignedGrid(new Vector3(0.4, 1.4, 2.4), 0.5).toString()).eq(new Vector3(0.5, 1.5, 2.5).toString());
    });

});