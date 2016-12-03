import config from './config';

export default function(cube) {

    // load defaults if empty
    if (!config.keymapArray.length) {
        config.keymapArray.replace(defaultKeys);
    }

    window.addEventListener('keydown', (e) => {

        let { tagName, type } = e.target;
        if (tagName.toLowerCase() == 'input' && type == 'text') {
            return;
        }

        if (config.keymap[e.key]) {
            cube.doMoves(config.keymap[e.key]);
        }
        else if (e.key == ' ') {
            cube.spacebar();
        }
        else if (e.key == 'Escape') {
            cube.escape();
        }
        
    });
}

let defaultKeys = [
    ['i', 'R'],
    ['k', 'R\''],
    ['8', 'R2'],
    ['u', 'r'],
    ['m', 'r\''],
    ['j', 'U'],
    ['f', 'U\''],
    ['s', 'D'],
    ['l', 'D\''],
    ['n', 'F'],
    ['v', 'F\''],
    ['o', 'B\''],
    ['w', 'B'],
    ['g', 'M\''],
    ['J', 'E2'],
    ['F', 'E2'],
    ['h', 'M'],
    ['d', 'L'],
    ['e', 'L\''],
    ['3', 'L2'],
    ['c', 'l'],
    ['r', 'l\''],
    [';', 'y'],
    ['a', 'y\''],
    ['y', 'x'],
    ['t', 'x\''],
    ['p', 'z'],
    ['q', 'z\'']
];