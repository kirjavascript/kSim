import { observer } from 'mobx-react';

import alg from '../../../lib/alg';
import Checkbox from '../checkbox.jsx';
import Slider from '../slider.jsx';
import Select from '../select.jsx';
import styles from './styles.scss';

import cube from '../../../state/cube';
import acube from './acube.js';

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
            console.log(value);
        };

    }

    render() {

        let { slices, all, optimal, metric } = config.acube;

        return <div>

            <div className={styles.wrapper}>
                <div className={styles.button} onClick={acube.solve}>
                    {config.acube.status == 'idle' ? 'Start' : 'Stop'}
                </div>

                <div className={styles.metric}>
                    <Select
                        value={metric}
                        options={[
                            ['FTM','FTM'],
                            ['QTM','QTM'],
                            ['STM','STM'],
                        ]}
                        editable={false}
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

            <pre>{config.acube.output}</pre>

        </div>;
    }
}


export default Solver;