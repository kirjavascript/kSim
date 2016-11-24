import config from '../../../state/config';

let texture;

function getTexture() {

    if (config.faceletBorder == 0) {
        return null;
    }
    else {
        if (!texture) {
            let canvas = document.createElement('canvas');

            canvas.width = 64;
            canvas.height = 64;
            let ctx = canvas.getContext('2d');

            document.body.appendChild(canvas);
            ctx.fillRect(0,0,64,64);
            ctx.fillStyle = 'white';
            ctx.fillRect(3,3,58,58);

            texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            document.body.removeChild(canvas);

        }

        return texture;
    }

}


export {
    getTexture as texture,
};

