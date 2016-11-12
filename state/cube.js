import { action, computed, observable, autorun } from 'mobx';
import SASSVars from '!!sass-variables!../components/variables.scss';
import keyboard from './keyboard';
import { moveToObject, cloneArray, doCycle } from './util';

class Cube {

    /*
     1
    402
     3
     5
    */

    @observable centres = [
        // U B R F L D
        0, 1, 2, 3, 4, 5
    ];

    @observable edges = [
        // UB UR UF UL
        [0,1],[0,2],[0,3],[0,4],
        // BR FR FL BL
        [1,2],[3,2],[3,4],[1,4],
        // DB DR DF DL
        [5,1],[5,2],[5,3],[5,4]
    ];

    @observable corners = [
        // UBR URF UFL ULB
        [0,1,2],[0,2,3],[0,3,4],[0,4,1],
        // DRB DFR DLF DBL
        [5,2,1],[5,3,2],[5,4,3],[5,1,4]
    ];

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
            edges[6][1], centres[4], edges[7][1],
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
        let { order, move } = obj;

        if (this.moveList[move]) {
            this::this.moveList[move](order);
        }
        else {
            console.warn(`Unknown move ${move}`);
        }
    }

    moveList = {
        R (order) {
            let { edges, corners } = this;
            doCycle(edges, order, [5, 9, 4, 1]);
            doCycle(corners, order, [5, 4, 0, 1], [-1, 1, 1, -1]);
        }
    }

    @action doMoves(str) {
        str
            .replace(/\s/g,'')
            .split(/(\w2|\w'|\w)/)
            .filter((m) => m)
            .forEach((m) => {
                this.doMove(moveToObject(m));
            });
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

export default cube;