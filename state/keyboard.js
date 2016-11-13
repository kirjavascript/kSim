export default function(cube) {

    window.addEventListener('keydown', (e) => {

        if (keys[e.key]) {
            cube.doMove(keys[e.key]);
        }
        else if (e.key == 'Escape') {
            cube.reset();
        }
        
    });
}

let keys = {
    i: 'R',
    k: 'R\'',
    8: 'R2',
    I: 'r',
    K: 'r\'',
    j: 'U',
    f: 'U\'',
    s: 'D',
    l: 'D\'',
    n: 'F',
    v: 'F\'',
    o: 'B',
    w: 'B\'',
    g: 'M\'',
    r: 'E2',
    u: 'E2',
    h: 'M',
    d: 'L',
    e: 'L\'',
    D: 'l',
    E: 'l\'',
    ';': 'y',
    a: 'y\'',
    y: 'x',
    t: 'x\'',
    p: 'z',
    q: 'z\'',
};