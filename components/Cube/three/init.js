import { autorun } from 'mobx';
import config from '#state/config';
import cube from '#state/cube';
import { texture } from './texture';
import Controls from './controls';
import { hash2hex, face, sticker, resize } from './util';

let disposers;

export function init(node) {

    if (!node) {
        // node is unmounting...
        disposers.forEach((disposer) => disposer());
        return;
    }

    let { uFace, fFace, rFace, lFace, bFace, dFace } = cube;

    let width = window.innerWidth, height = window.innerHeight;

    // cause a scene

    let scene = new THREE.Scene();

    // add stickers to geometry

    let faces, radius = 440;

    let [U,F,R,D,B,L] = faces = [
        face({
            input: uFace, name: 'U',
            x: (i) => ((i%3) * 300) -300,
            y: () => radius,
            z: (i) => (((i/3)|0) * 300) -300,
            scene
        }),
        face({
            input: fFace, name: 'F',
            x: (i) => ((i%3) * 300) -300,
            y: (i) => 300 - (((i/3)|0) * 300),
            z: (i) => radius,
            callback: (stk) => { stk.mesh.rotation.x = Math.PI / 2; },
            scene
        }),
        face({
            input: rFace, name: 'R',
            x: (i) => radius,
            y: (i) => 300 - (((i/3)|0) * 300),
            z: (i) => 300 - ((i%3) * 300),
            callback: (stk) => { stk.mesh.rotation.z = Math.PI /2; },
            scene
        }),
        face({
            input: dFace.reverse(), name: 'D',
            x: (i) => ((i%3) * 300) -300,
            y: (i) => -radius,
            z: (i) => 300 - (((i/3)|0) * 300),
            scene
        }),
        face({
            input: bFace, name: 'B',
            x: (i) => 300 - ((i%3) * 300),
            y: (i) => 300 - (((i/3)|0) * 300),
            z: (i) => -radius,
            callback: (stk) => { stk.mesh.rotation.x = Math.PI / 2; },
            scene
        }),
        face({
            input: lFace, name: 'L',
            x: (i) => -radius,
            y: (i) => 300 - (((i/3)|0) * 300),
            z: (i) => ((i%3) * 300) -300,
            callback: (stk) => { stk.mesh.rotation.z = Math.PI /2; },
            scene
        })
    ];

    // setup camera

    let camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
    camera.position.z = 2000;

    // load renderer
    
    let renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    // renderer.setClearColor(0x272b33, 1);
    renderer.setSize( width, height );

    // append renderer to DOM
    
    node && node.appendChild( renderer.domElement );

    disposers = [
        autorun(() => {
            // update colours

            cube.uFace.forEach((facelet, i) => {
                let material = U[i].material;
                material.opacity = config.opacity;
                material.color.setHex( hash2hex(facelet) );
            });

            cube.fFace.forEach((facelet, i) => {
                let material = F[i].material;
                material.opacity = config.opacity;
                material.color.setHex( hash2hex(facelet) );
            });

            cube.rFace.forEach((facelet, i) => {
                let material = R[i].material;
                material.opacity = config.opacity;
                material.color.setHex( hash2hex(facelet) );
            });

            cube.lFace.forEach((facelet, i) => {
                let material = L[i].material;
                material.opacity = config.opacity;
                material.color.setHex( hash2hex(facelet) );
            });

            cube.dFace.forEach((facelet, i) => {
                let material = D[i].material;
                material.opacity = config.opacity;
                material.color.setHex( hash2hex(facelet) );
            });
            cube.bFace.forEach((facelet, i) => {
                let material = B[i].material;
                material.opacity = config.opacity;
                material.color.setHex( hash2hex(facelet) );
            });


        }),
        autorun(() => {
            faces
                .forEach((face) => {
                    face.forEach((sticker) => {
                        let { material, geometry } = sticker;

                        material.map = texture();
                        material.needsUpdate = true;
                    });
                });

            camera.fov = 85/config.scale;
            camera.updateProjectionMatrix();
        }),
        (() => {

            let onResize = resize(camera, renderer);
            window.addEventListener('resize', onResize);

            let controls = new Controls(camera, renderer.domElement, faces);

            let loop = () => {
                loop && requestAnimationFrame(loop);        
                renderer.render(scene, camera);
            };

            loop();

            return () => {
                window.removeEventListener('resize', onResize);
                controls.dispose();
                loop = null;
            };
        })(),
    ];
}