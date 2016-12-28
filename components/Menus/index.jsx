import styles from './styles.scss';
import Menu from './menu.jsx';
import Keymap from './Keymap/index.jsx';
import Cube from './Cube/index.jsx';
import MoveLog from './MoveLog/index.jsx';
import Display from './Display/index.jsx';
import Solver from './Solver/index.jsx';
import Timer from './Timer/index.jsx';
import CodeIcon from 'react-icons/lib/go/octoface';
import { clearStorage } from '#state/storage';

class Menus extends React.Component {

    render() {
        return <div>
            <div className={styles.left}>

                <Menu title="Cube" name="cube">
                    <Cube />
                </Menu>

                <Menu title="Display" name="display">
                    <Display />
                </Menu>

                <Menu title="Solver" name="solver">
                    <Solver />
                </Menu>

                <Menu title="Keymap" name="keymap">
                    <Keymap />
                </Menu>

            </div>

            <div className={styles.right}>
                <Menu title="Timer" name="timer">
                    <Timer/>
                </Menu>

                <Menu title="Move History" name="movelog">
                    <MoveLog/>
                </Menu>


                <Menu title="About" name="about">

                    <a href="https://github.com/kirjavascript/kSim" target="_blank" rel="noopener">
                        <CodeIcon
                            width="30"
                            height="30"
                            className={styles.code}/>
                    </a>
                    
                    <p style={{marginTop:0}}>kSim 2 by Kirjava</p>

                    <div className={styles.button} onClick={clearStorage}>
                        Clear all data
                    </div>
                </Menu>
            </div>
        </div>;
    }

}

export default Menus;