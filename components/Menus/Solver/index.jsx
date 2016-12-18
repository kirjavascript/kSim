import { observer } from 'mobx-react';

import alg from '../../../lib/alg';
import Checkbox from '../checkbox.jsx';
import Slider from '../slider.jsx';
import Select from '../select.jsx';
import styles from './styles.scss';

import cube from '../../../state/cube';
import config from '../../../state/config';

import '!!script-loader!../../../lib/acube';
let { init, solve } = window.__acube__;

init(config);

@observer
class Solver extends React.Component {


    constructor(props) {
        super(props);

        this.toggleSlices = (value) => {
            config.acube.slices = value;
        };
        this.toggleAll = (value) => {
            config.acube.all = value;
        };
        this.toggleOptimal = (value) => {
            config.acube.optimal = value;
        };
        this.onSelect = (value) => {
            config.acube.metric = value;
        };


        this.solve = () => {
            if (cube.solved) {
                config.acube.output.replace([]);
            }
            else {
                solve(cube.acube);
            }
        };
    }

    render() {

        let { slices, all, optimal, metric, output } = config.acube;

        return <div>

            <div className={styles.wrapper}>
                <div className={styles.button} onClick={this.solve}>
                    {config.acube.status == 'idle' ? 'Start' : 'Stop'}
                </div>

                <div className={styles.metric}>
                    <Select
                        value={metric}
                        options={{
                            'FTM': 'HTM',
                            'QTM': 'QTM',
                            'STM': 'STM',
                        }}
                        onSelect={this.onSelect}/>

                </div>
            </div>  

            <Checkbox
                className={styles.input}
                label="Slices"
                checked={slices} onToggle={this.toggleSlices}/>
            <Checkbox
                className={styles.input}
                label="All"
                checked={all} onToggle={this.toggleAll}/>
            <Checkbox
                className={styles.input}
                label="Optimal"
                checked={optimal} onToggle={this.toggleOptimal}/>

            <div>
                <strong>State:</strong> {cube.acube}
            </div>

            {!!output.length && <div className={styles.output}>
                {Array.from(output).map((line,i) => {
                    let match = line.match(/([^\(]*) \(([^\)]*q[^\)]*f[^\)]*s)\)/);
                    return do {
                        if (match) {
                            <div key={i} className={styles.alg}>
                                <strong>{match[1]}</strong>
                                <div>{match[2]}</div>
                            </div>;
                        }
                        else {
                            <div key={i}>{line}</div>;
                        }
                    };
                })}
            </div>}

        </div>;
    }
}


export default Solver;