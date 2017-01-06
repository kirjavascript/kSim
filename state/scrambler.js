import scramble333 from '#lib/scramble';
import alg from '#lib/alg';
import { setFace, getFace } from './faces';

export default function (cube) {

    let type = cube.scrambler;
    let scramble;

    if (~type.indexOf('ZBLL ')) {
        let subType = type.replace(/^ZBLL /,'');
        scramble = scramble333.getZBLLSubScramble(...(subGroup[subType])) + auf();
    }
    else if (~type.indexOf('OLLCP')) {
        let subType = type.replace(/^OLLCP /,'');

        [...'FRBL']
            .forEach((face) => {
                setFace(cube, {
                    face,
                    value: 6,
                    index: 1
                });
            });

        if (subType == 'OLLCP') {
            scramble = scramble333.getLLScramble() + auf();
        }
        else {
            scramble = scramble333.getLLSubScramble(...(subGroup[subType])) + auf();
        }        

    }
    else if (type == 'CLL') {
        removeUEdges(cube);
        scramble = scramble333.getCLLScramble();
    }
    else if (type == 'OLL') {
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
        scramble = scramble333.getOLLScramble();
    }
    else if (type == 'CMLL') {
        removeUEdges(cube);
        cube.edges[8] = [6,6];
        cube.edges[10] = [6,6];
        scramble = scramble333.getCMLLScramble();
    }
    else if (type == 'LSE') {
        scramble = scramble333.getLSEScramble() + auf() + m2();
    }
    else {
        scramble = scramble333[`get${type}Scramble`]();
    }

    return alg.cube.simplify(scramble);
}

let subGroup = {
    'U': [1701, 3],
    'T': [1215, 3],
    'AS': [351, 3],
    'S': [1674, 6],
    'L': [513, 3],
    'Pi': [1404, 6],
    'H': [1350, 6],
};

function auf() {
    return randFromArray(['','U','U\'','U2']);
}

function m2() {
    return randFromArray(['','M2']);
}

function randFromArray(options) {
    return options[(Math.random()*options.length)|0];
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
