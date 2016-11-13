import { observer } from 'mobx-react';
import config from '../../../state/config';
import Slider from '../slider.jsx';
import Checkbox from '../checkbox.jsx';

@observer
class Menus extends React.Component {

    constructor(props) {
        super(props);

        this.toggleBorder = (value) => {
            config.faceletBorder = +value;
        };
    }

    render() {
        return <div>
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

            <Checkbox
                label="Facelet Borders"
                checked={!!config.faceletBorder}
                onToggle={this.toggleBorder}/>
        </div>;
    }

}

export default Menus;