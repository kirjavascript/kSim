import { action, computed, observable, autorun } from 'mobx';
import SASSVars from '!!sass-variables!../components/variables.scss';
import keyboard from './keyboard';
import { moveToObject, doMove, solved } from './util';
let { centres, edges, corners } = solved;

class Cube {

    @observable centres = centres;
    @observable edges = edges;
    @observable corners = corners;

    @computed get dFace() {
        let { centres, corners, edges, colours } = this;
        return [
            corners[6][0], edges[10][0], corners[5][0],
            edges[11][0], centres[5], edges[9][0],
            corners[7][0], edges[8][0], corners[4][0]
        ].map((facelet) => colours[facelet]);
    }

    @computed get uFace() {
        let { centres, corners, edges, colours } = this;
        return [
            corners[3][0], edges[0][0], corners[0][0],
            edges[3][0], centres[0], edges[1][0],
            corners[2][0], edges[2][0], corners[1][0]
        ].map((facelet) => colours[facelet]);
    }

    @computed get fFace() {
        let { centres, corners, edges, colours } = this;
        return [
            corners[2][1], edges[2][1], corners[1][2],
            edges[6][0], centres[3], edges[5][0],
            corners[6][2], edges[10][1], corners[5][1]
        ].map((facelet) => colours[facelet]);
    }

    @computed get rFace() {
        let { centres, corners, edges, colours } = this;
        return [
            corners[1][1], edges[1][1], corners[0][2],
            edges[5][1], centres[2], edges[4][1],
            corners[5][2], edges[9][1], corners[4][1]
        ].map((facelet) => colours[facelet]);
    }

    @computed get lFace() {
        let { centres, corners, edges, colours } = this;
        return [
            corners[3][1], edges[3][1], corners[2][2],
            edges[7][1], centres[4], edges[6][1],
            corners[7][2], edges[11][1], corners[6][1]
        ].map((facelet) => colours[facelet]);
    }

    @computed get bFace() {
        let { centres, corners, edges, colours } = this;
        return [
            corners[0][1], edges[0][1], corners[3][2],
            edges[4][0], centres[1], edges[7][0],
            corners[4][2], edges[8][1], corners[7][1]
        ].map((facelet) => colours[facelet]);
    }

    @observable colours = [
        SASSVars.white,
        SASSVars.blue,
        SASSVars.red,
        SASSVars.green,
        SASSVars.orange,
        SASSVars.yellow
    ];

    @action doMove(obj) {
        doMove(this, obj);
    }

    @action doMoves(str) {
        str
            .replace(/\s/g,'')
            .split(/(\w2|\w'|\w)/)
            .filter((m) => m)
            .forEach((m) => {
                doMove(this, moveToObject(m));
            });
    }

    @action reset() {
        this.centres.replace(centres);
        this.edges.replace(edges);
        this.corners.replace(corners);
    }

    constructor(str) {
        // str && this.moves(str);
    }

}


let cube = new Cube();

keyboard(cube);

if (__DEV__) {
    window.cube = cube;
}

export { Cube };
export default cube;