import { solved, doMove } from '../state/moves';
import { formatMoves, clone } from './util';
import { allowed } from './allowed';
import { checkSolved } from './check-solved';

// split permutation/orientation

// TypedArrays
// String()

~function search(maxDepth) {

    let position = {'edges':[[0,4],[5,2],[3,4],[5,3],[3,2],[0,1],[1,2],[1,4],[5,1],[0,2],[0,3],[5,4]],'corners':[[5,3,2],[4,1,0],[3,4,0],[0,1,2],[0,2,3],[4,3,5],[5,2,1],[5,1,4]]};

    for (let i=0;i<maxDepth+1;i++) {
        postMessage(`searching depth ${i}`);
        tree([position], [], i);
    }
    postMessage('done');

} (6);

function tree(stack, moves, depth) {

    let lastPosition = stack[stack.length-1];

    if (depth === 0) {
        // only check solutions at the leaf nodes
        if (checkSolved(lastPosition)) {
            postMessage(formatMoves(moves));
        }
        return;
    }

    let lastMove = (moves.length===0?'root':moves[moves.length-1].move);
    let allowedMoves = allowed[lastMove];

    for (let i=0;i<allowedMoves.length;i++) {

        let newMove = allowedMoves[i];
        let newPosition = clone(lastPosition);
        doMove(newPosition, newMove);
        moves.push(newMove);
        stack.push(newPosition);

        tree(stack, moves, depth - 1);

        stack.pop();
        moves.pop();
    }

}