import { observer } from 'mobx-react';

import cube from '#state/cube';
import styles from './styles.scss';
import Select from '../select.jsx';
import Times from './times.jsx';

@observer
class Timer extends React.Component {

    state = {
        simple: true
    }

    onSetScrambler = (value) => {
        cube.scrambler = value;
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

            <Select
                value={cube.scrambler}
                options={{
                    'Random': 'Random State',
                    'LL': 'LL',
                    'CLL': 'CLL',
                    'ELL': 'ELL',
                    'OLL': 'OLL',
                    'PLL': 'PLL',
                    'CMLL': 'CMLL',
                    'LSLL': 'LSLL',
                    '2GLL': '2GLL',
                    'ZBLL': 'ZBLL',
                    
                    'ZBLL U': 'ZBLL U',
                    'ZBLL T': 'ZBLL T',
                    'ZBLL AS': 'ZBLL AS',
                    'ZBLL S': 'ZBLL S',
                    'ZBLL Pi': 'ZBLL Pi',
                    'ZBLL H': 'ZBLL H',

                    'OLLCP': 'OLLCP',

                    'OLLCP U': 'OLLCP U',
                    'OLLCP T': 'OLLCP T',
                    'OLLCP AS': 'OLLCP AS',
                    'OLLCP S': 'OLLCP S',
                    'OLLCP Pi': 'OLLCP Pi',
                    'OLLCP H': 'OLLCP H',

                    'Edge': 'Edges Only',
                    'Corner': 'Corners Only',
                }}
                onSelect={this.onSetScrambler}/>
            
        </div>;
    }
}


export default Timer;