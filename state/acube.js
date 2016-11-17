// UF UR UB UL DF DR DB DL FR FL BR BL
// UFR URB UBL ULF DRF DFL DLB DBR 

export default function (cube) {
    let { centres, edges, corners } = cube;

    let faces = [...'UBRFLD'];

    // I don't actually know why this works >_<
    // let letters = centres.map((d)=>faces[d]);
    // let lettersMap = centres.map((d)=>letters[d]);
    // let lettersRemap = centres.map((d)=>lettersMap[d]);

    // let pos = {
    //     edges: [2, 1, 0, 3, 10, 9, 8, 11]
    // };

    // let asd = pos.edges.map((d) => {
    //     return edges[d].map((e) => lettersRemap[e]);
    // });

    // U,FF,RU,RU,L\

    return JSON.stringify({
        // centres,
        // letters,
        // edges,
        // asd: asd.map((d) => d.join``).join` `
    });
}