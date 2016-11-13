import { observer } from 'mobx-react';
import styles from './styles.scss';
import config from '../../state/config';
import Menu from './menu.jsx';
import Slider from './slider.jsx';
import Keymap from './Keymap/index.jsx';
import MoveLog from './MoveLog/index.jsx';

@observer
class Menus extends React.Component {

    render() {
        return <div>
            <div className={styles.left}>

                <Menu title="Display" name="display">
                    <Slider
                        name="Opacity"
                        min="0.2"
                        step="0.01"
                        obj={config}
                        accessor="opacity" />

                    <Slider
                        name="Zoom"
                        min="0.5"
                        step="0.01"
                        max="2"
                        obj={config}
                        accessor="scale" />

                    <Slider
                        name="Border"
                        max="5"
                        obj={config}
                        accessor="strokeWidth" />
                </Menu>

                <Menu title="Keymap" name="keymap">
                    <Keymap config={config} />
                </Menu>
            </div>

            <div className={styles.right}>
                <Menu title="Move History" name="movelog">
                    <MoveLog/>
                </Menu>
            </div>
        </div>;
    }

}

export default Menus;