import { observer } from 'mobx-react';
import config from '#state/config';

import Classic from './classic';
import Box from './box';
import Three from './three/';

@observer
class CubeUI extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return do {
            if (config.display.type == 'three') {
                <Three/>;
            }
            else if (config.display.type == 'flat') {
                <Box/>;
            }
            else {
                <Classic />; 
            }
        };
    }
}

export default CubeUI;