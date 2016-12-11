import { observer } from 'mobx-react';

import cube from '../../../state/cube';
import { yellow, green, red, lightgrey } from '!!sass-variables!../../variables.scss';
import styles from './styles.scss';

@observer
export default class extends React.Component {

    constructor(props) {
        super(props);

        this.resetTimes = () => {
            cube.rawTimes.replace([]);
            cube.reset();
        };
    }

    render() {
        let { times } = cube;
        let { list, best5, current5, best12, current12, best100, current100 } = times;

        return !! cube.rawTimes.length && <div>

            {best5 && <div className={styles.info}>
                <strong>Best 5: </strong> {best5.time} <br />
                <strong>Current 5: </strong> {current5}
            </div>}

            {best12 && <div className={styles.info}>
                <strong>Best 12: </strong> {best12.time} <br />
                <strong>Current 12: </strong> {current12}
            </div>}

            {best100 && <div className={styles.info}>
                <strong>Best 100: </strong> {best100.time} <br />
                <strong>Current 100: </strong> {current100}
            </div>}

            <div className={styles.times}>
                <button
                    onClick={this.resetTimes}
                    className={styles.clear}>
                    reset
                </button>
                {list.map((time, i) => {
                    let { best, best5, best5max, best5min, value } = time;
                    return <span key={i} style={{
                        fontWeight: best5 ? 'bold' : 'normal',
                        color: do { if (best) yellow;
                            else if (best5min) green;
                            else if (best5max) red; },
                    }}> {value} </span>;
                })}
            </div>
            
        </div>;
    }
}

