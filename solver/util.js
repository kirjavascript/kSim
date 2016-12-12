function formatMoves(moves) {
    return moves.map((obj) => {
        let { move, order } = obj;
        return `${move}${order==2?2:order==-1?'\'':''}`;
    }).join` `;
}

function clone(existingArray) {
    let newObj = (existingArray instanceof Array) ? [] : {};
    for (let i in existingArray) {
        if (i == 'clone') continue;
        if (existingArray[i] && typeof existingArray[i] == 'object') {
            newObj[i] = clone(existingArray[i]);
        } else {
            newObj[i] = existingArray[i];
        }
    }
    return newObj;
}

export {
    formatMoves,
    clone
};