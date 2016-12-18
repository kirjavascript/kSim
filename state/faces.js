let faces = {
    U: [
        [3,0], [0,0], [0,0],
        [3,0], [0], [1,0],
        [2,0], [2,0], [1,0]
    ],
    D: [
        [6,0], [10,0], [5,0],
        [11,0], [5], [9,0],
        [7,0], [8,0], [4,0]
    ],
    F: [
        [2,1], [2,1], [1,2],
        [6,0], [3], [5,0],
        [6,2], [10,1], [5,1]],
    R: [
        [1,1], [1,1], [0,2],
        [5,1], [2], [4,1],
        [5,2], [9,1], [4,1]
    ],
    L: [
        [3,1], [3,1], [2,2],
        [7,1], [4], [6,1],
        [7,2], [11,1], [6,1]
    ],
    B: [
        [0,1], [0,1], [3,2],
        [4,0], [1], [7,0],
        [4,2], [8,1], [7,1]
    ]
};

export function setFace(cube, { face, index, value, force }) {

    let { centres, corners, edges } = cube;

    let location = faces[face][index];

    // disable setting centres for users
    if (index == 4 && force) {
        centres[location[0]] = value;
    }
    else if (/[0268]/.test(index)) {
        let [a, b] = location;
        corners[a][b] = value;
    }
    else {
        let [a, b] = location;
        edges[a][b] = value;
    }

}

export function getFace(cube, face, asColours) {

    let { centres, corners, edges, colours } = cube;

    let rawFace = faces[face].map((location,i) => {
        if (location.length == 1) {
            return centres[location[0]];
        }
        else if (/[0268]/.test(i)) {
            let [a, b] = location;
            return corners[a][b];
        }
        else {
            let [a, b] = location;
            return edges[a][b];
        }
    });

    return asColours ? rawFace.map((facelet) => colours[facelet])
        : rawFace;
}