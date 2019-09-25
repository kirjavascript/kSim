import DownIcon from 'react-icons/lib/go/chevron-down';
import styles from './styles.scss';

class Select extends React.Component {

    state = {
        focus: false
    }

    nativeInput = (e) => {
        this.props.onSelect(e.target.value);
        e.target.blur();
    }

    onFocus = () => {
        this.setState({focus: true});
    }
    onBlur = () => {
        this.setState({focus: false});
    }

    render() {

        let { value, options, ...attrs} = this.props;
        let { focus } = this.state;

        return <div className={styles.wrapper} {...attrs}>
            <div className={styles.arrow}>
                <DownIcon/>
            </div>

            {!true && <input
                value={options[value]}
                className={styles.input}
                readOnly
                onMouseEnter={this.onFocus}/>}

            {true && <select
                value={value}
                onMouseLeave={this.onBlur}
                onChange={this.nativeInput}>
                {Object.keys(options)
                    .map((value) => ({value, text: options[value]}))
                    .map((option,i) => (
                    <option key={i} value={option.value}>
                        {option.text}
                    </option>
                ))}
            </select>}
        </div>;
    }

}

export default Select;
