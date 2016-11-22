import { render } from 'react-dom';
import { observer } from 'mobx-react';

import styles from './root.scss';
import cube from '../state/cube';

import CubeUI from './Cube/index.jsx';
import Menus from './Menus/index.jsx';

@observer
class Root extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let { cube } = this.props;

        return <div>

            <h1>kSim</h1>

            <Menus />

            <CubeUI />

            {false && __DEV__ && <pre className={styles.debug}>
                {JSON.stringify(cube.acube,null,4)}
            </pre>}
            

        </div>;
    }

}

document.addEventListener('DOMContentLoaded', () => {
    let node = document.body.appendChild(document.createElement('section'));
    render(<Root cube={cube}/>, node);
});

