export function uFace(cube) {
    let { centres, corners, edges, colours } = cube;
    return [
        corners[3][0], edges[0][0], corners[0][0],
        edges[3][0], centres[0], edges[1][0],
        corners[2][0], edges[2][0], corners[1][0]
    ].map((facelet) => colours[facelet]);
}

export function dFace(cube) {
    let { centres, corners, edges, colours } = cube;
    return [
        corners[6][0], edges[10][0], corners[5][0],
        edges[11][0], centres[5], edges[9][0],
        corners[7][0], edges[8][0], corners[4][0]
    ].map((facelet) => colours[facelet]);
}

export function fFace(cube) {
    let { centres, corners, edges, colours } = cube;
    return [
        corners[2][1], edges[2][1], corners[1][2],
        edges[6][0], centres[3], edges[5][0],
        corners[6][2], edges[10][1], corners[5][1]
    ].map((facelet) => colours[facelet]);
}

export function rFace(cube) {
    let { centres, corners, edges, colours } = cube;
    return [
        corners[1][1], edges[1][1], corners[0][2],
        edges[5][1], centres[2], edges[4][1],
        corners[5][2], edges[9][1], corners[4][1]
    ].map((facelet) => colours[facelet]);
}

export function lFace(cube) {
    let { centres, corners, edges, colours } = cube;
    return [
        corners[3][1], edges[3][1], corners[2][2],
        edges[7][1], centres[4], edges[6][1],
        corners[7][2], edges[11][1], corners[6][1]
    ].map((facelet) => colours[facelet]);
}

export function bFace(cube) {
    let { centres, corners, edges, colours } = cube;
    return [
        corners[0][1], edges[0][1], corners[3][2],
        edges[4][0], centres[1], edges[7][0],
        corners[4][2], edges[8][1], corners[7][1]
    ].map((facelet) => colours[facelet]);
}