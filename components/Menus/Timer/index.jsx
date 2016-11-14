import { observer } from 'mobx-react';

import cube from '../../../state/cube';
import styles from './styles.scss';

@observer
class Timer extends React.Component {

    state = {
        simple: true
    }

    constructor(props) {
        super(props);


    }

    render() {

        return <div>

            <div>
                <strong>Status:</strong> {cube.state}
            </div>

            {cube.scramble && <div>
                <strong>Scramble:</strong> {cube.scramble}
            </div>}

            {cube.timer != 0 && <div className={styles.timer}>
                {cube.timer}
            </div>}
        </div>;
    }
}


export default Timer;