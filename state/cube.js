import { action, computed, observable, autorun, toJS } from 'mobx';
import SASSVars from '!!sass-variables!../components/variables.scss';
import keyboard from './keyboard';
import storage from './storage';
import scramble from '../lib/scramble';
import acube from './acubeState';
import { moveToObject, doMove, solved } from './moves';
import { setFace, getFace } from './faces';
import { timeStamp, parseTimes } from './times';
let { centres, edges, corners } = solved;

class Cube {

    @observable centres = centres;
    @observable edges = edges;
    @observable corners = corners;

    @computed get position() {
        return {
            centres: toJS(this.centres),
            edges: toJS(this.edges),
            corners: toJS(this.corners),
        };
    }

    @observable colours = [
        SASSVars.white,
        SASSVars.blue,
        SASSVars.red,
        SASSVars.green,
        SASSVars.orange,
        SASSVars.yellow,
        SASSVars.lightgrey
    ];

    // faces

    @computed get uFace() { return getFace(this, 'U', true); }
    @computed get rFace() { return getFace(this, 'R', true); }
    @computed get fFace() { return getFace(this, 'F', true); }
    @computed get dFace() { return getFace(this, 'D', true); }
    @computed get lFace() { return getFace(this, 'L', true); }
    @computed get bFace() { return getFace(this, 'B', true); }

    @action setFace(obj) { return setFace(this, obj); }

    // acube.js

    @computed get acube() { return acube(this); }

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

    // move history

    @observable history = [];
    @observable historyMove = 0;

    @action historyAdd(obj) {
        if (this.historyMove != this.history.length) {
            this.history
                .replace(cube.history.splice(0, this.historyMove));
        }
        this.history.push(obj);
        this.historyMove++;
    }

    // timer stuff

    @observable state = 'idle'; // idle, ready, running
    @observable scramble = '';
    @observable scrambler = 'Random';
    @observable rawTimer = 0;
    @observable rawTimes = [];
    @computed get times() { return parseTimes(this.rawTimes); }
    @computed get timer() { return timeStamp(this.rawTimer); }

    @action startTimer() {
        this.state = 'running';
        let startTime = performance.now();
        this.timerLoop = () => {
            if (this.timerLoop) {
                requestAnimationFrame(this.timerLoop);
                this.rawTimer = performance.now() - startTime;
            }
        };
        this.timerLoop();
    }

    @action stopTimer(solved) {
        this.timerLoop = null;
        this.state = 'idle';

        if (!solved) {
            this.rawTimer = null;
        }

        let { scramble, history } = this;

        this.rawTimes.push({
            time: this.rawTimer, scramble, history
        });
    }

    @action newScramble() {
        this.reset();
        this.scramble = scramble(this.scrambler);
        this.doMoves(this.scramble, true);
        this.rawTimer = 0;
        this.state = 'ready';
    }

    @computed get solved() {
        return [...'URBLDF']
            .map((face) => (
                getFace(this, face)
                    .filter((d) => d != 6)
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
            this.rawTimer = 0;
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

    @action reset(full = true) {
        this.softReset();
        this.history.replace([]);
        this.historyMove = 0;
        this.scramble = '';
    }

}


let cube = new Cube();

// load / save to localStorage
storage(cube, 'cube');

// fix timer bug
if (cube.state == 'running' && !cube.timerLoop) {
    cube.stopTimer(false);
}

// attach keyboard events
keyboard(cube); 

if (__DEV__) {
    window.cube = cube;
}

export { Cube };
export default cube;