// UF UR UB UL DF DR DB DL FR FL BR BL
// UFR URB UBL ULF DRF DFL DLB DBR

export default function (cube) {
    let { centres, edges, corners } = cube;

    let faces = [...'UBRFLD'];

    // kSim to acube position translation
    let pos = {
        edges: [2, 1, 0, 3, 10, 9, 8, 11, 5, 6, 4, 7],
        corners: []
    };

    // face index is the _index_ the number appears in the centres array
    let edgesOut = pos.edges.map((d) => {
        return edges[d].map((e) => faces[centres.indexOf(e)]);
    });

    return {
        centres,
        edges: edgesOut.map((d) => d.join``).join` `
    };
}