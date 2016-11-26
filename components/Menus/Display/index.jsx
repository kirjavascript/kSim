import { observer } from 'mobx-react';
import { Motion, spring } from 'react-motion';
import config from '../../../state/config';
import cube from '../../../state/cube';
import Slider from '../slider.jsx';
import Select from '../select.jsx';
import Checkbox from '../checkbox.jsx';
import styles from './styles.scss';

import { ChromePicker } from 'react-color';

@observer
class Display extends React.Component {

    state = {
        showPicker: false,
        colourIndex: 0
    }

    constructor(props) {
        super(props);

        this.toggleBorder = (value) => {
            config.faceletBorder = +value;
        };

        this.colourPickFace = (id) => {
            this.setState({
                showPicker: true,
                colourIndex: id
            });
        };

        this.colourMouseLeave = () => {
            this.setState({
                showPicker: false
            });
        };

        this.setColour = (value) => {
            cube.colours[this.state.colourIndex] = value.hex;
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
                    options={[
                        ['classic','Classic'],
                        ['box','Flat'],
                        ['3','Three'],
                    ]}
                    editable={false}
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

            {config.display.type == 3 && <div>

                <Slider
                    name="Phi"
                    min="0"
                    step="0.01"
                    max="3.15"
                    reset={0.7857963267948965}
                    obj={config.display.spherical}
                    accessor="phi" />

                <Slider
                    name="Theta"
                    min="-3.15"
                    step="0.01"
                    max="3.15"
                    reset={0}
                    obj={config.display.spherical}
                    accessor="theta" />

            </div>}

            <Checkbox
                label="Facelet Borders"
                checked={!!config.faceletBorder}
                onToggle={this.toggleBorder}/>

            <div onMouseLeave={this.colourMouseLeave} style={{overflow:'hidden'}}>
                <Motion
                    defaultStyle={{marginTop:-272, opacity: 0}}
                    style={{
                        marginTop: spring(this.state.showPicker?0:-272),
                        opacity: spring(+this.state.showPicker)
                    }}>
                    {(style) => <div 
                        className={styles.picker} 
                        style={{
                            ...style,
                            display: style.opacity ? 'block' : 'none'
                        }}>
                        <ChromePicker
                            onChange={this.setColour}
                            color={cube.colours[this.state.colourIndex]}
                            className={styles.picker} />
                    </div>}
                </Motion>
                <div className={styles.flex}>
                    {cube.colours.map(((colour,i) =>
                        <Colour 
                            onPickFace={this.colourPickFace}
                            colour={colour}
                            id={i}
                            key={i} />
                    ))}
                </div>
            </div>

        </div>;
    }

}

@observer
class Colour extends React.Component {

    onClick = () => {
        this.props.onPickFace(this.props.id);
    };

    render() {
        return (
            <div 
                onClick={this.onClick}
                className={styles.colour}
                style={{backgroundColor: this.props.colour}}>
            </div>
        );
    }
}

export default Display;