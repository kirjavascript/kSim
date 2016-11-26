import { autorun } from 'mobx';
import config from '../../../state/config';

// modified from three/examples/js/controls/OrbitControls.js

let OrbitControls = function ( object, domElement ) {

    let scope = this;

    let mobXDisposer;

    // "target" sets the location of focus, where the object orbits around
    let target = new THREE.Vector3();

    let changeEvent = { type: 'change' };
    let startEvent = { type: 'start' };
    let endEvent = { type: 'end' };

    let EPS = 0.000001;

    // current position in spherical coordinates
    let spherical = new THREE.Spherical();
    let sphericalDelta = new THREE.Spherical();

    let scale = 1;
    let panOffset = new THREE.Vector3();
    let zoomChanged = false;

    let rotateStart = new THREE.Vector2();
    let rotateEnd = new THREE.Vector2();
    let rotateDelta = new THREE.Vector2();

    // How far you can dolly in and out ( PerspectiveCamera only )
    this.minDistance = 0;
    this.maxDistance = Infinity;

    // How far you can zoom in and out ( OrthographicCamera only )
    this.minZoom = 0;
    this.maxZoom = Infinity;

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    this.minAzimuthAngle = - Infinity; // radians
    this.maxAzimuthAngle = Infinity; // radian

    this.rotateSpeed = 1.0;

    // for reset
    this.target0 = target.clone();
    this.position0 =object.position.clone();
    this.zoom0 =object.zoom;

    //
    // public methods
    //

    this.getPolarAngle = function () {

        return spherical.phi;

    };

    this.getAzimuthalAngle = function () {

        return spherical.theta;

    };

    this.reset = function () {

        target.copy( this.target0 );
        object.position.copy( scope.position0 );
        object.zoom = scope.zoom0;

        object.updateProjectionMatrix();
        scope.dispatchEvent( changeEvent );

    };

    // this method is exposed, but perhaps it would be better if we can make it private...
    this.update = function() {

        let offset = new THREE.Vector3();

        // so camera.up is the orbit axis
        let quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
        let quatInverse = quat.clone().inverse();

        let lastPosition = new THREE.Vector3();
        let lastQuaternion = new THREE.Quaternion();

        return function update () {

            let position = object.position;

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
                scope.reset();
                spherical.theta = config.display.spherical.theta;
                spherical.phi = config.display.spherical.phi;
            }

            // restrict theta to be between desired limits
            spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

            // restrict phi to be between desired limits
            spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

            spherical.makeSafe();


            spherical.radius *= scale;

            // restrict radius to be between desired limits
            spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

            // move target to panned location
            target.add( panOffset );

            offset.setFromSpherical( spherical );

            // rotate offset back to "camera-up-vector-is-up" space
            offset.applyQuaternion( quatInverse );

            position.copy( target ).add( offset );

            object.lookAt( target );


            sphericalDelta.set( 0, 0, 0 );

            scale = 1;


            // update condition is:
            // min(camera displacement, camera rotation in radians)^2 > EPS
            // using small-angle approximation cos(x/2) = 1 - x^2 / 8

            if ( zoomChanged ||
                lastPosition.distanceToSquared( object.position ) > EPS ||
                8 * ( 1 - lastQuaternion.dot( object.quaternion ) ) > EPS ) {

                scope.dispatchEvent( changeEvent );

                lastPosition.copy( object.position );
                lastQuaternion.copy( object.quaternion );
                zoomChanged = false;

                return true;

            }

            return false;

        };

    }();

    this.dispose = function() {

        domElement.removeEventListener( 'mousedown', onMouseDown, false );
        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );
        mobXDisposer();

    };

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
        rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

        // rotating up and down along whole screen attempts to go 360, but limited to 180
        rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

        rotateStart.copy( rotateEnd );

        scope.update();

    }

    function onMouseDown( event ) {

        event.preventDefault();

        handleMouseDownRotate( event );

        document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'mouseup', onMouseUp, false );

        scope.dispatchEvent( startEvent );
        config.display.spherical.mutating = true;
    }

    function onMouseMove( event ) {

        event.preventDefault();

        handleMouseMoveRotate( event );

        Object.assign(config.display.spherical, spherical);
        
    }

    function onMouseUp( event ) {

        // handleMouseUp( event );

        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );

        scope.dispatchEvent( endEvent );
        config.display.spherical.mutating = false;
    }

    domElement.addEventListener( 'mousedown', onMouseDown, false );

    // rotateUp(0.785);
    mobXDisposer = autorun(() => {

        if (config.display.spherical.mutating == false) {
            this.update();
        }

    });

};

OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );


export default OrbitControls;