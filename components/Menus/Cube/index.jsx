import { observer } from 'mobx-react';
import styles from './styles.scss';
import { Motion, spring } from 'react-motion';
import { ChromePicker } from 'react-color';

import cube from '#state/cube';
import Select from '../select.jsx';

@observer
class Timer extends React.Component {

    state = {
        showPicker: false,
        colourIndex: 0
    }

    onSetScrambler = (value) => {
        cube.scrambler = value;
    }

    onSetOrientation = (e) => {
        // set solved paint thing
        cube.colours.replace(cube.centres.map((centre) => cube.colours[centre]));
        cube.reset();

        e.target.blur();
    }

    colourPickFace = (id) => {
        this.setState({
            showPicker: true,
            colourIndex: id
        });
    };

    colourMouseLeave = () => {
        this.setState({
            showPicker: false
        });
    };

    setColour = (value) => {
        cube.colours[this.state.colourIndex] = value.hex;
    };

    render() {

        return <div>

        <Select
            value={cube.scrambler}
            options={{
                'Random': 'Random State',
                'CMLL': 'CMLL',
                'LSE': 'LSE',
                'LL': 'LL',
                'OLL': 'OLL',
                'PLL': 'PLL',
                'CLL': 'CLL',
                'ELL': 'ELL',
                'LSLL': 'LSLL',
                '2GLL': '2GLL',
                'ZBLL': 'ZBLL',
                
                'ZBLL U': 'ZBLL U',
                'ZBLL T': 'ZBLL T',
                'ZBLL AS': 'ZBLL AS',
                'ZBLL S': 'ZBLL S',
                'ZBLL Pi': 'ZBLL Pi',
                'ZBLL H': 'ZBLL H',

                'OLLCP': 'OLLCP',

                'OLLCP U': 'OLLCP U',
                'OLLCP T': 'OLLCP T',
                'OLLCP AS': 'OLLCP AS',
                'OLLCP S': 'OLLCP S',
                'OLLCP Pi': 'OLLCP Pi',
                'OLLCP H': 'OLLCP H',

                'Edge': 'Edges Only',
                'Corner': 'Corners Only',
            }}
            onSelect={this.onSetScrambler}/>

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

            <button onClick={this.onSetOrientation} className={styles.orient}>
                Set Scramble Orientation
            </button>



            
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


export default Timer;