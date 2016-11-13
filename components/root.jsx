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

            <h1>
                <a href="http://www.github.com/kirjavascript/kSim" target="_blank">
                &lt;<span>kSim</span>/&gt;
                </a>
            </h1>

            <Menus />

            <CubeUI cube={cube} />

            {false && __DEV__ && <pre className={styles.debug}>
                {JSON.stringify(cube.history,null,4)}
            </pre>}
            
        </div>;
    }

}

render(<Root cube={cube}/>, document.querySelector('#root'));