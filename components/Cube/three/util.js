import { texture } from './texture';

function hash2hex(str) {
    return parseInt(str.slice(1), 16);
}

function resize(camera, renderer) {

    return () => {
        camera.aspect = (window.innerWidth) / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    };    

}


function face({ input, name, scene, x, y, z, callback }) {

    return input.map((facelet, i) => {

        let stk = sticker({ x: x(i), z: z(i), y: y(i) });
        stk.material.color.setHex( hash2hex(facelet) );
        scene.add(stk.mesh);
        callback && callback(stk);

        // 'object' property on intersects
        stk.mesh.__data__ = {
            face: name, index: i
        };
        return stk;

    });

}


function sticker({ x = 0, y = 0, z = 0 }) {

    let geometry = new THREE.BoxGeometry( 230, 0, 230 );
    let material = new THREE.MeshBasicMaterial({ map: texture() });
    material.transparent = true;
    material.map && (material.map.minFilter = THREE.LinearFilter);

    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    return { geometry, material, mesh };
}


export { hash2hex, sticker, resize, face };

