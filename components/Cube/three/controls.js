import { autorun } from 'mobx';
import config from '../../../state/config';

let Controls = function (camera, domElement, faces) {

    let scope = this;

    let mobXDisposer;

    // "target" sets the location of focus, where the camera orbits around
    let target = new THREE.Vector3();

    // current position in spherical coordinates
    let spherical = new THREE.Spherical();
    let sphericalDelta = new THREE.Spherical();

    let zoomChanged = false;

    let rotateStart = new THREE.Vector2();
    let rotateEnd = new THREE.Vector2();
    let rotateDelta = new THREE.Vector2();

    // for reset
    let target0 = target.clone();
    let position0 =camera.position.clone();
    let zoom0 =camera.zoom;

    function reset () {

        target.copy( target0 );
        camera.position.copy( position0 );
        camera.zoom = zoom0;

        camera.updateProjectionMatrix();
        scope.dispatchEvent({ type: 'change' });

    }

    let update = (() => {

        let offset = new THREE.Vector3();

        // so camera.up is the orbit axis
        let quat = new THREE.Quaternion().setFromUnitVectors( camera.up, new THREE.Vector3( 0, 1, 0 ) );
        let quatInverse = quat.clone().inverse();

        let lastPosition = new THREE.Vector3();
        let lastQuaternion = new THREE.Quaternion();

        return function update () {

            let position = camera.position;

            offset.copy( position ).sub( target );

            // rotate offset to "y-axis-is-up" space
            offset.applyQuaternion( quat );

            // angle from z-axis around y-axis
            spherical.setFromVector3( offset );

            if (config.display.spherical.mutating) {
                spherical.theta += sphericalDelta.theta;
                spherical.phi += sphericalDelta.phi;
            }
            else {
                reset();
                spherical.theta = config.display.spherical.theta;
                spherical.phi = config.display.spherical.phi;
            }

            spherical.makeSafe();

            offset.setFromSpherical(spherical);

            // rotate offset back to "camera-up-vector-is-up" space
            offset.applyQuaternion(quatInverse);

            position.copy(target).add(offset);

            camera.lookAt(target);

            sphericalDelta.set( 0, 0, 0 );

            return false;

        };

    })();


    //
    // internals
    //

    function rotateLeft( angle ) {

        sphericalDelta.theta -= angle;

    }

    function rotateUp( angle ) {

        sphericalDelta.phi -= angle;

    }

    function handleMouseDownRotate( event ) {

        rotateStart.set( event.clientX, event.clientY );

    }

    function handleMouseMoveRotate( event ) {

        //console.log( 'handleMouseMoveRotate' );

        rotateEnd.set( event.clientX, event.clientY );
        rotateDelta.subVectors( rotateEnd, rotateStart );

        let element = domElement === document ? domElement.body : domElement;

        // rotating across whole screen goes 360 degrees around
        rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth );

        // rotating up and down along whole screen attempts to go 360, but limited to 180
        rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

        rotateStart.copy( rotateEnd );

        update();

    }

    function onMouseDown( event ) {

        event.preventDefault();

        handleMouseDownRotate( event );

        document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'mouseup', onMouseUp, false );

        scope.dispatchEvent({ type: 'start' });
        config.display.spherical.mutating = true;
    }

    function onMouseMove( event ) {

        event.preventDefault();

        handleMouseMoveRotate( event );

        Object.assign(config.display.spherical, spherical);
        
    }

    function onMouseUp( event ) {

        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );

        scope.dispatchEvent({ type: 'end' });
        config.display.spherical.mutating = false;
    }

    domElement.addEventListener( 'mousedown', onMouseDown, false );

    // rotateUp(0.785);
    mobXDisposer = autorun(() => {

        if (config.display.spherical.mutating == false) {
            update();
        }

    });

    this.dispose = function() {

        domElement.removeEventListener( 'mousedown', onMouseDown, false );
        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );

        mobXDisposer();
    };

    // facelet clicking

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    domElement.addEventListener('mousedown', (e) => {

        e.preventDefault();

        mouse.x = (( e.clientX / domElement.clientWidth ) * 2 - 1);
        mouse.y = - ( e.clientY / domElement.clientHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        let intersects = raycaster.intersectObjects( [].concat(...faces).map((d) => d.mesh) );

        if ( intersects.length > 0 ) {

            // intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

            // let particle = new THREE.Sprite( particleMaterial );
            // particle.position.copy( intersects[ 0 ].point );
            // particle.scale.x = particle.scale.y = 16;
            // scene.add( particle );

            console.log(intersects);

        }

        /*
        // Parse all the faces
        for ( var i in intersects ) {

            intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );

        }
        */
    }, false );

};

Controls.prototype = Object.create( THREE.EventDispatcher.prototype );


export default Controls;