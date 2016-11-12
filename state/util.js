export function doCycle(arr, order, cycle, twists) {
    if (order == -1) {
        cycle = cycle.reverse();
    }
    else if (order == 2) {
        doCycle(arr, 1, cycle, twists);
    }

    // cycles
    for (let i=0;i<cycle.length-1;i++) {
        swap(arr, cycle[i], cycle[i+1]);
    }
    // corner twists
    if (arr.length == 8 && twists) {
        for (let i=0;i<twists.length;i++) {
            twist(arr, cycle[i], twists[i]);
        }
    }
}

function swap(arr, first, second) {
    let tmp = arr[first];
    arr[first] = arr[second]; 
    arr[second] = tmp;
}

function twist(arr, pos) {
}

export function moveToObject(move) {
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



export function cloneArray(arr) {
    return arr.map((d) => [...d]);
}