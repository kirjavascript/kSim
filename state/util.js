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