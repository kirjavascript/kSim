import { solved, doMove } from '../state/moves';
let { centres, edges, corners } = solved;

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

let position = {'centres':[0,1,2,3,4,5,6],'edges':[[0,2],[3,2],[0,3],[0,4],[1,2],[0,1],[3,4],[1,4],[5,1],[5,2],[5,3],[5,4]],'corners':[[4,1,0],[3,2,5],[0,3,4],[0,1,2],[5,2,1],[2,3,0],[5,4,3],[5,1,4]]};

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

    // postMessage(formatMoves(moves));

    // TODO: check solved

    if (depth == 4) {
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