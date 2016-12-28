import { observer } from 'mobx-react';
import styles from './styles.scss';

import DeleteIcon from 'react-icons/lib/go/x';
import AddIcon from 'react-icons/lib/go/plus';
import config from '#state/config';

@observer
class Keymap extends React.Component {

    constructor(props) {
        super(props);

        this.addKeymap = () => {
            config.keymapArray.unshift(['','']);
        };
    }

    render() {
        let { keymapArray } = config;
        return <div>

            <div className={styles.add} onClick={this.addKeymap}>
                Add new keymap <AddIcon/>
            </div>
            
            {keymapArray.map((map, i) => 
                <Mapping key={i} map={map} array={keymapArray}/>)}
        </div>;
    }
}

@observer
class Mapping extends React.Component {

    constructor(props) {
        super(props);

        this.onChangeKey = (e) => {
            this.props.map[0] = e.target.value.slice(-1);
        };

        this.onChangeMove = (e) => {
            this.props.map[1] = e.target.value;
        };

        this.delete = () => {
            let { array, map } = this.props;
            array.replace(array.filter((d) => d != map));
        };
    }


    render() {

        let { map } = this.props;

        let [key, move] = map;

        return <div className={styles.wrapper}>
            <input
                type="text"
                value={key}
                placeholder="key"
                className={styles.key}
                onChange={this.onChangeKey}/>

            <input
                type="text"
                value={move}
                placeholder="move(s)"
                className={styles.move}
                onChange={this.onChangeMove}/>

            <DeleteIcon
                onClick={this.delete}
                className={styles.delete}/>
        </div>;
    }
}



export default Keymap;