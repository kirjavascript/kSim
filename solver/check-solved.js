import { solved } from '../state/moves';
let { centres, edges, corners } = solved;

function checkSolved(position) {

    // edges
    for (let i=0;i<12;i++) {
        if (position.edges[i][0] != edges[i][0])
            return 0;
        else if (position.edges[i][1] != edges[i][1])
            return 0;
    }
    //corners
    for (let i=0;i<8;i++) {
        if (position.corners[i][0] != corners[i][0])
            return 0;
        else if (position.corners[i][1] != corners[i][1])
            return 0;
        else if (position.corners[i][2] != corners[i][2])
            return 0;
    }

    return 1;
}

// function getChecker(solvedHash);


export {
    checkSolved
};