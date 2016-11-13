import config from './config';

export default function(cube) {

    // load defaults if empty
    if (!config.keymapArray.length) {
        config.keymapArray.replace(defaultKeys);
    }

    window.addEventListener('keydown', (e) => {

        if (e.target.tagName.toLowerCase() == 'input') {
            return;
        }

        if (config.keymap[e.key]) {
            cube.doMoves(config.keymap[e.key]);
        }
        else if (e.key == ' ') {
            cube.scramble();
        }
        else if (e.key == 'Escape') {
            cube.reset();
        }
        
    });
}

let defaultKeys = [
    ['i', 'R'],
    ['k', 'R\''],
    ['8', 'R2'],
    ['I', 'r'],
    ['K', 'r\''],
    ['j', 'U'],
    ['f', 'U\''],
    ['s', 'D'],
    ['l', 'D\''],
    ['n', 'F'],
    ['v', 'F\''],
    ['o', 'B\''],
    ['w', 'B'],
    ['g', 'M\''],
    ['r', 'E2'],
    ['u', 'E2'],
    ['h', 'M'],
    ['d', 'L'],
    ['e', 'L\''],
    ['D', 'l'],
    ['E', 'l\''],
    [';', 'y'],
    ['a', 'y\''],
    ['y', 'x'],
    ['t', 'x\''],
    ['p', 'z'],
    ['q', 'z\'']
];