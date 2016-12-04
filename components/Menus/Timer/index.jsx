import { observer } from 'mobx-react';

import cube from '../../../state/cube';
import styles from './styles.scss';
import Select from '../select.jsx';
import Times from './times.jsx';

@observer
class Timer extends React.Component {

    state = {
        simple: true
    }

    constructor(props) {
        super(props);

        this.setScrambler = (value) => {
            cube.scrambler = value;
        };

    }

    render() {

        return <div>

            <div className={styles.info}>
                <strong>Status:</strong> {cube.state}
            </div>

            {cube.scramble && <div className={styles.info}>
                <strong>Scramble:</strong> {cube.scramble}
            </div>}

            {cube.timer != 0 && <div className={styles.timer}>
                {cube.timer}
            </div>}
            
            <Times/>

            {false && <Select
                value={cube.scrambler}
                options={[
                    ['Random','Random'],
                    ['LL','LL'],
                    ['LSLL','LSLL'],
                ]}
                editable={false}
                onSelect={this.setScrambler}/>}
        </div>;
    }
}


export default Timer;