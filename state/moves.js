/*
 1
402
 3
 5
*/

let solved = {
    centres: [
        // U B R F L D
        0, 1, 2, 3, 4, 5
    ],
    edges: [ 
        // UB UR UF UL
        [0,1],[0,2],[0,3],[0,4],
        // BR FR FL BL
        [1,2],[3,2],[3,4],[1,4],
        // DB DR DF DL
        [5,1],[5,2],[5,3],[5,4]
    ],
    corners: [
        // UBR URF UFL ULB
        [0,1,2],[0,2,3],[0,3,4],[0,4,1],
        // DRB DFR DLF DBL
        [5,2,1],[5,3,2],[5,4,3],[5,1,4]
    ]
};

let moveList = {
    R (cube, order) {
        let { edges, corners } = cube;
        doCycle(edges, order, [5, 9, 4, 1]);
        doCycle(corners, order, [5, 4, 0, 1], [-1, 1, -1, 1]);
    },
    U (cube, order) {
        let { edges, corners } = cube;
        doCycle(edges, order, [3, 2, 1, 0]);
        doCycle(corners, order, [3, 2, 1, 0]);
    },
    F (cube, order) {
        let { edges, corners } = cube;
        doCycle(edges, order, [6, 10, 5, 2], [1, 1, 1, 1]);
        doCycle(corners, order, [1, 2, 6, 5], [-1, 1, -1, 1]);
    },
    L (cube, order) {
        let { edges, corners } = cube;
        doCycle(edges, order, [3, 7, 11, 6]);
        doCycle(corners, order, [2, 3, 7, 6], [-1, 1, -1, 1]);
    },
    B (cube, order) {
        let { edges, corners } = cube;
        doCycle(edges, order, [4, 8, 7, 0], [1, 1, 1, 1]);
        doCycle(corners, order, [4, 7, 3, 0], [-1, 1, -1, 1]);
    },
    D (cube, order) {
        let { edges, corners } = cube;
        doCycle(edges, order, [8, 9, 10, 11]);
        doCycle(corners, order, [4, 5, 6, 7]);
    },
    M (cube, order) {
        let { edges, centres } = cube;
        doCycle(centres, order, [0, 1, 5, 3]);
        doCycle(edges, order, [2, 0, 8, 10], [1, 1, 1, 1]);
    },
    E (cube, order) {
        let { edges, centres } = cube;
        doCycle(centres, order, [3, 4, 1, 2]);
        doCycle(edges, order, [4, 5, 6, 7], [1, 1, 1, 1]);
    },
    S (cube, order) {
        let { edges, centres } = cube;
        doCycle(centres, order, [4, 5, 2, 0]);
        doCycle(edges, order, [3, 11, 9, 1], [1, 1, 1, 1]);
    },
    r (cube, order) {
        doMove(cube, {order, move: 'R' });
        doMove(cube, invertOrder({order, move: 'M' }));
    },
    l (cube, order) {
        doMove(cube, {order, move: 'L' });
        doMove(cube, {order, move: 'M' });
    },
    f (cube, order) {
        doMove(cube, {order, move: 'F' });
        doMove(cube, {order, move: 'S' });
    },
    b (cube, order) {
        doMove(cube, {order, move: 'B' });
        doMove(cube, invertOrder({order, move: 'S' }));
    },
    u (cube, order) {
        doMove(cube, {order, move: 'U' });
        doMove(cube, invertOrder({order, move: 'E' }));
    },
    d (cube, order) {
        doMove(cube, {order, move: 'D' });
        doMove(cube, {order, move: 'E' });
    },
    y (cube, order) {
        doMove(cube, {order, move: 'U' });
        doMove(cube, invertOrder({order, move: 'E' }));
        doMove(cube, invertOrder({order, move: 'D' }));
    },
    x (cube, order) {
        doMove(cube, {order, move: 'R' });
        doMove(cube, invertOrder({order, move: 'M' }));
        doMove(cube, invertOrder({order, move: 'L' }));
    },
    z (cube, order) {
        doMove(cube, {order, move: 'F' });
        doMove(cube, {order, move: 'S' });
        doMove(cube, invertOrder({order, move: 'B' }));
    },
};

function doMove(cube, obj) {
    let order, move;
    if (typeof obj == 'string') {
        obj = moveToObject(obj);
    }
    order = obj.order;
    move = obj.move;

    if (moveList[move]) {
        moveList[move](cube, order);
    }
    else {
        console.warn(`Unknown move ${move}`);
    }
}

function doCycle(arr, order, cycle, twists) {
    if (order == -1) {
        cycle = cycle.reverse();
        twists && (twists = twists.reverse());
    }
    else if (order == 2) {
        doCycle(arr, 1, cycle, twists);
    }
    // corner twists
    if (twists) {
        for (let i=0;i<twists.length;i++) {
            twist(arr, cycle[i], twists[i]);
        }
    }

    // cycles
    for (let i=0;i<cycle.length-1;i++) {
        swap(arr, cycle[i], cycle[i+1]);
    }

}

function swap(arr, first, second) {
    let tmp = arr[first];
    arr[first] = arr[second]; 
    arr[second] = tmp;
}

function twist(arr, cubieIndex, order) {
    let cubie = arr[cubieIndex];
    // edges
    if (cubie.length == 2) {
        cubie.push(cubie.splice(0, 1)[0]);
    }
    else {
        //corners 
        if (order == 1) {
            cubie.splice(0, 0, cubie.splice(2, 1)[0]);
        }
        else if (order == -1) {
            cubie.splice(2, 0, cubie.splice(0, 1)[0]);
        }
    }
}

function invertOrder(obj) {
    if (obj.order != 2) {
        obj.order = obj.order == 1 ? -1 : 1;
    }
    return obj;
}

function moveToObject(move) {
    let order = do {
        if (move[1]=='\'') -1;
        else if (move[1]=='2') 2;
        else 1;
    };
    return {
        move: move[0],
        order,
    };
}

function cloneArray(arr) {
    return arr.map((d) => [...d]);
}

export {
    doMove,
    moveToObject,
    moveList,
    solved
};