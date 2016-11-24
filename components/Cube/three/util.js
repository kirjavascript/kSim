import { texture } from './texture';

function hash2hex(str) {
    return parseInt(str.slice(1), 16);
}

function resize(camera, renderer) {

    return () => {
        camera.aspect = (window.innerWidth / 2) / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth / 2 , window.innerHeight );
    };    

}



function sticker({ x = 0, y = 0, z = 0 }) {

    let geometry = new THREE.BoxGeometry( 220, 0, 220 );
    let material = new THREE.MeshBasicMaterial({ map: texture() });
    material.transparent = true;
    material.map && (material.map.minFilter = THREE.LinearFilter);

    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    return { geometry, material, mesh };
}


export { hash2hex, sticker, resize };

