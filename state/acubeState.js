// UF UR UB UL DF DR DB DL FR FL BR BL
// UFR URB UBL ULF DRF DFL DLB DBR

export default function (cube) {
    let { centres, edges, corners } = cube;

    let faces = [...'UBRFLD?'];

    // kSim to acube position translation
    let pos = {
        edges: [2, 1, 0, 3, 10, 9, 8, 11, 5, 6, 4, 7],
        corners: [1, 0, 3, 2, 5, 6, 7, 4]
    };

    // face index is the _index_ the number appears in the centres array
    let edgesOut = pos.edges.map((d) => {
        return edges[d].map((e) => faces[centres.indexOf(e)]);
    });

    let cornersOut = pos.corners.map((d) => {
        // swap positions b and c because acube goes anti-clockwise (?)
        let [a, b, c] = corners[d];
        return [a, c, b].map((e) => faces[centres.indexOf(e)]);
    })
    .map((arr) => {
        // get orientation
        let index = arr.findIndex((d) => ~[...'UD'].indexOf(d));

        // evil array destructuring hacking
        let a,b,c;
        return do {
            if (!index) {
                arr;
            }
            else if (index == 1) {
                ['-', ...([a,b,c]=arr,[b,c,a])];
            }
            else {
                ['+', ...([a,b,c]=arr,[c,a,b])];
            }
        };
    });

    return [
        toString(edgesOut),
        toString(cornersOut)
    ].join` `;
}

function toString(obj) {
    return obj.map((cubie) => {
        if (~cubie.findIndex((d) => d=='?')) {
            return '?';
        }
        else {
            return cubie.join``;
        }
    }).join` `;
}