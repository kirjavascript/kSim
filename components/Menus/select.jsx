/*
    Usage;

    <Select
        {...}
        value={this.state.value}
        name="select-test"
        options={[
            ['value1','text1'],
            ['value2','text2'],
            ['value3','text3'],
        ]}
        numRange={[0,10]}
        editable={false}
        onSelect={this.onSelect}/>

    (options take precedence over numRange)
*/

import { Motion, spring } from 'react-motion';

import DownIcon from 'react-icons/lib/go/chevron-down';
import styles from './select.scss';
let height = 34;

class Select extends React.Component {

    constructor(props) {
        super(props);

        this.selectItem = (e) => {
            let value = e.target.getAttribute('data-value');
            this.props.onSelect(value);
            this.toggle();
        };

        this.nativeInput = (e) => {
            this.props.onSelect(e.target.value);
        };

        this.toggle = () => {
            this.setState({open:this.state.open^1});
        };

        this.onDocumentClick = (e) => {
            // check if click is outside the component
            if (this.state.open == 1 && !this.refs.wrapper.contains(e.target)) {
                this.toggle();
            }
        };

        this.state = {
            open: 0,
            mobile: 0
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.onDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onDocumentClick);
    }

    render() {

        let { 

            value,
            options,
            numRange,
            onSelect,
            editable,
            name,
            ...attrs

        } = this.props;

        let [start, end] = numRange || [1,0];

        let optionList = [];

        // numRange
        if (end > start && !options) {
            optionList = new Array(end-start+1)
                .fill(1)
                .map((d,i) => ({ value: i+start, text: i+start }));
        }
        // options
        else if (options.length) {
            optionList = options
                .map((option) => ({value:option[0],text:option[1]}));
        }

        let displayObj = optionList.find((option) => option.value == value);
        let displayValue = displayObj ? displayObj.text : value;

        return <div 
            ref="wrapper"
            className={styles.wrapper}>



            <input type="hidden" {...attrs} value={value} name={name}/>

            <div style={{display:this.state.mobile?'none':''}}>

                <div
                    style={{zIndex:this.state.open ? 15 : 12}}
                    className={styles.arrow} 
                    onClick={this.toggle}>
                    <DownIcon/>
                </div>

                {do {
                    if (editable) {
                        <input 
                            type="text"
                            placeholder="Select"
                            value={value}
                            style={{zIndex:this.state.open ? 14 : 11}}
                            className={styles['header-input']}
                            onChange={this.nativeInput}/>;
                    }
                    else {
                        <div
                            className={styles['header-div']}
                            style={{zIndex:this.state.open ? 14 : 11}}
                            onClick={this.toggle}>
                            {
                                displayValue
                                || 
                                <span className={styles.placeholder}>Select</span>
                            } 
                        </div>;
                    }
                }}

                {optionList.map((option,i) => (
                    <Motion 
                        key={i}
                        defaultStyle={{top: 0, opacity: 0}}
                        style={{top: spring(this.state.open ? (i+1)*height : 0),
                            opacity: spring(this.state.open ? 1 : 0)}}>
                        {(style) => <div
                            data-value={option.value}
                            style={{
                                ...style,
                                zIndex: this.state.open ? 13 : 10,
                                opacity: this.state.open ? 1 : 0
                            }}
                            onClick={this.selectItem}
                            className={styles.item}>
                            {option.text}
                        </div>}
                    </Motion>
                ))}

            </div>

            <select
                value={value}
                style={{display:this.state.mobile?'':'none'}}
                onChange={this.nativeInput}>
                <option value="">Select...</option>
                {optionList.map((option,i) => (
                    <option key={i} value={option.value}>
                        {option.text}
                    </option>
                ))}
            </select>

        </div>;
    }

}

export default Select;