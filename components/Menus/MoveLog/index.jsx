import { observer } from 'mobx-react';

import cube from '../../../state/cube';
import alg from '../../../lib/alg';

@observer
class MoveLog extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return <div>
            {alg.cube.simplify(cube.history.join(' '))}
        </div>;
    }
}


export default MoveLog;