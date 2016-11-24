import { autorun } from 'mobx';
import config from '../../../state/config';
import cube from '../../../state/cube';
import { texture } from './texture';
require('!!three/examples/js/controls/OrbitControls.js');

import { hash2hex, sticker, resize } from './util';

let loop, reactiveStores, camera, renderer, onResize;

export function init(node) {

    if (!node) {
        // node is unmounting...
        loop = null;
        reactiveStores.forEach((disposer) => disposer());
        window.removeEventListener('resize', onResize);
        return;
    }

    let { uFace, fFace, rFace, lFace, bFace, dFace } = cube;

    let scene, controls;

    let width = window.innerWidth / 2, height = window.innerHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, width / height, 1, 10000 );
    camera.position.z = 3000;

    // add stickers to geometry

    let radius = 440;
    
    let U = uFace.map((facelet, i) => {
        let stk = sticker({
            x: ((i%3) * 300) -300, z: (((i/3)|0) * 300) -300, y: radius
        });
        stk.material.color.setHex( hash2hex(facelet) );
        scene.add( stk.mesh );
        return stk;
    });

    let F = fFace.map((facelet, i) => {
        let stk = sticker({
            x: ((i%3) * 300) -300, z: radius, y: 300 - (((i/3)|0) * 300)
        });
        stk.material.color.setHex( hash2hex(facelet) );
        scene.add( stk.mesh );

        stk.mesh.rotation.x = Math.PI / 2;
        return stk;
    });

    let R = rFace.map((facelet, i) => {
        let stk = sticker({
            x: radius, z: 300 - ((i%3) * 300), y: 300 - (((i/3)|0) * 300)
        });
        stk.material.color.setHex( hash2hex(facelet) );
        scene.add( stk.mesh );

        stk.mesh.rotation.z = Math.PI /2;
        return stk;
    });

    let D = dFace.reverse().map((facelet, i) => {
        let stk = sticker({
            x: ((i%3) * 300) -300, z: 300 - (((i/3)|0) * 300), y: -radius
        });
        stk.material.color.setHex( hash2hex(facelet) );
        scene.add( stk.mesh );

        return stk;
    });

    let B = bFace.map((facelet, i) => {
        let stk = sticker({
            x: 300 - ((i%3) * 300), z: -radius, y: 300 - (((i/3)|0) * 300)
        });
        stk.material.color.setHex( hash2hex(facelet) );
        scene.add( stk.mesh );

        stk.mesh.rotation.x = Math.PI / 2;
        return stk;
    });

    let L = lFace.map((facelet, i) => {
        let stk = sticker({
            x: -radius, z: ((i%3) * 300) -300, y: 300 - (((i/3)|0) * 300)
        });
        stk.material.color.setHex( hash2hex(facelet) );
        scene.add( stk.mesh );

        stk.mesh.rotation.z = Math.PI /2;
        return stk;
    });

    
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    // renderer.setClearColor(0x272b33, 1);
    renderer.setSize( width, height );
    
    node && node.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    loop = () => {
        loop && requestAnimationFrame(loop);        
        renderer.render( scene, camera );
    };

    loop();

    onResize = resize(camera, renderer);

    window.addEventListener( 'resize', onResize );

    reactiveStores = [
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

            camera.fov = 75/config.scale;
            camera.updateProjectionMatrix();
        }),
        autorun(() => {
            [U,F,R,D,B,L]
                .forEach((face) => {
                    face.forEach((sticker) => {
                        let { material } = sticker;

                        material.map = texture();
                        material.needsUpdate = true;

                    });
                });
        })
    ];
}