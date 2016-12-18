import { setFace, getFace } from './faces';

export default function(cube) {

    if (cube.scrambler == 'CMLL') {
        removeUEdges(cube);
        cube.edges[8] = [6,6];
        cube.edges[10] = [6,6];
    }
    else if (cube.scrambler == 'CLL') {
        removeUEdges(cube);
    }
    else if (cube.scrambler == 'OLL') {
        [...'FRBL']
            .forEach((face) => {
                for (let i=0;i<3;i++) {
                    setFace(cube, {
                        face,
                        value: 6,
                        index: i
                    });
                }

            });
    }
}

function setSolved(cube) {

    let faces = [...'UBRFLD'];

    cube.centres.forEach((centre, faceIndex) => {

        if (faceIndex == 6) return;

        for (let i=0;i<9;i++) {
            setFace(cube, {
                face: faces[faceIndex],
                value: centre,
                index: i
            });
        }

    });

}

function setBlank(cube) {
    removeEdges(cube);
    removeCorners(cube);
}

function removeUEdges(cube) {
    for (let i=0;i<4;i++) {
        cube.edges[i] = [6,6];
    }
}

function removeEdges(cube) {
    cube.edges.replace(Array(12).fill([6,6]));
}

function removeCorners(cube) {
    cube.corners.replace(Array(8).fill([6,6,6]));
}