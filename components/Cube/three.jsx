import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import config from '../../state/config';
import cube from '../../state/cube';
import styles from './styles.scss';
import Face from './face.jsx';

require('!!three/examples/js/controls/OrbitControls.js');

let scene, camera, renderer, controls;


let width = window.innerWidth, height = window.innerHeight;

function hash2hex(str) {
    return parseInt(str.slice(1), 16);
}

function init(node) {

    let { uFace, fFace, rFace, lFace, bFace, dFace } = cube;

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
            x: radius, z: ((i%3) * 300) -300, y: 300 - (((i/3)|0) * 300)
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


    let faces = [U.F,R,D,B,L];

    
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    // renderer.setClearColor(0x272b33, 1);
    renderer.setSize( width, height );
    
    node.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    autorun(() => {

        // update colours

        cube.uFace.forEach((facelet, i) => {
            U[i].material.color.setHex( hash2hex(facelet) );
        });

        cube.fFace.forEach((facelet, i) => {
            F[i].material.color.setHex( hash2hex(facelet) );
        });

        cube.rFace.forEach((facelet, i) => {
            R[i].material.color.setHex( hash2hex(facelet) );
        });

        cube.lFace.forEach((facelet, i) => {
            L[i].material.color.setHex( hash2hex(facelet) );
        });

        cube.dFace.forEach((facelet, i) => {
            D[i].material.color.setHex( hash2hex(facelet) );
        });
        cube.bFace.forEach((facelet, i) => {
            B[i].material.color.setHex( hash2hex(facelet) );
        });

        camera.fov = 75/config.scale;
        camera.updateProjectionMatrix();
    });

    ~function animate() {
        requestAnimationFrame(animate);        
        renderer.render( scene, camera );
    } ();
}

function sticker({ x = 0, y = 0, z = 0 }) {

    let geometry = new THREE.BoxGeometry( 220, 5, 220 );
    let material = new THREE.MeshBasicMaterial( {opacity: 0.5} );
    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    return { geometry, material, mesh };
}

@observer
export default class extends React.Component {

    constructor(props) {
        super(props);

        this.click = () => {
            material.color.setHex( Math.random()*10000000 );
        };
    }


    shouldComponentUpdate() {
        return false;
    }

    render() {

        return <div style={{
            left: `calc(50% - ${width/2}px)`,
            top: `calc(50% - ${height/2}px)`,
            position: 'absolute'
        }}>
            <div ref={init}></div>
        </div>;
    }
}