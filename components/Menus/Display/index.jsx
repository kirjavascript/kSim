import { observer } from 'mobx-react';
import config from '#state/config';
import cube from '#state/cube';
import Slider from '#components/UI/Slider/';
import Select from '#components/UI/Select/';
import Checkbox from '#components/UI/Checkbox/';
import styles from './styles.scss';


@observer
class Display extends React.Component {

    constructor(props) {
        super(props);

        this.toggleBorder = (value) => {
            config.faceletBorder = +value;
        };

        this.onDisplay = (value) => {
            config.display.type = value;
        };
    }

    render() {
        return <div>

            <div className={styles.layout}>
                <Select
                    value={config.display.type}
                    options={{
                        'classic': 'Classic',
                        'flat': 'Flat',
                        'three': 'Three',
                    }}
                    onSelect={this.onDisplay}/>

            </div>
            <div className={styles.label}>
                View
            </div>

            <Slider
                name="Opacity"
                min="0.2"
                step="0.01"
                obj={config}
                reset={1}
                accessor="opacity" />

            <Slider
                name="Zoom"
                min="0.5"
                step="0.01"
                max="2"
                reset={1}
                obj={config}
                accessor="scale" />

            {config.display.type == 'three' && <div>

                <Slider
                    name="X"
                    min="0"
                    step="0.001"
                    max="3.15"
                    reset={0.7857963267948965}
                    obj={config.display.spherical}
                    accessor="phi" />

                <Slider
                    name="Y"
                    min="-3.15"
                    step="0.001"
                    max="3.15"
                    reset={0}
                    obj={config.display.spherical}
                    accessor="theta" />

            </div>}

            <Checkbox
                label="Facelet Borders"
                checked={!!config.faceletBorder}
                onToggle={this.toggleBorder}/>



        </div>;
    }

}



export default Display;