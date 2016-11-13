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
            <CubeUI cube={cube} />
            <Menus />
        </div>;
    }

}

render(<Root cube={cube}/>, document.querySelector('#root'));