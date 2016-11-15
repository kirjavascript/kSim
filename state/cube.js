import { action, computed, observable, autorun } from 'mobx';
import SASSVars from '!!sass-variables!../components/variables.scss';
import keyboard from './keyboard';
import scramble from '../lib/scramble';
import { moveToObject, doMove, solved } from './moves';
let { centres, edges, corners } = solved;

class Cube {

    @observable centres = centres;
    @observable edges = edges;
    @observable corners = corners;

    @observable colours = [
        SASSVars.white,
        SASSVars.blue,
        SASSVars.red,
        SASSVars.green,
        SASSVars.orange,
        SASSVars.yellow
    ];

    // faces

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

    // moves

    @action doMove(obj, noHistory=false) {
        if (!noHistory) {
            this.historyAdd(obj);
        }
        if (this.state == 'ready'
            && !/(x|y|z)/.test(obj)) {
            this.startTimer();
        }
        doMove(this, obj);
    }

    @action doMoves(str, noHistory=false) {
        str
            .replace(/\s/g,'')
            .split(/(\w2|\w'|\w)/)
            .filter((move) => move)
            .forEach((move) => {
                this.doMove(move, noHistory);
            });
    }

    // history

    @observable history = [];
    @observable historyMove = 0;

    @action historyAdd(obj) {
        // check historyMove == length
        if (this.historyMove != this.history.length) {
            this.history.replace(cube.history.splice(0, this.historyMove));
        }
        this.history.push(obj);
        this.historyMove++;
    }

    // timer stuff

    @observable state = 'idle'; // idle, ready, running
    @observable scramble = '';
    @observable timer = 0;

    @action startTimer() {
        this.state = 'running';
        let startTime = performance.now();
        this.timerLoop = () => {
            requestAnimationFrame(this.timerLoop);
            let diff = performance.now() - startTime;
            let seconds = (diff/1000).toFixed(2);
            let minutes = (seconds/60)|0;
            if (minutes) {
                seconds = (seconds%60).toFixed(2);
                seconds = seconds < 10 ? '0' + seconds : seconds;
                this.timer = `${minutes}:${seconds}`;
            }
            else {
                this.timer = seconds;
            }
        };
        this.timerLoop();
    }

    @action stopTimer(solved) {
        this.timerLoop = null;
        this.state = 'idle';
        if (!solved) {
            this.timer = 'DNF';
        }
        // add time
    }

    @action newScramble() {
        this.reset();
        this.scramble = scramble();
        this.doMoves(this.scramble, true);
        this.timer = 0;
        this.state = 'ready';
    }

    @computed get solved() {
        return [...'urbldf']
            .map((face) => (
                this[`${face}Face`]
                    .filter((d,i,a)=>a.indexOf(d)==i)
                    .length
            ))
            .reduce((a,b)=>a+b) == 6;
    }

    @action escape() {
        this.reset();
        if (~['running','ready'].indexOf(this.state)) {
            this.stopTimer(false);
        }
        else if (this.state == 'idle') {
            this.timer = 0;
        }
    }

    @action spacebar() {
        if (this.state == 'idle') {
            this.newScramble();
        }
        else if (this.state == 'running' && this.solved) {
            this.stopTimer(true);
        }
    }

    // etc

    @action softReset() {
        this.centres.replace(centres);
        this.edges.replace(edges);
        this.corners.replace(corners);
    }

    @action reset() {
        this.softReset();
        this.history.replace([]);
        this.historyMove = 0;
        this.scramble = '';
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