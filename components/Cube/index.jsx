import { observer } from 'mobx-react';

import Classic from './classic.jsx';
import Box from './box.jsx';
import Isometric from './isometric.jsx';

@observer
class CubeUI extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <Classic />; 
    }
}

export default CubeUI;