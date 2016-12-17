import DownIcon from 'react-icons/lib/go/chevron-down';
import styles from './select.scss';

class Select extends React.Component {

    state = {
        focus: false
    }

    nativeInput = (e) => {
        this.props.onSelect(e.target.value);
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

            {!focus && <div className={styles.input} onMouseEnter={this.onFocus}>
                {value}
            </div>}

            {focus && <select
                value={value}
                onMouseLeave={this.onBlur}
                onChange={this.nativeInput}>
                {options
                    .map((option) => ({value:option[0],text:option[1]}))
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