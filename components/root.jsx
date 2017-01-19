import { render } from 'react-dom';
import { observer } from 'mobx-react';

import styles from './root.scss';
import cube from '#state/cube';

import CubeUI from './Cube/';
import Menus from './Menus/';

@observer
class Root extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let { cube } = this.props;

        return <main>

            <h1>kSim</h1>

            <Menus />

            <CubeUI />

        </main>;
    }

}

document.addEventListener('DOMContentLoaded', () => {
    let node = document.body.appendChild(document.createElement('section'));
    render(<Root cube={cube}/>, node);
    // hide react
    node.firstChild.removeAttribute('data-reactroot');
    document.body.replaceChild(node.firstChild, node);
});

// favicon
let link =  document.createElement('link');
link.rel = 'icon';
link.type = 'image/png';
link.href = 'data:image/png;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAc2nAADMrJwB4w4YAwLKmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIiIiIiIiIAAjMyMzIzMiACMzIzMjMyEgIzMjMyMzIRIiIiIiIiIhESMzIzMjMyIRIzMjMyMzISEjMyMzIzMhEiIiIiIiIiERIzMjMyMzIhEjMyMzIzMhISMzIzMjMyESIiIiIiIiIRECREJEQkRCEQAkRCREJEQhAAJEQkRCREIABwAAAAMAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAMAAAADgAAAA';
document.head.appendChild(link);


document.title = 'kSim 2';