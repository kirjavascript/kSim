/*
    allowed moves
    to remove trivial simplifications;
    disallow "LR" "BF" "DU" pairs,
    allow "RL" "FB" "UD" pairs
*/


let allowed = {
    root: 'URFDLB',
    U: 'RFDLB',
    R: 'UFDLB',
    F: 'URDLB',
    D: 'RFLB',
    L: 'UFDB',
    B: 'URDL'
};

// expand allowed moves
Object
    .keys(allowed)
    .forEach((move) => {
        let moves = [...allowed[move]]
            .map((move) => [
                {move, order: 1},
                {move, order: -1},
                {move, order: 2},
            ]);

        allowed[move] = [].concat(...moves);
    });

export {
    allowed
};