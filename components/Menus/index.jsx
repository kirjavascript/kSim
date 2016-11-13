import { observer } from 'mobx-react';
import styles from './styles.scss';
import config from '../../state/config';
import Menu from './menu.jsx';
import Keymap from './Keymap/index.jsx';
import MoveLog from './MoveLog/index.jsx';
import Display from './Display/index.jsx';

@observer
class Menus extends React.Component {

    render() {
        return <div>
            <div className={styles.left}>
                <Menu title="Display" name="display">
                    <Display />
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