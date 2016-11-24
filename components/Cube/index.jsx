import { observer } from 'mobx-react';
import config from '../../state/config';

import Classic from './classic.jsx';
import Box from './box.jsx';
import Isometric from './isometric.jsx';
import Three from './three/index.jsx';

@observer
class CubeUI extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return do {
            if (config.display.type == '3') {
                <Three/>;
            }
            else if (config.display.type == 'box') {
                <Box/>;
            }
            else {
                <Classic />; 
            }
        };
    }
}

export default CubeUI;