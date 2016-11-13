import { observer } from 'mobx-react';

import cube from '../../../state/cube';
// import alg from '../../../lib/alg';
// import Checkbox from '../checkbox.jsx';
// import Slider from '../slider.jsx';
// import styles from './styles.scss';

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
            {cube.timer}
        </div>;
    }
}


export default Timer;