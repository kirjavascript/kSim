import { moveToObject } from './util';

export default function(cube) {

    window.addEventListener('keydown', (e) => {

        if (keys[e.key]) {
            cube.doMove(moveToObject(keys[e.key]));
        }
        
    });
}

let keys = {
    i: 'R',
    I: 'r',
};