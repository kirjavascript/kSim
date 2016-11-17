import { action, computed, observable, autorun } from 'mobx';
import SASSVars from '!!sass-variables!../components/variables.scss';
import keyboard from './keyboard';
import storage from './storage';
import scramble from '../lib/scramble';
import acube from './acube';
import { moveToObject, doMove, solved } from './moves';
import { uFace, rFace, fFace, dFace, lFace, bFace } from './faces';
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

    @computed get uFace() { return uFace(this); }
    @computed get rFace() { return rFace(this); }
    @computed get fFace() { return fFace(this); }
    @computed get dFace() { return dFace(this); }
    @computed get lFace() { return lFace(this); }
    @computed get bFace() { return bFace(this); }

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

    // history

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
    @observable timer = 0;

    @action startTimer() {
        this.state = 'running';
        let startTime = performance.now();
        this.timerLoop = () => {
            if (this.timerLoop) {
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
                // return diff
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
        // add time (get diff)
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

}


let cube = new Cube();

// attach keyboard events
keyboard(cube);

// load / save to localStorage
storage(cube, 'cube');

// fix timer bug
if (cube.state == 'running' && !cube.timerLoop) {
    cube.stopTimer(false);
}

if (__DEV__) {
    window.cube = cube;
}

export { Cube };
export default cube;