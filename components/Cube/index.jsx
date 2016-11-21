import { observer } from 'mobx-react';

import Classic from './classic.jsx';
import Box from './box.jsx';

@observer
class CubeUI extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <Box />; 
    }
}

export default CubeUI;