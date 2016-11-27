import { autorun } from 'mobx';
import config from '../../../state/config';
import cube from '../../../state/cube';
import { texture } from './texture';
import Controls from './controls';
import { hash2hex, sticker, resize } from './util';

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

    let radius = 440;
    
    let U = uFace.map((facelet, i) => {
        let stk = sticker({
            x: ((i%3) * 300) -300, z: (((i/3)|0) * 300) -300, y: radius
        });
        stk.material.color.setHex( hash2hex(facelet) );
        scene.add( stk.mesh );

        stk.mesh.__data__ = 'U';
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

    let faces = [U,F,R,D,B,L];

    disposers = [
        (() => {

            let loop = () => {
                loop && requestAnimationFrame(loop);        
                renderer.render(scene, camera);
            };

            loop();

            let onResize = resize(camera, renderer);
            window.addEventListener('resize', onResize);

            let controls = new Controls(camera, renderer.domElement, faces);

            return () => {
                window.removeEventListener('resize', onResize);
                controls.dispose();
                loop = null;
            };
        })(),
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
        })
    ];
}