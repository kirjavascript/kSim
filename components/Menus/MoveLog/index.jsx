import { observer } from 'mobx-react';

import cube from '../../../state/cube';
import alg from '../../../lib/alg';
import Checkbox from '../checkbox.jsx';
import Slider from '../slider.jsx';
import styles from './styles.scss';

function simplify(moves) {
    try {
        return alg.cube.simplify(moves);
    }
    catch (e) {
        return `${e}`;
    }
}

@observer
class MoveLog extends React.Component {

    state = {
        simple: true
    }

    constructor(props) {
        super(props);

        this.toggleSimple = (simple) => {
            this.setState({simple});
        };

        this.mutateHistory = (value) => {
            let moves = cube.history.toJS().slice().splice(0, value);
            cube.softReset();
            cube.doMoves(cube.scramble, true);
            cube.doMoves(moves.join(''), true);
        };
    }

    render() {

        let moves = this.state.simple ? 
            simplify(cube.history.join(' ')) : 
            cube.history.join(' ');

        return <div>
            <Slider
                name={`Traverse Moves ${cube.historyMove}/${cube.history.length}`}
                min="0"
                step="1"
                max={cube.history.length}
                obj={cube}
                accessor="historyMove"
                onMutate={this.mutateHistory}/>

            {moves}
            <div className={styles.condense}>
                <Checkbox
                    label="Condense moves"
                    checked={this.state.simple}
                    onToggle={this.toggleSimple}/>
            </div>


        </div>;
    }
}


export default MoveLog;