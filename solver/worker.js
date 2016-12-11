// import { solved, doMove } from '../state/moves';
// import cube from '../state/cube';

/*
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

~function tree(moves=[], depth=0) {

    postMessage(formatMoves(moves));

    // TODO: check solved

    if (depth == 5) {
        return;
    }

    let lastMove = (!depth?'root':moves[moves.length-1].move);
    let allowedMoves = allowed[lastMove];

    for (let i=0;i<allowedMoves.length;i++) {
        tree([...moves, allowedMoves[i]], depth + 1);
    }

} ();

function formatMoves(moves) {
    return moves.map((obj) => {
        let { move, order } = obj;
        return `${move}${order==2?2:order==-1?'\'':''}`;
    }).join` `;
}