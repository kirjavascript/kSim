import { observer } from 'mobx-react';
import styles from './styles.scss';
import Down from 'react-icons/lib/go/chevron-down';
import config from '../../state/config';

@observer
class Menus extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = (e) => {
            config.opacity = +e.target.value;
        };

        this.onScale = (e) => {
            config.scale = +e.target.value;
        };

        this.onBorder = (e) => {
            config.strokeWidth = +e.target.value;
        };
    }

    render() {
        return <div>

            <div className={styles.left}>
                asd
                <Down/>
                <div className={styles.slide}>
                    <input type="range"
                        min="0.2"
                        step="0.01"
                        value={config.opacity}
                        onChange={this.onChange}
                        max={1}/>
                </div>
                <div className={styles.slide}>
                    <input type="range"
                        min="0.5"
                        step="0.01"
                        value={config.scale}
                        onChange={this.onScale}
                        max={3}/>
                </div>
                <div className={styles.slide}>
                    <input type="range"
                        min="0"
                        step="0.1"
                        value={config.strokeWidth}
                        onChange={this.onBorder}
                        max={5}/>
                </div>
            </div>

        </div>;
    }

}

export default Menus;