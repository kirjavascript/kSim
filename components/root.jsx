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

        return <section>

            <h1>kSim</h1>

            <Menus />

            <CubeUI cube={cube} />

            {__DEV__ && <pre className={styles.debug}>
                {JSON.stringify(cube.acube,null,4)}
            </pre>}
            

        </section>;
    }

}

render(<Root cube={cube}/>, document.querySelector('#root'));